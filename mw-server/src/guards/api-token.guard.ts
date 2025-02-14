import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ApiTokenService } from '../services/api-token.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class ApiTokenGuard implements CanActivate {
  constructor(
    private readonly apiTokenService: ApiTokenService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid authorization header');
    }

    const token = authHeader.split(' ')[1];
    const apiToken = await this.apiTokenService.validateToken(token);

    if (!apiToken) {
      throw new UnauthorizedException('Invalid API token');
    }

    // Check user credits
    const user = await this.usersService.findById(apiToken.userId);
    if (!user || user.credits <= 0) {
      throw new UnauthorizedException('Insufficient credits');
    }

    // Attach user and token to request
    request.user = user;
    request.apiToken = apiToken;

    return true;
  }
} 