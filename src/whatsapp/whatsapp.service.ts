import { Injectable, OnModuleInit, Logger } from '@nestjs/common';

@Injectable()
export class WhatsappService implements OnModuleInit {
    private socket: any;
    private makeWASocket: any;
    private useMultiFileAuthState: any;
    private DisconnectReason: any;
    private Boom: any;
    
    private state: { isReady: boolean; qrCode?: string } = { 
        isReady: false, 
        qrCode: undefined 
    };
    private readonly logger = new Logger(WhatsappService.name);

    async onModuleInit() {
        // Dynamic import Baileys
        const baileys = await import('@whiskeysockets/baileys');
        this.makeWASocket = baileys.default;
        this.useMultiFileAuthState = baileys.useMultiFileAuthState;
        this.DisconnectReason = baileys.DisconnectReason;
        
        const boom = await import('@hapi/boom');
        this.Boom = boom.Boom;

        await this.connectToWhatsApp();
    }

    private async connectToWhatsApp() {
        const { state, saveCreds } = await this.useMultiFileAuthState('./src/whatsapp/auth_info');

        this.socket = this.makeWASocket({
            auth: state,
            printQRInTerminal: false,
            syncFullHistory: false,
        });

        // Event: credentials update (save session)
        this.socket.ev.on('creds.update', saveCreds);

        // Event: connection update
        this.socket.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect, qr } = update;

            // Handle QR Code
            if (qr) {
                this.state.qrCode = qr; // Simpan raw QR string
                this.logger.log('QR Code received');
            }

            // Handle connection status
            if (connection === 'close') {
                const shouldReconnect = 
                    lastDisconnect?.error?.output?.statusCode !== 
                    this.DisconnectReason.loggedOut;

                this.logger.log('Connection closed. Reconnecting:', shouldReconnect);

                this.state = { isReady: false, qrCode: undefined };

                if (shouldReconnect) {
                    setTimeout(() => this.connectToWhatsApp(), 3000);
                }
            } else if (connection === 'open') {
                this.logger.log('WhatsApp connection opened');
                this.state = { isReady: true, qrCode: undefined };
            }
        });

        // Event: messages (opsional)
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

    async sendMessage(to: string, message: string) {
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
        } catch (error) {
            this.logger.error('Error sending message:', error);
            return {
                success: false,
                message: 'Failed to send message',
                error: error.message,
            };
        }
    }

    private formatNumber(to: string): string {
        let number = to;

        // Remove + prefix
        if (number.startsWith('+')) {
            number = number.slice(1);
        }

        // Convert 0 to 62
        if (number.startsWith('0')) {
            number = '62' + number.substring(1);
        }

        // Add 62 if not present
        if (!number.startsWith('62')) {
            number = '62' + number;
        }

        return `${number}@s.whatsapp.net`;
    }

    // Method tambahan: kirim media
    async sendMedia(to: string, mediaUrl: string, caption?: string) {
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
        } catch (error) {
            this.logger.error('Error sending media:', error);
            return {
                success: false,
                message: 'Failed to send media',
                error: error.message,
            };
        }
    }

    // Method tambahan: logout
    async logout() {
        try {
            await this.socket.logout();
            this.state = { isReady: false, qrCode: undefined };
            return { success: true, message: 'Logged out successfully' };
        } catch (error) {
            this.logger.error('Error logging out:', error);
            return { success: false, message: 'Failed to logout', error: error.message };
        }
    }
}