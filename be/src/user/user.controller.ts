import { Controller, Get, Request, UseGuards, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserFiltersDto } from './dto/user-filters.dto';
import { User } from './entities/user.entity';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  me(@Request() req) {
    return req.user;
  }

  @Get('/employees')
  findEmployees(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('keyword') keyword?: string,
  ) {
    return this.userService.findEmployees(startDate, endDate, keyword);
  }

  @Get()
  find(@Query() query: UserFiltersDto, @Request() req) {
    return this.userService.findAll(req.user as User, query);
  }
}
