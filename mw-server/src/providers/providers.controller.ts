import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { Provider } from '../utils/types/providers.interface';
import { AuthGuard } from '../guards/auth.guard';
import { RoleGuard } from '../guards/role.guard';

@Controller('providers')
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Get()
  async findAll(): Promise<Provider[]> {
    return this.providersService.findAll();
  }

  @Post()
  @UseGuards(AuthGuard, RoleGuard)
  async create(@Body() providerData: Provider): Promise<Provider> {
    return this.providersService.create(providerData);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RoleGuard)
  async delete(@Param('id') id: string): Promise<void> {
    await this.providersService.delete(id);
  }

  @Get('grouped')
  async getGroupedByProvider() {
    return this.providersService.getModelsGroupedByProvider();
  }
}
