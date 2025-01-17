"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NullMessageException_1 = __importDefault(require("../Exceptions/NullMessageException"));
class Message {
    constructor($channel, message) {
        this.$channel = $channel;
        if (message === null) {
            throw new NullMessageException_1.default('Message expected, received null.');
        }
        this.message = message;
    }
    ack(allUpTo = false) {
        this.$channel.ack(this.message, allUpTo);
    }
    nack(allUpTo = false, requeue = true) {
        this.$channel.nack(this.message, allUpTo, requeue);
    }
    reject(requeue = true) {
        this.$channel.reject(this.message, requeue);
    }
    get content() {
        return this.message.content.toString();
    }
    get jsonContent() {
        return JSON.parse(this.content);
    }
    get fields() {
        return this.message.fields;
    }
    get properties() {
        return this.message.properties;
    }
}
exports.default = Message;
//# sourceMappingURL=index.js.map