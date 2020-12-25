
const { connect } = require('amqplib');
const { EventEmitter } = require('events');

const rabbitMqUrl = process.env.MESSAGING_CONNECT_URL; // get the connection string from the environment

/**
 * async function to publish the message to the named exchange (after asserting the exchange
 * exists with the exchangeType). The message can be tagged with a routingKey to allow
 * subscribers to selectively consume.  The default for the message persistence is true.
 *
 *
 * @param {string} exchangeName
 * @param {string} message the message to publish to the exchange
 * @param {string} routingKey default '' the routing key for the message
 * @param {boolean} persistent default true set to true if the messages should be persisted
 * @param {string} exchangeType default 'topic' one of 'direct', 'topic', 'headers', or 'fanout'
 * @param {boolean} durable default 'true' set to true if the exchange is durable
 */
const publish = async (
    exchangeName,
    message,
    routingKey = '',
    persistent = true,
    exchangeType = 'topic',
    durable = true
) => {
    let msg = '';
    if (typeof message === 'object') {
        msg = JSON.stringify(message);
    } else {
        msg = message;
    }

    //
    // get the connection and channel then assert exchange exists
    const conn = await connect(rabbitMqUrl);
    const channel = await conn.createChannel();
    await channel.assertExchange(exchangeName, exchangeType, { durable });
    //
    // publish the message with the routing key to the exchange
    await channel.publish(exchangeName, routingKey, Buffer.from(msg), {
        persistent,
    });
    // console.log('Message published: ', exchangeName, message)
    await channel.close();
    await conn.close();
};

class CustomEmitter extends EventEmitter {
    constructor(conn, channel) {
        super();
        this.conn = conn;
        this.channel = channel;
    }

    async stop() {        
        await this.channel.close();
        await this.conn.close();
    }
}



/**
 * async function to subscribe to an exchange and receive messages that match the
 * routingKey (default is '', so all match).  Note that the queue used is
 * automatically generated but the prefetch and isNoAck fields are used.
 * Returns an EventEmitter with two args: message and ack function
 *
 * @param {*} exchangeName
 * @param {*} routingKey
 * @param {*} queueName
 * @param {*} prefetch
 * @param {*} isNoAck
 * @param {*} eventName
 * @param {*} exchangeType
 * @param {*} durable
 * @param {*} exclusive
 */
const subscribe = async (
    exchangeName,
    routingKey = '',
    queueName = '',
    prefetch = 1,
    isNoAck = false,
    eventName = 'data',
    exchangeType = 'topic',
    durable = true,
    exclusive = false
) => {
    //
    // get the connection and channel then assert exchange exists
    const conn = await connect(rabbitMqUrl);
    const channel = await conn.createChannel();
    await channel.assertExchange(exchangeName, exchangeType, { durable });
    //
    // set prefetch to ensure on prefetch # messages are popped
    channel.prefetch(prefetch);
    //
    // setup a queue and bind it to the exchange
    const queue = await channel.assertQueue(queueName, { exclusive });

    // support multiple bindings based on | separator in the routingKey
    const keys = routingKey.split('|');
    keys.forEach((key) => channel.bindQueue(queue.queue, exchangeName, key));
    //
    // setup the emitter to emit the message and an ack callback
    const subscribeEmitter = new CustomEmitter(conn, channel);
    try {
        channel.consume(
            queue.queue,
            (message) => {
                //console.log(message);
                if (message !== null) {
                    subscribeEmitter.emit(
                        eventName,
                        queue.messageCount,
                        message.content.toString(),
                        () => channel.ack(message)
                    );
                } else {
                    const error = new Error('NullMessageException');
                    subscribeEmitter.emit('error', error);
                }
            },
            { noAck: isNoAck }
        );
    } catch (error) {
        subscribeEmitter.emit('error', error);
    }
    return subscribeEmitter;

};


module.exports = {
    publish,
    subscribe,
};
