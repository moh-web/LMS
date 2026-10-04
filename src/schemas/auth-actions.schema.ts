import * as v from 'valibot';
// 1. Schema to request password reset (Forgot Password)
export const forgotPasswordSchema = v.object({
  email: v.pipe(
    v.string(),
    v.nonEmpty('Please enter your email address'),
    v.email('Please enter a valid email address')
  ),
});

// 2. Schema to reset password (Reset Password)
export const resetPasswordSchema = v.pipe(
  v.object({
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

export type ForgotPasswordValues = v.InferInput<typeof forgotPasswordSchema>;
export type ResetPasswordValues = v.InferInput<typeof resetPasswordSchema>;