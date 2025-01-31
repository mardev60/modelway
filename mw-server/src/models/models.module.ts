import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Model, ModelSchema } from '../utils/schemas/models.schema';
import { ModelsController } from './models.controller';
import { ModelsService } from './models.service';
import { ProviderSchema } from 'src/utils/schemas/providers.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Model.name, schema: ModelSchema }, { name: 'Provider', schema: ProviderSchema }])],
  controllers: [ModelsController],
  providers: [ModelsService]
})

export class ModelsModule {}