import { Channel, ConsumeMessage } from 'amqplib';
import { MessageContract } from '@ioc:Adonis/Addons/Rabbit';
export default class Message<T> implements MessageContract {
    private $channel;
    message: ConsumeMessage;
    constructor($channel: Channel, message: ConsumeMessage | null);
    ack(allUpTo?: boolean): void;
    nack(allUpTo?: boolean, requeue?: boolean): void;
    reject(requeue?: boolean): void;
    get content(): string;
    get jsonContent(): T;
    get fields(): import("amqplib").ConsumeMessageFields;
    get properties(): import("amqplib").MessageProperties;
}
