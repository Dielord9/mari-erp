const express = require('express');
const app = express();

app.use(express.json());

// In-memory data stores
let inventory = [];
let customers = [];
let orders = [];

// Inventory routes
app.get('/inventory', (req, res) => {
  res.json(inventory);
});

app.post('/inventory', (req, res) => {
  const item = req.body;
  inventory.push(item);
  res.status(201).json(item);
});

// Customer routes
app.get('/customers', (req, res) => {
  res.json(customers);
});

app.post('/customers', (req, res) => {
  const customer = req.body;
  customers.push(customer);
  res.status(201).json(customer);
});

// Order routes
app.get('/orders', (req, res) => {
  res.json(orders);
});

app.post('/orders', (req, res) => {
  const order = req.body;
  orders.push(order);
  res.status(201).json(order);
});

// Root route
app.get('/', (req, res) => {
  res.send('Mari ERP API');
});

module.exports = app;
