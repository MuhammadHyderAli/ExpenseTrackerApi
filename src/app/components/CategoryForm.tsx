'use client';

import { useState } from 'react';

interface CategoryFormProps {
  onSuccess?: () => void;
}

export default function CategoryForm({ onSuccess }: CategoryFormProps) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, userId: 3 }),
    });

    if (res.ok) {
      setMessage('Category created ✅');
      setName('');
      if (onSuccess) onSuccess();
    } else {
      const data = await res.json();
      setMessage(data.error || 'Something went wrong ❌');
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <h3 className="text-lg font-medium mb-2">Add Category</h3>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. Food, Travel"
        className="border px-3 py-2 rounded mr-2"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? 'Creating...' : 'Add'}
      </button>
      {message && <p className="mt-2 text-sm">{message}</p>}
    </form>
  );
}
