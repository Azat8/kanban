import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { User, UserRole } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { Task } from 'src/task/entities/task.entity';
import { AvailabilityService } from 'src/common/availability/availability.service';
import { UserFiltersDto } from './dto/user-filters.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Task) private taskRepository: Repository<Task>,
    private readonly availabilityService: AvailabilityService,
  ) {}

  async register(registerUserDto: RegisterUserDto) {
    const { email, password, name, role } = registerUserDto;

    // Check if user exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Create user
    const newUser = this.userRepository.create({
      email,
      password: hashedPassword,
      name,
      role,
    });

    await this.userRepository.save(newUser);

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }
  async findEmployees(
    startDate: string, // ISO string: 'YYYY-MM-DDTHH:MM'
    endDate: string, // ISO string: 'YYYY-MM-DDTHH:MM'
    keyword?: string,
    limit = 10,
  ) {
    // Parse as Date objects (keeps hours/minutes)
    const from = new Date(startDate);
    const to = new Date(endDate);

    // Build base query for employees
    let query = this.userRepository
      .createQueryBuilder('user')
      .where('user.role = :role', { role: 'employee' });

    if (keyword) {
      query = query.andWhere('user.name LIKE :keyword', {
        keyword: `%${keyword}%`,
      });
    }

    const employees = await query.take(limit).getMany();

    // Check overlapping tasks for each employee
    const results = await Promise.all(
      employees.map(async (emp) => {
        const available = await this.availabilityService.isAvailable(
          emp.id,
          from,
          to,
        );

        return { ...emp, available };
      }),
    );

    return results;
  }

  findAll(user: User, params: UserFiltersDto) {
    const { keyword, limit = 10 } = params;

    let query = this.userRepository
      .createQueryBuilder('user')
      .where('user.role = :role', {
        role: user.role === UserRole.employee ? 'manager' : 'employee',
      });

    if (keyword) {
      query = query.andWhere('user.name LIKE :keyword', {
        keyword: `%${keyword}%`,
      });
    }

    query = query.limit(limit);

    return query.getMany();
  }

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findByEmailWithPassword(email: string) {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }
}
