import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home() {
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || '';
    axios.get(`${apiBase}/inventory`)
      .then(res => {
        setInventory(res.data);
      })
      .catch(err => {
        console.error('Error fetching inventory:', err);
      });
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Mari ERP Inventory</h1>
      {inventory.length === 0 ? (
        <p>No items in inventory.</p>
      ) : (
        <ul>
          {inventory.map((item, index) => (
            <li key={index}>
              {item.title || item.name || item.sku} - {item.netWeightG}g - {item.purity}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
