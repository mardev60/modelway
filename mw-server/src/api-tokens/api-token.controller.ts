import { Controller, Post, Get, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { ApiTokenService } from './api-token.service';
import { User } from '../decorators/user.decorator';

@Controller('api-tokens')
@UseGuards(AuthGuard)
export class ApiTokenController {
  constructor(private readonly apiTokenService: ApiTokenService) {}

  @Post()
  async createToken(@Body('name') name: string, @User() user: any) {
    return this.apiTokenService.generateToken(user.uid, name);
  }

  @Get()
  async getTokens(@User() user: any) {
    return this.apiTokenService.getTokensByUserId(user.uid);
  }

  @Delete(':id')
  async deactivateToken(@Param('id') id: string, @User() user: any) {
    await this.apiTokenService.deactivateToken(id, user.uid);
    return { success: true };
  }
} 