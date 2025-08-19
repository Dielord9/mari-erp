import Layout from '../../components/Layout';
import axios from 'axios';
import { useState, useEffect } from 'react';

export default function CrmPage() {
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || '';
    axios.get(`${apiBase}/conversations`)
      .then(res => setConversations(res.data))
      .catch(err => console.error('Error fetching conversations', err));
  }, []);

  return (
    <Layout>
      <h2 className="text-2xl font-semibold mb-6">CRM Conversations</h2>
      {conversations.length === 0 ? (
        <p className="text-gray-500">No conversations</p>
      ) : (
        <ul className="space-y-3">
          {conversations.map(conv => (
            <li key={conv.id} className="border rounded-lg p-4 dark:border-neutral-800">
              <div className="font-medium">Conversation {conv.id}</div>
              <div className="text-sm text-gray-500 dark:text-neutral-400">
                Status: {conv.status} – Customer: {conv.customerId}
              </div>
            </li>
          ))}
        </ul>
      )}
    </Layout>
  );
}
