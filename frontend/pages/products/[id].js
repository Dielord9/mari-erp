import Layout from '../components/Layout';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

const apiBase = process.env.NEXT_PUBLIC_API_URL || '';

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    async function fetchProduct() {
      try {
        const res = await axios.get(`${apiBase}/inventory/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (!id) {
    return null;
  }

  return (
    <Layout>
      {loading && <p>Loading...</p>}
      {!loading && product && (
        <div>
          <h2 className="text-2xl font-semibold mb-2">{product.title}</h2>
          <p className="text-gray-500 mb-2">
            SKU: {product.sku} — {product.purity} — {product.netWeightG}g
          </p>
          <p>Making Fee: LKR {product.makingFeeLkr}</p>
          <p>Wastage: LKR {product.wastageLkr}</p>
        </div>
      )}
    </Layout>
  );
}
