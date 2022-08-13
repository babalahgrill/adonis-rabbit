"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const amqplib_1 = require("amqplib");
const InvalidRabbitConfigException_1 = __importDefault(require("../Exceptions/InvalidRabbitConfigException"));
class RabbitConnection {
    constructor(rabbitConfig) {
        this.rabbitConfig = rabbitConfig;
        this.hasConnection = false;
        if (this.rabbitConfig.user) {
            this.$username = this.rabbitConfig.user;
        }
        if (this.rabbitConfig.password) {
            this.$password = this.rabbitConfig.password;
        }
        this.$credentials = this.handleCredentials(this.rabbitConfig.user, this.rabbitConfig.password);
        this.$hostname = this.handleHostname(this.rabbitConfig.hostname, this.rabbitConfig.port);
    }
    handleCredentials(user, password) {
        if (!user) {
            throw new InvalidRabbitConfigException_1.default('Missing RabbitMQ user');
        }
        if (!password) {
            throw new InvalidRabbitConfigException_1.default('Missing RabbitMQ password');
        }
        return `${user}:${password}@`;
    }
    handleHostname(hostname, port) {
        if (!hostname) {
            throw new InvalidRabbitConfigException_1.default('Missing RabbitMQ hostname');
        }
        this.$hosturl = hostname;
        if (port) {
            this.$port = port;
        }
        return port ? `${hostname}:${port}` : hostname;
    }
    get url() {
        return `amqp://${this.$credentials}${this.$hostname}`;
    }
    async getConnection() {
        if (!this.$connection) {
            try {
                const options = {
                    protocol: 'amqps',
                    hostname: this.$hosturl,
                    username: this.$username,
                    password: this.$password,
                    port: this.$port,
                    frameMax: 40000,
                };
                this.$connection = await amqplib_1.connect(options);
            }
            catch (error) {
                throw error;
            }
        }
        return this.$connection;
    }
    async closeConnection() {
        if (this.hasConnection) {
            await this.$connection.close();
            this.hasConnection = false;
        }
    }
}
exports.default = RabbitConnection;
//# sourceMappingURL=index.js.map