import Layout from '../../components/Layout';
import axios from 'axios';
import { useState, useEffect } from 'react';

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || '';
    axios.get(`${apiBase}/suppliers`)
      .then(res => setSuppliers(res.data))
      .catch(err => console.error('Error fetching suppliers', err));
  }, []);

  return (
    <Layout>
      <h2 className="text-2xl font-semibold mb-6">Suppliers</h2>
      {suppliers.length === 0 ? (
        <p className="text-gray-500">No suppliers found</p>
      ) : (
        <ul className="space-y-3">
          {suppliers.map(s => (
            <li key={s.id} className="border rounded-lg p-4 dark:border-neutral-800">
              <div className="font-medium">{s.name}</div>
              <div className="text-sm text-gray-500 dark:text-neutral-400">
                Contact: {s.contact} – Phone: {s.phone}
              </div>
            </li>
          ))}
        </ul>
      )}
    </Layout>
  );
}
