import { Module } from '@nestjs/common';;
import { ModelsController } from './models.controller';
import { ModelsService } from './models.service';
import { DatabaseModule } from 'src/database/models.module';
@Module({
  imports: [DatabaseModule],
  controllers: [ModelsController],
  providers: [ModelsService]
})

export class ModelsModule {}