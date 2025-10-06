import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { compareSync, hash } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwt: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmailWithPassword(email);
    if (user && compareSync(pass, user.password)) {
      const { password: _password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
    return {
      access_token: this.jwt.sign({ id: user.id }),
    };
  }

  async register(data: { name: string; email: string; password: string }) {
    const existing = await this.usersService.findByEmailWithPassword(
      data.email,
    );
    if (existing) throw new BadRequestException('Email already registered');
    const hashed = await hash(data.password, 10);

    const newUser = await this.usersService.register({
      name: data.name,
      email: data.email,
      password: hashed,
    });

    return {
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
      access_token: this.jwt.sign({ id: newUser.id }),
    };
  }
}
