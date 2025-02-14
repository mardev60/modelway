import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { auth } from 'firebase-admin';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromCookie(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const decodedToken = await auth().verifyIdToken(token);
      request.user = decodedToken;
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromCookie(request: any): string | undefined {
    return request.cookies?.auth_token;
  }
} 