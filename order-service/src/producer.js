const amqp = require('amqplib');
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';

async function publishOrderCreated(order) {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    const exchange = 'order_exchange';
    
    await channel.assertExchange(exchange, 'fanout', { durable: false });
    channel.publish(exchange, '', Buffer.from(JSON.stringify(order)));
    console.log("[x] Order Created Event Published", order);
    await channel.close();
    await connection.close();
}

module.exports = { publishOrderCreated };