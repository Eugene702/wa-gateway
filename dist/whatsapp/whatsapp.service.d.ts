import { OnModuleInit } from '@nestjs/common';
export declare class WhatsappService implements OnModuleInit {
    private socket;
    private makeWASocket;
    private useMultiFileAuthState;
    private DisconnectReason;
    private Boom;
    private state;
    private readonly logger;
    onModuleInit(): Promise<void>;
    private connectToWhatsApp;
    getState(): {
        isReady: boolean;
        qrCode?: string;
    };
    sendMessage(to: string, message: string): Promise<{
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
    private formatNumber;
    sendMedia(to: string, mediaUrl: string, caption?: string): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
        error?: undefined;
    } | {
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
    logout(): Promise<{
        success: boolean;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
    }>;
}
