'use client';

import useSWR from 'swr';
import { useState, useEffect } from 'react';
import CategoryForm from './components/CategoryForm';
import ExpenseForm from './components/ExpenseForm';
import AuthForm from './components/AuthForm';

const fetcher = async (url: string) => {
  const token = localStorage.getItem('token');
  const res = await fetch(url, {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || 'Error fetching data');
  }

  return res.json();
};

export default function Home() {
  const [token, setToken] = useState<string | null>(null);
  const [authType, setAuthType] = useState<'login' | 'signup'>('login');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setToken(localStorage.getItem('token'));
    }
  }, []);

  const {
    data: categories,
    error: catError,
    mutate: mutateCategories,
  } = useSWR(token ? '/api/categories' : null, fetcher);

  const {
    data: expenses,
    error: expError,
    mutate: mutateExpenses,
  } = useSWR(token ? '/api/expenses' : null, fetcher);

  if (catError) return <p>Error loading categories: {catError.message}</p>;
  if (expError) return <p>Error loading expenses: {expError.message}</p>;

  // Calculate total expense amount
  const totalExpense = expenses
    ? expenses.reduce((sum: number, expense: any) => sum + expense.amount, 0)
    : 0;

  return (
    <main className="p-6 space-y-10 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-center">Expense Tracker</h1>

      {!token ? (
        <div className="bg-gray-50 p-4 rounded shadow">
          <AuthForm type={authType} setType={setAuthType} />
        </div>
      ) : (
        categories &&
        expenses && (
          <>
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-lg font-semibold mb-2">Add Category</h2>
              <CategoryForm onSuccess={() => mutateCategories()} />
            </div>

            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-lg font-semibold mb-2">Add Expense</h2>
              <ExpenseForm
                categories={categories}
                onSuccess={() => mutateExpenses()}
              />
            </div>

            <div>
              <h2 className="text-lg font-semibold">Categories</h2>
              <ul className="list-disc list-inside">
                {categories.length > 0 ? (
                  categories.map((c: any) => <li key={c.id}>{c.name}</li>)
                ) : (
                  <li>No categories found</li>
                )}
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold">Expenses</h2>
              <ul className="list-disc list-inside">
                {expenses.length > 0 ? (
                  expenses.map((e: any) => (
                    <li key={e.id}>
                      ${e.amount} — {e.category?.name || 'Uncategorized'} — {e.note}
                    </li>
                  ))
                ) : (
                  <li>No expenses found</li>
                )}
              </ul>

              {/* Total Expense Display */}
              <p className="mt-4 text-lg font-semibold">
                Total Expense: <span className="text-green-700">${totalExpense.toFixed(2)}</span>
              </p>
            </div>
          </>
        )
      )}
    </main>
  );
}
