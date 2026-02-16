import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../store/authStore';

const schema = z.object({
  phoneNumber: z.string().regex(/^[6-9]\d{9}$/, 'Invalid phone number'),
  password: z.string().min(1, 'Password required'),
});

export default function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { phoneNumber: '', password: '' },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await authService.login(data);
      const { user, tokens } = res.data.data;
      setAuth(user, tokens.accessToken, tokens.refreshToken);
      toast.success('Login successful!');
      navigate('/feed');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-center mb-8">Login to KrishiConnect</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Phone Number</label>
          <input
            {...register('phoneNumber')}
            type="tel"
            placeholder="9876543210"
            className="input-field"
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            {...register('password')}
            type="password"
            placeholder="••••••••"
            className="input-field"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full py-3">
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p className="text-center mt-4 text-stone-600">
        Don't have an account? <Link to="/register" className="text-primary-600 font-medium">Register</Link>
      </p>
    </div>
  );
}
