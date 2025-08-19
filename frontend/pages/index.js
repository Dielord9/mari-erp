import { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';

export default function InventoryPage() {
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || '';
    axios.get(`${apiBase}/inventory`)
      .then(res => setInventory(res.data))
      .catch(err => console.error('Error fetching inventory:', err));
  }, []);

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Inventory</h2>
      </div>

      {inventory.length === 0 ? (
        <p className="text-gray-500">No items in inventory</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {inventory.map((item) => (
            <li key={item.id} className="border rounded-lg p-4 dark:border-neutral-800">
              <div className="font-medium">{item.title}</div>
              <div className="text-sm text-gray-500 dark:text-neutral-400">
                SKU: {item.sku} • {item.purity} • {item.netWeightG}g
              </div>
              <div className="mt-3 flex gap-2">
                <a className="underline text-blue-600" href={`/products/${item.id}`}>View</a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Layout>
  );
}
