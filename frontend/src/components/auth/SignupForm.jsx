import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/(?=.*[a-z])/, 'Must contain a lowercase letter')
    .regex(/(?=.*[A-Z])/, 'Must contain an uppercase letter')
    .regex(/(?=.*\d)/, 'Must contain a number'),
  confirmPassword: z.string().min(1, 'Confirm password is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords don\'t match',
  path: ['confirmPassword'],
});

const SignupForm = ({ onSubmit }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' },
  });

  const submit = async (data) => {
    // Remove confirmPassword before sending
    const { confirmPassword, ...payload } = data;
    if (onSubmit) await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="signup-form">
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input id="firstName" {...register('firstName')} />
          {errors.firstName && <small className="error">{errors.firstName.message}</small>}
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input id="lastName" {...register('lastName')} />
          {errors.lastName && <small className="error">{errors.lastName.message}</small>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input id="email" type="email" {...register('email')} />
        {errors.email && <small className="error">{errors.email.message}</small>}
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input id="password" type="password" {...register('password')} />
        {errors.password && <small className="error">{errors.password.message}</small>}
        <small>Must be 8+ chars, include upper/lower and a number</small>
      </div>

      <div className="form-group">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input id="confirmPassword" type="password" {...register('confirmPassword')} />
        {errors.confirmPassword && <small className="error">{errors.confirmPassword.message}</small>}
      </div>

      <button type="submit" className="btn-primary" disabled={isSubmitting}>
        {isSubmitting ? 'Creating account...' : 'Create Account'}
      </button>
    </form>
  );
};

export default SignupForm;
