import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ModelsModule } from './models/models.module';
import { ProvidersModule } from './providers/providers.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb+srv://makiluspn:Uqkdyc8y80BEFe4p@modelway.ofy26.mongodb.net/mw_db?retryWrites=true&w=majority&appName=ModelWay'), ModelsModule, ProvidersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
