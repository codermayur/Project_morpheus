import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../store/authStore';

const step1Schema = z.object({
  phoneNumber: z.string().regex(/^[6-9]\d{9}$/, 'Invalid phone number'),
  name: z.string().min(2, 'Name required'),
  password: z.string().min(6, 'Min 6 characters'),
  location: z.object({
    state: z.string().optional(),
    district: z.string().optional(),
  }).optional(),
});

const step2Schema = z.object({
  otp: z.string().length(6, 'Enter 6-digit OTP'),
});

export default function Register() {
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const step1Form = useForm({
    resolver: zodResolver(step1Schema),
    defaultValues: { phoneNumber: '', name: '', password: '', location: {} },
  });

  const step2Form = useForm({
    resolver: zodResolver(step2Schema),
    defaultValues: { otp: '' },
  });

  const onStep1 = async (data) => {
    setLoading(true);
    try {
      await authService.register(data);
      setPhoneNumber(data.phoneNumber);
      setStep(2);
      toast.success('OTP sent to your phone');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const onStep2 = async (data) => {
    setLoading(true);
    try {
      const res = await authService.verifyOTP({ phoneNumber, otp: data.otp });
      const { user, tokens } = res.data.data;
      setAuth(user, tokens.accessToken, tokens.refreshToken);
      toast.success('Registration successful!');
      navigate('/feed');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-center mb-8">Join KrishiConnect</h1>

      {step === 1 ? (
        <form onSubmit={step1Form.handleSubmit(onStep1)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <input
              {...step1Form.register('phoneNumber')}
              type="tel"
              placeholder="9876543210"
              className="input-field"
            />
            {step1Form.formState.errors.phoneNumber && (
              <p className="text-red-500 text-sm mt-1">{step1Form.formState.errors.phoneNumber.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              {...step1Form.register('name')}
              placeholder="Ramesh Kumar"
              className="input-field"
            />
            {step1Form.formState.errors.name && (
              <p className="text-red-500 text-sm mt-1">{step1Form.formState.errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              {...step1Form.register('password')}
              type="password"
              placeholder="••••••••"
              className="input-field"
            />
            {step1Form.formState.errors.password && (
              <p className="text-red-500 text-sm mt-1">{step1Form.formState.errors.password.message}</p>
            )}
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-3">
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </form>
      ) : (
        <form onSubmit={step2Form.handleSubmit(onStep2)} className="space-y-4">
          <p className="text-stone-600 text-center">
            OTP sent to {phoneNumber}
          </p>
          <div>
            <label className="block text-sm font-medium mb-1">Enter OTP</label>
            <input
              {...step2Form.register('otp')}
              type="text"
              placeholder="123456"
              maxLength={6}
              className="input-field text-center text-2xl tracking-widest"
            />
            {step2Form.formState.errors.otp && (
              <p className="text-red-500 text-sm mt-1">{step2Form.formState.errors.otp.message}</p>
            )}
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-3">
            {loading ? 'Verifying...' : 'Verify & Register'}
          </button>
        </form>
      )}

      <p className="text-center mt-4 text-stone-600">
        Already have an account? <Link to="/login" className="text-primary-600 font-medium">Login</Link>
      </p>
    </div>
  );
}
