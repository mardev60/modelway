import { Controller, Get } from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { Provider } from '../utils/types/providers.interface';

@Controller('providers')
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Get()
  async findAll(): Promise<Provider[]> {
    return this.providersService.findAll();
  }

  @Get('grouped')
  async getGroupedByProvider() {
    return this.providersService.getModelsGroupedByProvider();
  }
}
