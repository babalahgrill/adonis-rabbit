"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RabbitConnection_1 = __importDefault(require("../RabbitConnection"));
const Messsage_1 = __importDefault(require("../Messsage"));
const safeStringify_1 = __importDefault(require("../Utils/safeStringify"));
class RabbitManager {
    constructor(rabbitConfig) {
        this.hasChannel = false;
        this.rabbitConnection = new RabbitConnection_1.default(rabbitConfig);
    }
    toBuffer(content) {
        return Buffer.isBuffer(content)
            ? content
            : Buffer.from(typeof content === 'object' ? safeStringify_1.default(content) : content);
    }
    async getConnection() {
        return this.rabbitConnection.getConnection();
    }
    async getChannel() {
        const connection = await this.rabbitConnection.getConnection();
        if (!this.hasChannel) {
            this.hasChannel = true;
            this.$channel = await connection.createChannel();
        }
        return this.$channel;
    }
    async assertQueue(queueName, options) {
        const channel = await this.getChannel();
        return channel.assertQueue(queueName, options);
    }
    async sendToQueue(queueName, content, options) {
        const channel = await this.getChannel();
        return channel.sendToQueue(queueName, this.toBuffer(content), options);
    }
    async assertExchange(exchangeName, type, options) {
        const channel = await this.getChannel();
        return channel.assertExchange(exchangeName, type, options);
    }
    async bindQueue(queueName, exchangeName, pattern = '') {
        const channel = await this.getChannel();
        return channel.bindQueue(queueName, exchangeName, pattern);
    }
    async sendToExchange(exchangeName, routingKey, content) {
        const channel = await this.getChannel();
        return channel.publish(exchangeName, routingKey, this.toBuffer(content));
    }
    async ackAll() {
        const channel = await this.getChannel();
        return channel.ackAll();
    }
    async nackAll(requeue) {
        const channel = await this.getChannel();
        return channel.nackAll(requeue);
    }
    async consumeFrom(queueName, onMessage) {
        const channel = await this.getChannel();
        return channel.consume(queueName, (message) => {
            const messageInstance = new Messsage_1.default(channel, message);
            onMessage(messageInstance);
        });
    }
    async closeChannel() {
        if (this.hasChannel) {
            await this.$channel.close();
            this.hasChannel = false;
        }
    }
    async closeConnection() {
        await this.rabbitConnection.closeConnection();
    }
}
exports.default = RabbitManager;
//# sourceMappingURL=index.js.map