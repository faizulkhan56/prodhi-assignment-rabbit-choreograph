const amqp = require('amqplib');
const { publishInventoryUpdated } = require('./producer');
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';

async function startConsumer() {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    const exchange = 'order_exchange';
    const queue = 'inventory_queue';

    await channel.assertExchange(exchange, 'fanout', { durable: false });
    const q = await channel.assertQueue(queue, { exclusive: false });
    channel.bindQueue(q.queue, exchange, '');

    console.log("[*] Waiting for OrderCreated messages...");
    channel.consume(q.queue, async (msg) => {
        const order = JSON.parse(msg.content.toString());
        console.log("[x] Inventory Updated for Order", order.orderId);
        channel.ack(msg);

        // Publish InventoryUpdated event via producer.js
        await publishInventoryUpdated(order);
    });
}

startConsumer().catch(console.error);
