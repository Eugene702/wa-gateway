import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, LocalAuth } from 'whatsapp-web.js';

@Injectable()
export class WhatsappService implements OnModuleInit {
    private client: Client
    private state: { isReady: boolean, qrCode?: string } = { isReady: false, qrCode: undefined }

    onModuleInit() {
        this.client = new Client({
            authStrategy: new LocalAuth({
                dataPath: "./src/whatsapp"
            })
        })

        this.client.on("qr", qr => this.state.qrCode = qr)
        this.client.on("disconnected", () => this.state = { isReady: false, qrCode: undefined })
        this.client.on("ready", () => this.state = { isReady: true })

        this.client.initialize()
    }

    getState(){
        return this.state
    }

    sendMessage(to: string, message: string){
        if(this.state.isReady === false){
            return {
                sucess: false,
                message: "WhatsAppp service is not ready yet",
                data: this.state.qrCode
            }
        }

        const formatNumber = () => {
            let number = to
            if(number.startsWith("+")){
                number = number.slice(1)
            }

            if(number.startsWith("0")){
                number = "62" + number.substring(1)
            }

            if(!number.startsWith("62")){
                number = "62" + number
            }

            return `${number}@c.us`
        }
        return this.client.sendMessage(formatNumber(), message)
    }
}
