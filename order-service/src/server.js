const express = require('express');
const bodyParser = require('body-parser');
const { publishOrderCreated } = require('./producer');

const app = express();
app.use(bodyParser.json());

app.post('/order', async (req, res) => {
    const { orderId, product, quantity } = req.body;
    await publishOrderCreated({ orderId, product, quantity });
    res.status(201).send({ message: 'Order created', orderId });
});

app.listen(3001, () => console.log('Order Service running on port 3001'));
