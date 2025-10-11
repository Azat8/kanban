import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from 'src/task/entities/task.entity';

@Injectable()
export class AvailabilityService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async hasOverlap(
    userId: number,
    startDate: Date,
    endDate: Date,
    excludeTaskId?: number,
  ): Promise<boolean> {
    const count = await this.taskRepository
      .createQueryBuilder('task')
      .where('task.assignedUserId = :userId', { userId })
      .andWhere('task.startDate < :endDate AND task.endDate > :startDate', {
        startDate,
        endDate,
      })
      .andWhere(excludeTaskId ? 'task.id != :excludeTaskId' : '1=1', {
        excludeTaskId,
      })
      .getCount();

    return count > 0;
  }

  async isAvailable(
    userId: number,
    startDate: Date,
    endDate: Date,
    excludeTaskId?: number,
  ): Promise<boolean> {
    return !(await this.hasOverlap(userId, startDate, endDate, excludeTaskId));
  }
}
