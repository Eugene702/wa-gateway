"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var WhatsappService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsappService = void 0;
const common_1 = require("@nestjs/common");
let WhatsappService = WhatsappService_1 = class WhatsappService {
    socket;
    makeWASocket;
    useMultiFileAuthState;
    DisconnectReason;
    Boom;
    state = {
        isReady: false,
        qrCode: undefined
    };
    logger = new common_1.Logger(WhatsappService_1.name);
    async onModuleInit() {
        const baileys = await import('@whiskeysockets/baileys');
        this.makeWASocket = baileys.default;
        this.useMultiFileAuthState = baileys.useMultiFileAuthState;
        this.DisconnectReason = baileys.DisconnectReason;
        const boom = await import('@hapi/boom');
        this.Boom = boom.Boom;
        await this.connectToWhatsApp();
    }
    async connectToWhatsApp() {
        const { state, saveCreds } = await this.useMultiFileAuthState('./src/whatsapp/auth_info');
        this.socket = this.makeWASocket({
            auth: state,
            printQRInTerminal: false,
            syncFullHistory: false,
        });
        this.socket.ev.on('creds.update', saveCreds);
        this.socket.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect, qr } = update;
            if (qr) {
                this.state.qrCode = qr;
                this.logger.log('QR Code received');
            }
            if (connection === 'close') {
                const shouldReconnect = lastDisconnect?.error?.output?.statusCode !==
                    this.DisconnectReason.loggedOut;
                this.logger.log('Connection closed. Reconnecting:', shouldReconnect);
                this.state = { isReady: false, qrCode: undefined };
                if (shouldReconnect) {
                    setTimeout(() => this.connectToWhatsApp(), 3000);
                }
            }
            else if (connection === 'open') {
                this.logger.log('WhatsApp connection opened');
                this.state = { isReady: true, qrCode: undefined };
            }
        });
        this.socket.ev.on('messages.upsert', async (m) => {
            const msg = m.messages[0];
            if (!msg.key.fromMe && m.type === 'notify') {
                this.logger.log('Received message:', msg.message);
            }
        });
    }
    getState() {
        return this.state;
    }
    async sendMessage(to, message) {
        if (this.state.isReady === false) {
            return {
                success: false,
                message: 'WhatsApp service is not ready yet',
                data: this.state.qrCode,
            };
        }
        try {
            const jid = this.formatNumber(to);
            const result = await this.socket.sendMessage(jid, {
                text: message
            });
            return {
                success: true,
                message: 'Message sent successfully',
                data: result,
            };
        }
        catch (error) {
            this.logger.error('Error sending message:', error);
            return {
                success: false,
                message: 'Failed to send message',
                error: error.message,
            };
        }
    }
    formatNumber(to) {
        let number = to;
        if (number.startsWith('+')) {
            number = number.slice(1);
        }
        if (number.startsWith('0')) {
            number = '62' + number.substring(1);
        }
        if (!number.startsWith('62')) {
            number = '62' + number;
        }
        return `${number}@s.whatsapp.net`;
    }
    async sendMedia(to, mediaUrl, caption) {
        if (!this.state.isReady) {
            return {
                success: false,
                message: 'WhatsApp service is not ready yet',
            };
        }
        try {
            const jid = this.formatNumber(to);
            const result = await this.socket.sendMessage(jid, {
                image: { url: mediaUrl },
                caption: caption || '',
            });
            return {
                success: true,
                message: 'Media sent successfully',
                data: result,
            };
        }
        catch (error) {
            this.logger.error('Error sending media:', error);
            return {
                success: false,
                message: 'Failed to send media',
                error: error.message,
            };
        }
    }
    async logout() {
        try {
            await this.socket.logout();
            this.state = { isReady: false, qrCode: undefined };
            return { success: true, message: 'Logged out successfully' };
        }
        catch (error) {
            this.logger.error('Error logging out:', error);
            return { success: false, message: 'Failed to logout', error: error.message };
        }
    }
};
exports.WhatsappService = WhatsappService;
exports.WhatsappService = WhatsappService = WhatsappService_1 = __decorate([
    (0, common_1.Injectable)()
], WhatsappService);
//# sourceMappingURL=whatsapp.service.js.map