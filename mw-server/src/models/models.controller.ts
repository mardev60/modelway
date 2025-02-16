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
import { ModelsService } from './models.service';

@Controller('models')
export class ModelsController {
  constructor(private readonly modelsService: ModelsService) {}

  @Get()
  async findAll(): Promise<{ [key: string]: Model[] }> {
    return this.modelsService.findAll();
  }

  @Get('names')
  async findDistinctModelNames(): Promise<string[]> {
    return this.modelsService.findDistinctModelNames();
  }

  @Post()
  @UseGuards(AuthGuard, RoleGuard)
  async create(@Body() modelData: Partial<Model>): Promise<Model> {
    return this.modelsService.create(modelData);
  }

  @Post('search')
  async getModelsByName(@Body() data: { name: string }): Promise<Model[]> {
    return this.modelsService.findByName(data.name);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RoleGuard)
  async delete(@Param('id') id: string): Promise<void> {
    await this.modelsService.delete(id);
  }
}
