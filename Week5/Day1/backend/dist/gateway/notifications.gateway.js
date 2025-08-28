"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const jwt = require("jsonwebtoken");
let NotificationsGateway = class NotificationsGateway {
    afterInit() { console.log('WebSocket gateway initialized'); }
    handleConnection(client) {
        try {
            const token = client.handshake.auth?.token || client.handshake.query?.token;
            if (!token || Array.isArray(token)) {
                client.disconnect(true);
                return;
            }
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded.sub;
            client.userId = userId;
            client.join(`user:${userId}`);
            client.emit('connected', { userId });
        }
        catch (e) {
            client.disconnect(true);
        }
    }
    handleDisconnect(client) {
    }
    emitToUser(userId, event, data) {
        this.server.to(`user:${userId}`).emit(event, data);
    }
    emitToAll(event, data) {
        this.server.emit(event, data);
    }
};
exports.NotificationsGateway = NotificationsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], NotificationsGateway.prototype, "server", void 0);
exports.NotificationsGateway = NotificationsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: { origin: process.env.CLIENT_ORIGIN || '*', credentials: true },
        transports: ['websocket', 'polling'],
    })
], NotificationsGateway);
