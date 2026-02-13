import { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { Sparkles, Lock, Mail, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

export function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const success = await login(email, password);
    
    if (success) {
      toast.success('Login successful!');
    } else {
      toast.error('Invalid email or password');
    }
    
    setIsLoading(false);
  };

  const demoCredentials = [
    { role: 'Admin', email: 'admin@fashionhub.com', password: 'admin123' },
    { role: 'Sales Person', email: 'sales@fashionhub.com', password: 'sales123' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-50 flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-pink-300 to-purple-300 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-blue-300 to-indigo-300 rounded-full blur-3xl"
        />
      </div>

      <div className="relative w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 rounded-2xl mb-4 shadow-lg">
              <Sparkles className="w-9 h-9 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              FashionHub
            </h1>
            <p className="text-slate-600">Sign in to your account</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-semibold text-slate-700">Demo Credentials</span>
            </div>
            <div className="space-y-3">
              {demoCredentials.map((cred, index) => (
                <div key={index} className="p-3 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-200">
                  <p className="text-xs font-semibold text-purple-700 mb-1">{cred.role}</p>
                  <p className="text-xs text-slate-600">
                    <span className="font-medium">Email:</span> {cred.email}
                  </p>
                  <p className="text-xs text-slate-600">
                    <span className="font-medium">Password:</span> {cred.password}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <p className="text-center text-sm text-slate-600 mt-6">
          © 2026 FashionHub. All rights reserved.
        </p>
      </div>
    </div>
  );
}
