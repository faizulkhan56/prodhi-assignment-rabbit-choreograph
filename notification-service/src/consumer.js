const amqp = require('amqplib');
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';

async function startConsumer() {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    const exchange = 'inventory_exchange';
    const queue = 'notification_queue';

    await channel.assertExchange(exchange, 'fanout', { durable: false });
    const q = await channel.assertQueue(queue, { exclusive: false });
    channel.bindQueue(q.queue, exchange, '');

    console.log("[*] Waiting for InventoryUpdated messages...");
    channel.consume(q.queue, (msg) => {
        const order = JSON.parse(msg.content.toString());
        console.log(`[x] Notification Sent: Order ${order.orderId} is updated in inventory.`);
        channel.ack(msg);
    });
}

startConsumer().catch(console.error);
