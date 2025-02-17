import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { RoleGuard } from '../guards/role.guard';
import { Model } from '../utils/types/models.interface';
import { Provider } from '../utils/types/providers.interface';
import { ProvidersService } from './providers.service';

@Controller('providers')
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Get()
  async findAll(): Promise<Provider[]> {
    return this.providersService.findAll();
  }

  @Get(':name')
  async findByName(@Param('name') name: string): Promise<Provider> {
    return this.providersService.findByName(name);
  }

  @Get(':id/models')
  async getModels(@Param('id') id: string): Promise<Model[]> {
    return this.providersService.getModels(id);
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
