import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../guards/auth.guard';
import { User } from './decorators/user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(AuthGuard)
  async getMe(@User() user: any) {
    return this.usersService.getUserInfo(user.uid);
  }
} 