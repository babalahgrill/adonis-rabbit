declare module '@ioc:Adonis/Addons/Rabbit' {
    import { Channel, Connection, MessageFields, MessageProperties, Options, Replies } from 'amqplib';
    export interface RabbitManagerContract {
        hasChannel: boolean;
        getConnection(): Promise<Connection>;
        getChannel(): Promise<Channel>;
        assertQueue(queueName: string, options?: Options.AssertQueue): Promise<Replies.AssertQueue>;
        sendToQueue(queueName: string, content: any, options?: Options.Publish): Promise<boolean>;
        assertExchange(exchangeName: string, type: string, options?: Options.AssertExchange): Promise<Replies.AssertExchange>;
        bindQueue(queueName: string, exchangeName: string, pattern?: any): Promise<Replies.Empty>;
        sendToExchange(exchangeName: string, routingKey: string, content: any): Promise<boolean>;
        ackAll(): Promise<void>;
        nackAll(requeue?: boolean): void | Promise<void>;
        consumeFrom<T extends object = any>(queueName: string, onMessage: (msg: MessageContract<T>) => void | Promise<void>): Promise<Replies.Consume>;
        closeChannel(): Promise<void>;
        closeConnection(): Promise<void>;
    }
    export interface MessageContract<T extends object = any> {
        ack(allUpTo?: any): void;
        nack(allUpTo?: any, requeue?: any): void;
        reject(requeue?: any): void;
        content: string;
        jsonContent: T;
        fields: MessageFields;
        properties: MessageProperties;
    }
    export interface RabbitConfig {
        user?: string;
        password?: string;
        hostname: string;
        port?: number;
    }
    const Rabbit: RabbitManagerContract;
    export default Rabbit;
}
