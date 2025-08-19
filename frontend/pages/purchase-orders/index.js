import Layout from '../components/Layout';
import axios from 'axios';
import { useState, useEffect } from 'react';

const apiBase = process.env.NEXT_PUBLIC_API_URL || '';

export default function PurchaseOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await axios.get(`${apiBase}/purchase-orders`);
        setOrders(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  return (
    <Layout>
      <h2 className="text-2xl font-semibold mb-4">Purchase Orders</h2>
      {loading && <p>Loading...</p>}
      {!loading && orders.length === 0 && <p>No purchase orders.</p>}
      <ul className="space-y-2">
        {orders.map((order) => (
          <li key={order.id} className="border p-4 rounded">
            <div><strong>ID:</strong> {order.id}</div>
            <div><strong>Status:</strong> {order.status}</div>
            <div><strong>Total Cost:</strong> LKR {order.totalCost}</div>
          </li>
        ))}
      </ul>
    </Layout>
  );
}
