import { Injectable } from '@nestjs/common';
import { WhatsappService } from './whatsapp/whatsapp.service';
import { CreateDto } from './dto/create.dto';

@Injectable()
export class AppService {
  constructor(private readonly whatsAppService: WhatsappService){}

  create(dto: CreateDto){
    return this.whatsAppService.sendMessage(dto.to, dto.message)
  }
}
