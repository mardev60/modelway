import { Controller, Get, Post, Body } from '@nestjs/common';
import { ModelsService } from './models.service';
import { Model } from '../utils/types/models.interface';

@Controller('models')
export class ModelsController {
  constructor(private readonly modelsService: ModelsService) {}

  @Get()
  async findAll(): Promise<{ [key: string]: Model[] }> {
    return this.modelsService.findAll();
  }

  @Post()
  async create(@Body() modelData: Partial<Model>): Promise<Model> {
    return this.modelsService.create(modelData);
  }

  @Get('groupedbyname')
  async getModelsByName(@Body('name') name: string): Promise<Model[]> {
    return this.modelsService.findByGroup(name);
  }
}
