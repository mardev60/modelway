import { Module } from '@nestjs/common';
import { QuotasController } from '../quotas/quotas.controller';
import { QuotasService } from '../quotas/quotas.service';
import { FirebaseService } from '../services/firebase.service';

@Module({
  controllers: [QuotasController],
  providers: [QuotasService, FirebaseService],
  exports: [QuotasService],
})
export class QuotasModule {}
