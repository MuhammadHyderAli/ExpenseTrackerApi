'use client';

import { useState } from 'react';

interface AuthFormProps {
  type: 'login' | 'signup';
  setType: (type: 'login' | 'signup') => void;
}

export default function AuthForm({ type, setType }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload =
      type === 'signup'
        ? { name, email, password }
        : { email, password };

    try {
      const res = await fetch(`/api/auth/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        return;
      }

      if (data.token) {
        localStorage.setItem('token', data.token);
        window.location.reload(); // Auto-login after signup/login
      }
    } catch (err: any) {
      setError(err.message || 'Error occurred');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold text-center">
        {type === 'login' ? 'Login' : 'Sign Up'}
      </h2>

      {type === 'signup' && (
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
      )}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border p-2 rounded"
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border p-2 rounded"
        required
      />

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 transition"
      >
        {type === 'login' ? 'Login' : 'Sign Up'}
      </button>

      <p className="text-center text-sm">
        {type === 'login' ? 'No account?' : 'Already have an account?'}{' '}
        <button
          type="button"
          onClick={() => setType(type === 'login' ? 'signup' : 'login')}
          className="text-green-600 underline"
        >
          {type === 'login' ? 'Sign up' : 'Login'}
        </button>
      </p>
    </form>
  );
}
