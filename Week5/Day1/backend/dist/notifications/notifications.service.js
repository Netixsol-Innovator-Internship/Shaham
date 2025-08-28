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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const notification_schema_1 = require("./schemas/notification.schema");
const notifications_gateway_1 = require("../gateway/notifications.gateway");
let NotificationsService = class NotificationsService {
    constructor(model, gateway) {
        this.model = model;
        this.gateway = gateway;
    }
    async create(payload) {
        const n = await this.model.create(payload);
        const populated = await this.model
            .findById(n._id)
            .populate('actor', 'username email avatarUrl')
            .lean();
        const toSend = populated || n.toJSON();
        this.gateway.emitToUser(payload.recipient, 'notification:new', toSend);
        return toSend;
    }
    async bulkCreate(items) {
        if (items.length === 0)
            return [];
        const inserted = await this.model.insertMany(items);
        const populated = await this.model
            .find({ _id: { $in: inserted.map((i) => i._id) } })
            .populate('actor', 'username email avatarUrl')
            .lean();
        const byId = Object.fromEntries(populated.map((n) => [String(n._id), n]));
        inserted.forEach((i) => {
            const notif = byId[String(i._id)] || i.toJSON();
            this.gateway.emitToUser(String(i.recipient), 'notification:new', notif);
        });
        return populated;
    }
    async list(recipient) {
        return this.model
            .find({ recipient })
            .sort({ createdAt: -1 })
            .populate('actor', 'username email avatarUrl')
            .lean();
    }
    async markRead(recipient, id) {
        return this.model.findOneAndUpdate({ _id: id, recipient }, { $set: { read: true } }, { new: true });
    }
    async markAllRead(recipient) {
        await this.model.updateMany({ recipient }, { $set: { read: true } });
        return { ok: true };
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(notification_schema_1.Notification.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        notifications_gateway_1.NotificationsGateway])
], NotificationsService);
