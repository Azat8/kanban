import { BadRequestException, Injectable } from '@nestjs/common';
import { User, UserRole } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwt: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmailWithPassword(email);
    if (user && compareSync(pass, user.password)) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    return {
      access_token: this.jwt.sign({ id: user.id }),
    };
  }

  async register(data: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
  }) {
    const existing = await this.usersService.findByEmailWithPassword(
      data.email,
    );
    if (existing) throw new BadRequestException('Email already registered');

    const newUser = await this.usersService.register({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
    });

    return {
      access_token: this.jwt.sign({ id: newUser.id }),
    };
  }
}
