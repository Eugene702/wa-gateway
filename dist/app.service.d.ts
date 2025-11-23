import { WhatsappService } from './whatsapp/whatsapp.service';
import { CreateDto } from './dto/create.dto';
export declare class AppService {
    private readonly whatsAppService;
    constructor(whatsAppService: WhatsappService);
    create(dto: CreateDto): Promise<{
        success: boolean;
        message: string;
        data: any;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
}
