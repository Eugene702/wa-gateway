import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WhatsappService } from './whatsapp/whatsapp.service';

@Module({
  controllers: [AppController],
  providers: [AppService, WhatsappService],
})
export class AppModule {}
