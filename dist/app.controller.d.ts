import { AppService } from './app.service';
import { CreateDto } from './dto/create.dto';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
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
