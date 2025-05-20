'use client';

import { useState } from 'react';

type Props = {
  categories: { id: number; name: string }[];
  onSuccess: () => void;
};

export default function ExpenseForm({ categories, onSuccess }: Props) {
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to add an expense.');
      return;
    }

    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          categoryId: parseInt(categoryId),
          note,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to add expense');
      }

      setAmount('');
      setCategoryId('');
      setNote('');
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mb-6">
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="border p-2 rounded w-full"
        required
      />
      <select
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        className="border p-2 rounded w-full"
        required
      >
        <option value="">Select category</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Note (optional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="border p-2 rounded w-full"
      />
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
        Add Expense
      </button>
      {error && <p className="text-red-600">{error}</p>}
    </form>
  );
}
