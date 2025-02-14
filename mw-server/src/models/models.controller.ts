import { Controller, Get, Post, Body, UseGuards, Delete, Param } from '@nestjs/common';
import { ModelsService } from './models.service';
import { Model } from '../utils/types/models.interface';
import { AuthGuard } from '../guards/auth.guard';
import { RoleGuard } from '../guards/role.guard';

@Controller('models')
export class ModelsController {
  constructor(private readonly modelsService: ModelsService) {}

  @Get()
  async findAll(): Promise<{ [key: string]: Model[] }> {
    return this.modelsService.findAll();
  }

  @Post()
  @UseGuards(AuthGuard, RoleGuard)
  async create(@Body() modelData: Partial<Model>): Promise<Model> {
    return this.modelsService.create(modelData);
  }

  @Get('groupedbyname')
  async getModelsByName(@Body('name') name: string): Promise<Model[]> {
    return this.modelsService.findByGroup(name);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RoleGuard)
  async delete(@Param('id') id: string): Promise<void> {
    await this.modelsService.delete(id);
  }
}
