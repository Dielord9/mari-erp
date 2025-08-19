import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';

export default function NewSupplierPage() {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    address: '',
    email: '',
    phone: ''
  });
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || ''}/suppliers`, formData);
      router.push('/suppliers');
    } catch (err) {
      console.error(err);
      alert('Error creating supplier');
    }
  };

  return (
    <Layout>
      <h2>New Supplier</h2>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.5rem', maxWidth: '600px' }}>
        <label>
          Name:
          <input name="name" value={formData.name} onChange={handleChange} />
        </label>
        <label>
          Contact:
          <input name="contact" value={formData.contact} onChange={handleChange} />
        </label>
        <label>
          Address:
          <input name="address" value={formData.address} onChange={handleChange} />
        </label>
        <label>
          Email:
          <input name="email" value={formData.email} onChange={handleChange} />
        </label>
        <label>
          Phone:
          <input name="phone" value={formData.phone} onChange={handleChange} />
        </label>
        <button type="submit">Save</button>
      </form>
    </Layout>
  );
}
