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
    // Automatically create a loyalty account for new customer
    await prisma.loyaltyAccount.create({ data: { customerId: customer.id } });
    res.status(201).json(customer);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Error creating customer' });
  }
});

// Order routes
app.get('/orders', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({ include: { items: true } });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching orders' });
  }
});

app.post('/orders', async (req, res) => {
  const { customerId, items } = req.body;
  try {
    let total = 0;
    // Calculate total cost based on makingFeeLkr and quantity
    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) {
        return res.status(400).json({ error: `Product not found: ${item.productId}` });
      }
      const quantity = item.quantity ?? 1;
      total += (product.makingFeeLkr || 0) * quantity;
    }
    const order = await prisma.order.create({
      data: {
        customer: { connect: { id: customerId } },
        total,
        status: 'pending',
        items: {
          create: items.map(item => ({
            product: { connect: { id: item.productId } },
            quantity: item.quantity ?? 1,
            price: undefined,
          })),
        },
      },
      include: { items: true },
    });
    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Error creating order' });
  }
});

// CRM conversation routes
app.get('/conversations', async (req, res) => {
  try {
    const conversations = await prisma.crmConversation.findMany({ include: { messages: true, customer: true } });
    res.json(conversations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching conversations' });
  }
});

app.post('/conversations', async (req, res) => {
  const { customerId, status, lastMsgAt } = req.body;
  try {
    const conversation = await prisma.crmConversation.create({
      data: {
        customer: { connect: { id: customerId } },
        status,
        lastMsgAt,
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
    const messages = await prisma.crmMessage.findMany({ where: { conversationId } });
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

// Supplier routes
app.get('/suppliers', async (req, res) => {
  try {
    const suppliers = await prisma.supplier.findMany({ include: { orders: true } });
    res.json(suppliers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching suppliers' });
  }
});

app.post('/suppliers', async (req, res) => {
  const { name, contact, address, email, phone } = req.body;
  try {
    const supplier = await prisma.supplier.create({ data: { name, contact, address, email, phone } });
    res.status(201).json(supplier);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Error creating supplier' });
  }
});

app.get('/suppliers/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const supplier = await prisma.supplier.findUnique({ where: { id }, include: { orders: true } });
    if (!supplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    res.json(supplier);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching supplier' });
  }
});

app.put('/suppliers/:id', async (req, res) => {
  const id = req.params.id;
  const { name, contact, address, email, phone } = req.body;
  try {
    const supplier = await prisma.supplier.update({
      where: { id },
      data: { name, contact, address, email, phone },
    });
    res.json(supplier);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Error updating supplier' });
  }
});

app.delete('/suppliers/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await prisma.supplier.delete({ where: { id } });
    res.json({ message: 'Supplier deleted' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Error deleting supplier' });
  }
});

// Purchase order routes
app.get('/purchase-orders', async (req, res) => {
  try {
    const orders = await prisma.purchaseOrder.findMany({ include: { supplier: true } });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching purchase orders' });
  }
});

app.post('/purchase-orders', async (req, res) => {
  const { supplierId, status, totalCost, items } = req.body;
  try {
    const order = await prisma.purchaseOrder.create({
      data: {
        supplier: { connect: { id: supplierId } },
        status,
        totalCost,
        items,
      },
    });
    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Error creating purchase order' });
  }
});

app.get('/purchase-orders/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const order = await prisma.purchaseOrder.findUnique({ where: { id }, include: { supplier: true } });
    if (!order) {
      return res.status(404).json({ error: 'Purchase order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching purchase order' });
  }
});

app.put('/purchase-orders/:id', async (req, res) => {
  const id = req.params.id;
  const { status, totalCost, items } = req.body;
  try {
    const order = await prisma.purchaseOrder.update({
      where: { id },
      data: { status, totalCost, items },
    });
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Error updating purchase order' });
  }
});

app.delete('/purchase-orders/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await prisma.purchaseOrder.delete({ where: { id } });
    res.json({ message: 'Purchase order deleted' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Error deleting purchase order' });
  }
});

// Start the server if this module is run directly
if (require.main === module) {
  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

module.exports = app;
