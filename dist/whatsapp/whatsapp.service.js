"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsappService = void 0;
const common_1 = require("@nestjs/common");
const whatsapp_web_js_1 = require("whatsapp-web.js");
let WhatsappService = class WhatsappService {
    client;
    state = { isReady: false, qrCode: undefined };
    onModuleInit() {
        this.client = new whatsapp_web_js_1.Client({
            authStrategy: new whatsapp_web_js_1.LocalAuth({
                dataPath: "./src/whatsapp"
            })
        });
        this.client.on("qr", qr => this.state.qrCode = qr);
        this.client.on("disconnected", () => this.state = { isReady: false, qrCode: undefined });
        this.client.on("ready", () => this.state = { isReady: true });
        this.client.initialize();
    }
    getState() {
        return this.state;
    }
    sendMessage(to, message) {
        if (this.state.isReady === false) {
            return {
                sucess: false,
                message: "WhatsAppp service is not ready yet",
                data: this.state.qrCode
            };
        }
        const formatNumber = () => {
            let number = to;
            if (number.startsWith("+")) {
                number = number.slice(1);
            }
            if (number.startsWith("0")) {
                number = "62" + number.substring(1);
            }
            if (!number.startsWith("62")) {
                number = "62" + number;
            }
            return `${number}@c.us`;
        };
        return this.client.sendMessage(formatNumber(), message);
    }
};
exports.WhatsappService = WhatsappService;
exports.WhatsappService = WhatsappService = __decorate([
    (0, common_1.Injectable)()
], WhatsappService);
//# sourceMappingURL=whatsapp.service.js.map