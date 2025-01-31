import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Provider, ProviderSchema } from '../utils/schemas/providers.schema';
import { Model, ModelSchema } from '../utils/schemas/models.schema';
import { ProvidersController } from './providers.controller';
import { ProvidersService } from './providers.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Provider.name, schema: ProviderSchema },
      { name: Model.name, schema: ModelSchema },
    ]),
  ],
  controllers: [ProvidersController],
  providers: [ProvidersService],
})

export class ProvidersModule {}