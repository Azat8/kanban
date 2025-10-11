import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { User, UserRole } from 'src/user/entities/user.entity';
import { AvailabilityService } from 'src/common/availability/availability.service';
import { NotificationsGateway } from 'src/notifications/notifications.gateway';
import { TaskFiltersDto } from './dto/task-filters.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly availabilityService: AvailabilityService,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  async create(dto: CreateTaskDto, currentUser: User) {
    if (currentUser.role !== UserRole.manager) {
      throw new ForbiddenException('Only managers can create tasks');
    }

    const assignedUser = await this.userRepository.findOneBy({
      id: dto.assignedUserId,
    });
    if (!assignedUser) throw new NotFoundException('Assigned user not found');

    const available = await this.availabilityService.isAvailable(
      assignedUser.id,
      new Date(dto.startDate),
      new Date(dto.endDate),
    );
    if (!available) {
      throw new ForbiddenException(
        'User already has a task during the selected period',
      );
    }

    const task = this.taskRepository.create({
      title: dto.title,
      description: dto.description,
      status: dto.status,
      startDate: dto.startDate,
      endDate: dto.endDate,
      assignedUser,
      createdBy: currentUser,
    });

    const savedTask = await this.taskRepository.save(task);

    this.notificationsGateway.sendTaskNotification(
      assignedUser.id.toString(),
      `You have been assigned a new task: ${savedTask.title}`,
    );

    return savedTask;
  }

  async findAll(user: User, filters: TaskFiltersDto) {
    const query = this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.assignedUser', 'assignedUser')
      .leftJoinAndSelect('task.createdBy', 'createdBy');

    const currentUserColumn =
      user.role === UserRole.employee ? 'assignedUserId' : 'createdById';

    query.where(`task.${currentUserColumn} = :userId`, { userId: user.id });

    if (filters.search) {
      query.andWhere(
        '(task.title LIKE :search OR task.description LIKE :search)',
        {
          search: `%${filters.search}%`,
        },
      );
    }

    if (filters.status) {
      query.andWhere('task.status = :status', { status: filters.status });
    }

    if (filters.user) {
      const userColumnName =
        user.role === UserRole.employee ? 'createdById' : 'assignedUserId';

      query.andWhere(`task.${userColumnName} = :user`, {
        user: +filters.user,
      });
    }

    if (filters.startDate) {
      query.andWhere('task.startDate >= :startDate', {
        startDate: filters.startDate,
      });
    }

    if (filters.endDate) {
      query.andWhere('task.endDate <= :endDate', { endDate: filters.endDate });
    }

    return query.getMany();
  }

  async findOne(id: number) {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['assignedUser', 'createdBy'],
    });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async update(id: number, dto: UpdateTaskDto, currentUser: User) {
    const task = await this.findOne(id);
    if (!task) throw new NotFoundException('Task not found');

    if (dto.assignedUserId && dto.assignedUserId !== task.assignedUser.id) {
      throw new ForbiddenException('Reassigning task is not allowed');
    }

    const changes: string[] = [];

    if (dto.title && dto.title !== task.title) {
      changes.push(`title changed from "${task.title}" to "${dto.title}"`);
    }

    if (dto.description && dto.description !== task.description) {
      changes.push(`description updated`);
    }

    if (dto.status && dto.status !== task.status) {
      changes.push(`status changed from "${task.status}" to "${dto.status}"`);
    }

    const start = new Date(dto.startDate ?? task.startDate);
    const end = new Date(dto.endDate ?? task.endDate);

    if (dto.startDate || dto.endDate) {
      const available = await this.availabilityService.isAvailable(
        task.assignedUser.id,
        start,
        end,
        id,
      );
      if (!available) {
        throw new ForbiddenException(
          'User already has a task during the selected period',
        );
      }
    }

    Object.assign(task, dto);

    const savedTask = await this.taskRepository.save(task);

    if (currentUser.role === UserRole.employee) {
      if (changes.length) {
        this.notificationsGateway.sendTaskNotification(
          savedTask.createdBy.id.toString(),
          `Employee ${currentUser.name} updated task "${savedTask.title}": ${changes.join(', ')}.`,
        );
      }
    } else if (currentUser.role === UserRole.manager) {
      if (changes.length) {
        this.notificationsGateway.sendTaskNotification(
          savedTask.assignedUser.id.toString(),
          `Your task "${savedTask.title}" was updated by your manager: ${changes.join(', ')}.`,
        );
      }
    }

    return savedTask;
  }

  async remove(id: number) {
    const task = await this.findOne(id);
    await this.taskRepository.remove(task);
    this.notificationsGateway.sendTaskNotification(
      task.assignedUser.id.toString(),
      `Task "${task.title}" was removed.`,
    );
    return { message: 'Task deleted successfully' };
  }
}
