import React from 'react';
import { useForm } from '@tanstack/react-form';
import { valibotValidator } from '@tanstack/valibot-form-adapter';
import { useNavigate, Link } from '@tanstack/react-router';
import { useRegister } from '../hooks/useAuth';
import { RegisterFormValues, registerSchema } from '../schemas/register.schema';

export function RegisterPage() {
  const registerMutation = useRegister();
  const navigate = useNavigate();

  const form = useForm<RegisterFormValues>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validatorAdapter: valibotValidator(),
    validators: {
      onChange: registerSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await registerMutation.mutateAsync({
          firstName: value.firstName,
          lastName: value.lastName,
          email: value.email,
          password: value.password,
        });
        alert('Registration successful! Please check your email to verify your account.');
        navigate({ to: '/login' });
      } catch (err: any) {
        alert(err.response?.data?.message || 'Registration failed');
      }
    },
  });

  return (
    <div className="max-w-md mx-auto mt-12 p-6 border rounded-lg shadow-md bg-white">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create an Account</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        {/* First Name */}
        <form.Field
          name="firstName"
          children={(field) => (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
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

        {/* Last Name */}
        <form.Field
          name="lastName"
          children={(field) => (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
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

        {/* Email */}
        <form.Field
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

        {/* Password */}
        <form.Field
          name="password"
          children={(field) => (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
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

        {/* Confirm Password */}
        <form.Field
          name="confirmPassword"
          children={(field) => (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
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

        {/* Submit Button */}
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <button
              type="submit"
              disabled={!canSubmit || registerMutation.isPending || isSubmitting}
              className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition duration-200 disabled:opacity-50"
            >
              {registerMutation.isPending || isSubmitting ? 'Creating Account...' : 'Register'}
            </button>
          )}
        />
      </form>

      <p className="text-sm text-center text-gray-600 mt-4">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-600 font-semibold hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}