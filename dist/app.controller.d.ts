import { AppService } from './app.service';
import { CreateDto } from './dto/create.dto';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    create(dto: CreateDto): Promise<import("whatsapp-web.js").Message> | {
        sucess: boolean;
        message: string;
        data: string | undefined;
    };
}
