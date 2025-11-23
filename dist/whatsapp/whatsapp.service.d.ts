import { OnModuleInit } from '@nestjs/common';
export declare class WhatsappService implements OnModuleInit {
    private client;
    private state;
    onModuleInit(): void;
    getState(): {
        isReady: boolean;
        qrCode?: string;
    };
    sendMessage(to: string, message: string): Promise<import("whatsapp-web.js").Message> | {
        sucess: boolean;
        message: string;
        data: string | undefined;
    };
}
