import * as v from 'valibot';

export const registerSchema = v.pipe(
  v.object({
    firstName: v.pipe(
      v.string(),
      v.nonEmpty('First name is required'),
      v.minLength(2, 'First name must be at least 2 characters'),
      v.maxLength(50, 'First name must not exceed 50 characters')
    ),
    lastName: v.pipe(
      v.string(),
      v.nonEmpty('Last name is required'),
      v.minLength(2, 'Last name must be at least 2 characters'),
      v.maxLength(50, 'Last name must not exceed 50 characters')
    ),
    email: v.pipe(
      v.string(),
      v.nonEmpty('Email is required'),
      v.email('Please enter a valid email address')
    ),
    password: v.pipe(
      v.string(),
      v.nonEmpty('Password is required'),
      v.minLength(8, 'Password must be at least 8 characters'),
      v.regex(
        /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
        'Password must contain upper/lowercase, numbers, and special characters'
      )
    ),
    confirmPassword: v.pipe(
      v.string(),
      v.nonEmpty('Please confirm your password')
    ),
  }),
  v.forward(
    v.partialCheck(
      [['password'], ['confirmPassword']],
      (input) => input.password === input.confirmPassword,
      "Passwords don't match"
    ),
    ['confirmPassword']
  )
);
export const loginSchema = v.object({
  email: v.pipe(
    v.string(),
    v.nonEmpty('Email is required'),
    v.email('Please enter a valid email address')
  ),
  password: v.pipe(
    v.string(),
    v.nonEmpty('Password is required')
  ),
});

export type RegisterFormValues = v.InferInput<typeof registerSchema>;
export type LoginFormValues = v.InferInput<typeof loginSchema>;