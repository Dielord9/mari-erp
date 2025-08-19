import Layout from '../components/Layout';
import axios from 'axios';
import { useState, useEffect } from 'react';

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || '';
    axios.get(`${apiBase}/customers`)
      .then(res => setCustomers(res.data))
      .catch(err => console.error('Error fetching customers:', err));
  }, []);

  return (
    <Layout>
      <h2 className="text-2xl font-semibold mb-6">Customers</h2>
      {customers.length === 0 ? (
        <p className="text-gray-500">No customers found</p>
      ) : (
        <ul className="space-y-3">
          {customers.map((c) => (
            <li key={c.id} className="border rounded p-4">
              <div className="font-medium">{c.name}</div>
              <div className="text-sm text-gray-500">{c.phone}</div>
            </li>
          ))}
        </ul>
      )}
    </Layout>
  );
}
