import React from 'react';
import { useSearch, useNavigate, Link } from '@tanstack/react-router';
import { useForm } from '@tanstack/react-form';
import { valibotValidator } from '@tanstack/valibot-form-adapter';
import { useMutation } from '@tanstack/react-query';
import { api } from '../api/axios';
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  ForgotPasswordValues,
  ResetPasswordValues,
} from '../schemas/auth-actions.schema';

export function ResetPasswordPage() {
  const search = useSearch({ strict: false }) as { token?: string };
  const token = search.token;
  const navigate = useNavigate();

  // Mutations
  const forgotPasswordMutation = useMutation({
    mutationFn: (data: ForgotPasswordValues) => api.post('/auth/forgot-password', data),
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (data: { token: string; password: string }) => api.post('/auth/reset-password', data),
  });

  // ------------------------------------------------------------------
  // Form 1: Forgot Password Form (إذا كان الـ Token غير موجود)
  // ------------------------------------------------------------------
  const forgotForm = useForm<ForgotPasswordValues>({
    defaultValues: { email: '' },
    validatorAdapter: valibotValidator(),
    validators: { onChange: forgotPasswordSchema },
    onSubmit: async ({ value }) => {
      try {
        await forgotPasswordMutation.mutateAsync(value);
        alert('Password reset instructions have been sent to your email.');
      } catch (err: any) {
        alert(err.response?.data?.message || 'Failed to send reset link.');
      }
    },
  });

  // ------------------------------------------------------------------
  // Form 2: Reset Password Form 
  // ------------------------------------------------------------------
  const resetForm = useForm<ResetPasswordValues>({
    defaultValues: { password: '', confirmPassword: '' },
    validatorAdapter: valibotValidator(),
    validators: { onChange: resetPasswordSchema },
    onSubmit: async ({ value }) => {
      try {
        await resetPasswordMutation.mutateAsync({
          token: token!,
          password: value.password,
        });
        alert('Password reset successfully! You can now log in.');
        navigate({ to: '/login' });
      } catch (err: any) {
        alert(err.response?.data?.message || 'Failed to reset password.');
      }
    },
  });

  // Render: Forgot Password View
  if (!token) {
    return (
      <div className="max-w-md mx-auto mt-12 p-6 border rounded-lg shadow-md bg-white">
        <h2 className="text-2xl font-bold mb-2 text-center text-gray-800">Forgot Password</h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            forgotForm.handleSubmit();
          }}
          className="space-y-4"
        >
          <forgotForm.Field
            name="email"
            children={(field) => (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="w-full border p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-red-500 text-xs mt-1">{field.state.meta.errors.join(', ')}</p>
                )}
              </div>
            )}
          />

          <forgotForm.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <button
                type="submit"
                disabled={!canSubmit || forgotPasswordMutation.isPending || isSubmitting}
                className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition duration-200 disabled:opacity-50"
              >
                {forgotPasswordMutation.isPending || isSubmitting ? 'Sending Link...' : 'Send Reset Link'}
              </button>
            )}
          />
        </form>

        <div className="text-center mt-4">
          <Link to="/login" className="text-sm text-blue-600 font-semibold hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  // Render: Reset Password View
  return (
    <div className="max-w-md mx-auto mt-12 p-6 border rounded-lg shadow-md bg-white">
      <h2 className="text-2xl font-bold mb-2 text-center text-gray-800">Set New Password</h2>
      <p className="text-sm text-gray-600 text-center mb-6">Enter a new password for your account.</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          resetForm.handleSubmit();
        }}
        className="space-y-4"
      >
        <resetForm.Field
          name="password"
          children={(field) => (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="w-full border p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              {field.state.meta.errors.length > 0 && (
                <p className="text-red-500 text-xs mt-1">{field.state.meta.errors.join(', ')}</p>
              )}
            </div>
          )}
        />

        <resetForm.Field
          name="confirmPassword"
          children={(field) => (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="w-full border p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              {field.state.meta.errors.length > 0 && (
                <p className="text-red-500 text-xs mt-1">{field.state.meta.errors.join(', ')}</p>
              )}
            </div>
          )}
        />

        <resetForm.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <button
              type="submit"
              disabled={!canSubmit || resetPasswordMutation.isPending || isSubmitting}
              className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition duration-200 disabled:opacity-50"
            >
              {resetPasswordMutation.isPending || isSubmitting ? 'Updating Password...' : 'Reset Password'}
            </button>
          )}
        />
      </form>
    </div>
  );
}