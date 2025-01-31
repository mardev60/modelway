import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Model, ModelSchema } from '../utils/schemas/models.schema';
import { ProviderSchema } from '../utils/schemas/providers.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Model.name, schema: ModelSchema },
      { name: 'Provider', schema: ProviderSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
