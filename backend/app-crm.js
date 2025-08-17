const express = require('express');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// Inventory routes
app.get('/inventory', async (req, res) => {
  try {
    const items = await prisma.product.findMany();
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching inventory' });
  }
});

app.post('/inventory', async (req, res) => {
  const itemData = req.body;
  try {
    const item = await prisma.product.create({ data: itemData });
    res.status(201).json(item);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Error creating product' });
  }
});

// Customer routes
app.get('/customers', async (req, res) => {
  try {
    const customers = await prisma.customer.findMany();
    res.json(customers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching customers' });
  }
});

app.post('/customers', async (req, res) => {
  const customerData = req.body;
  try {
    const customer = await prisma.customer.create({ data: customerData });
    res.status(201).json(customer);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Error creating customer' });
  }
});

// Order routes
app.get('/orders', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: { product: true },
        },
        customer: true,
      },
    });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching orders' });
  }
});

app.post('/orders', async (req, res) => {
  const { customerId, items, status } = req.body;
  try {
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const order = await prisma.order.create({
      data: {
        customer: { connect: { id: customerId } },
        total,
        status: status || 'PENDING',
        items: {
          create: items.map((item) => ({
            product: { connect: { id: item.productId } },
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: true,
      },
    });
    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Error creating order' });
  }
});

// CRM Conversation routes
app.get('/conversations', async (req, res) => {
  try {
    const conversations = await prisma.crmConversation.findMany({
      include: { messages: true, customer: true },
    });
    res.json(conversations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching conversations' });
  }
});

app.post('/conversations', async (req, res) => {
  const { customerId, status } = req.body;
  try {
    const conversation = await prisma.crmConversation.create({
      data: {
        customer: { connect: { id: customerId } },
        status: status || 'open',
      },
    });
    res.status(201).json(conversation);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Error creating conversation' });
  }
});

app.get('/conversations/:id/messages', async (req, res) => {
  const conversationId = req.params.id;
  try {
    const messages = await prisma.crmMessage.findMany({
      where: { conversationId },
      orderBy: { sentAt: 'asc' },
    });
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching messages' });
  }
});

app.post('/conversations/:id/messages', async (req, res) => {
  const conversationId = req.params.id;
  const { direction, type, payload, waMsgId, sentAt, deliveredAt, readAt } = req.body;
  try {
    const message = await prisma.crmMessage.create({
      data: {
        conversation: { connect: { id: conversationId } },
        direction,
        type,
        payload,
        waMsgId,
        sentAt,
        deliveredAt,
        readAt,
      },
    });
    res.status(201).json(message);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Error creating message' });
  }
});

// Start server if run directly
if (require.main === module) {
  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log('Server listening on port ' + port);
  });
}

module.exports = app;
