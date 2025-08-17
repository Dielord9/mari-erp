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

// Start server if run directly
if (require.main === module) {
  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

module.exports = app;
