import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from 'src/user/entities/user.entity';
import { Task, TaskStatus } from 'src/task/entities/task.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Task) private taskRepo: Repository<Task>,
  ) {}

  async run() {
    const usersCount = await this.userRepo.count();
    const tasksCount = await this.taskRepo.count();

    // If both tables have data, assume seeding has already run
    if (usersCount > 0 && tasksCount > 0) {
      return;
    }

    const users = [
      {
        name: 'Alice Manager',
        email: 'alice@demo.com',
        role: UserRole.manager,
      },
      { name: 'Bob Manager', email: 'bob@demo.com', role: UserRole.manager },
      {
        name: 'Charlie User',
        email: 'charlie@demo.com',
        role: UserRole.employee,
      },
      { name: 'Dana User', email: 'dana@demo.com', role: UserRole.employee },
    ];

    for (const userData of users) {
      const exists = await this.userRepo.findOne({
        where: { email: userData.email },
      });
      if (!exists) {
        const password = await bcrypt.hash('Password123', 10);
        await this.userRepo.save({ ...userData, password });
      }
    }

    const allUsers = await this.userRepo.find();

    await this.taskRepo.save({
      title: 'Initial Demo Task',
      description: 'Seeded example task',
      startDate: new Date(),
      endDate: new Date(),
      status: TaskStatus.TODO,
      assignedUser: allUsers.find((u) => u.role === 'employee'),
      createdBy: allUsers.find((u) => u.role === 'manager'),
    });
  }
}
