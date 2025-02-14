import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = await this.usersService.getUserInfo(request.user.uid);
    
    if (user?.role !== 'admin') {
      throw new UnauthorizedException('Admin access required');
    }

    return true;
  }
} 