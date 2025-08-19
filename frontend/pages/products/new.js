import Layout from '../components/Layout';
import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const apiBase = process.env.NEXT_PUBLIC_API_URL || '';

export default function NewProductPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    sku: '',
    title: '',
    purity: '22K',
    netWeightG: '',
    grossWeightG: '',
    makingFeeLkr: '',
    wastageLkr: '',
    category: '',
    status: 'IN_STOCK'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        netWeightG: parseFloat(form.netWeightG),
        grossWeightG: parseFloat(form.grossWeightG),
        makingFeeLkr: parseInt(form.makingFeeLkr, 10),
        wastageLkr: parseInt(form.wastageLkr, 10),
      };
      await axios.post(`${apiBase}/inventory`, payload);
      router.push('/');
    } catch (error) {
      console.error('Failed to create product', error);
    }
  };

  return (
    <Layout>
      <h2 className="text-2xl font-semibold mb-4">Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium mb-1">SKU</label>
          <input
            type="text"
            name="sku"
            value={form.sku}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Net Weight (g)</label>
          <input
            type="number"
            name="netWeightG"
            value={form.netWeightG}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            step="0.01"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Gross Weight (g)</label>
          <input
            type="number"
            name="grossWeightG"
            value={form.grossWeightG}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            step="0.01"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Making Fee (LKR)</label>
          <input
            type="number"
            name="makingFeeLkr"
            value={form.makingFeeLkr}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Wastage (LKR)</label>
          <input
            type="number"
            name="wastageLkr"
            value={form.wastageLkr}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-black text-white dark:bg-white dark:text-black"
          >
            Save Product
          </button>
        </div>
      </form>
    </Layout>
  );
}
