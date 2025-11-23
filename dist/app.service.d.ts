import { WhatsappService } from './whatsapp/whatsapp.service';
import { CreateDto } from './dto/create.dto';
export declare class AppService {
    private readonly whatsAppService;
    constructor(whatsAppService: WhatsappService);
    create(dto: CreateDto): Promise<import("whatsapp-web.js").Message> | {
        sucess: boolean;
        message: string;
        data: string | undefined;
    };
}
