import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // هنا هنربطها لاحقًا بـ NestJS:
    // POST /auth/forgot-password

    setSubmitted(true);
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow bg-white">
      <h2 className="text-2xl font-bold mb-2">Forgot Password?</h2>

      <p className="text-gray-600 mb-6">
        Enter your email and we'll send you a link to reset your password.
      </p>

      {submitted ? (
        <div className="space-y-4">
          <p className="text-green-600">
            If an account exists with this email, a password reset link has
            been sent.
          </p>

          <Link
            to="/login"
            className="block text-center text-blue-600 hover:underline"
          >
            Back to Login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Email</label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Send Reset Link
          </button>

          <Link
            to="/login"
            className="block text-center text-gray-600 hover:underline"
          >
            Back to Login
          </Link>
        </form>
      )}
    </div>
  );
}