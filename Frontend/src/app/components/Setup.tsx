import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Loader2, ShieldCheck, User, Mail, Phone, Lock } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface SetupProps {
  onSetupComplete: () => void;
}

export default function Setup({ onSetupComplete }: SetupProps) {
  const [loading, setLoading] = useState(false);
  const [checkingSetup, setCheckingSetup] = useState(true);
  const [setupRequired, setSetupRequired] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    checkSetupStatus();
  }, []);

  const checkSetupStatus = async () => {
    try {
      setCheckingSetup(true);
      const response = await fetch(`${API_URL}/setup/status`);
      const data = await response.json();
      
      if (data.success && data.setupRequired) {
        setSetupRequired(true);
      } else {
        // Admin already exists, go to login
        onSetupComplete();
      }
    } catch (error) {
      console.error('Setup check error:', error);
      toast.error('Failed to check setup status. Please check if backend is running.');
      // Allow setup attempt even if check fails
      setSetupRequired(true);
    } finally {
      setCheckingSetup(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/setup/create-admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create admin user');
      }

      toast.success('Admin user created successfully! You can now login.');
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        onSetupComplete();
      }, 2000);
      
    } catch (error: any) {
      console.error('Setup error:', error);
      toast.error(error.message || 'Failed to create admin user');
    } finally {
      setLoading(false);
    }
  };

  if (checkingSetup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-white">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
          <p className="text-lg">Checking setup status...</p>
        </div>
      </div>
    );
  }

  if (!setupRequired) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4">
              <ShieldCheck className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Initial Setup
            </h1>
            <p className="text-white/80">
              Create your admin account to get started
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/20 text-white placeholder-white/60 rounded-xl pl-11 pr-4 py-3 border border-white/30 focus:border-white/60 focus:outline-none focus:ring-2 focus:ring-white/40"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white/20 text-white placeholder-white/60 rounded-xl pl-11 pr-4 py-3 border border-white/30 focus:border-white/60 focus:outline-none focus:ring-2 focus:ring-white/40"
                  placeholder="admin@fashionhub.com"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-white/20 text-white placeholder-white/60 rounded-xl pl-11 pr-4 py-3 border border-white/30 focus:border-white/60 focus:outline-none focus:ring-2 focus:ring-white/40"
                  placeholder="+91 98765 43210"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-white/20 text-white placeholder-white/60 rounded-xl pl-11 pr-4 py-3 border border-white/30 focus:border-white/60 focus:outline-none focus:ring-2 focus:ring-white/40"
                  placeholder="Enter password (min 6 characters)"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full bg-white/20 text-white placeholder-white/60 rounded-xl pl-11 pr-4 py-3 border border-white/30 focus:border-white/60 focus:outline-none focus:ring-2 focus:ring-white/40"
                  placeholder="Confirm your password"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-purple-600 font-semibold rounded-xl py-3 px-4 hover:bg-white/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Admin...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  Create Admin Account
                </>
              )}
            </button>
          </form>

          {/* Info */}
          <div className="mt-6 p-4 bg-white/10 rounded-xl border border-white/20">
            <p className="text-white/80 text-sm">
              ℹ️ This is a one-time setup. After creating the admin account, you can login and create additional sales users.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
