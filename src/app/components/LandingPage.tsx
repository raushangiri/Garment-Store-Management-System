import { Sparkles, ShoppingBag, TrendingUp, Package, Shield, Zap, BarChart3, Users } from 'lucide-react';
import { motion } from 'motion/react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const features = [
    {
      icon: ShoppingBag,
      title: 'Smart POS System',
      description: 'Lightning-fast checkout with barcode scanning and smart inventory sync',
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: Package,
      title: 'Inventory Management',
      description: 'Track stock by size, color, and style with automatic low-stock alerts',
      color: 'from-purple-500 to-indigo-500'
    },
    {
      icon: BarChart3,
      title: 'Analytics & Insights',
      description: 'Real-time sales analytics and trend forecasting for your fashion business',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Users,
      title: 'Role-Based Access',
      description: 'Secure access control for admins and sales staff with custom permissions',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const innovativeFeatures = [
    'AI-powered size recommendations',
    'Visual search for similar styles',
    'Automated reorder suggestions',
    'Customer style preferences tracking',
    'Seasonal trend analysis',
    'Multi-variant product management'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-pink-300 to-purple-300 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-300 to-indigo-300 rounded-full blur-3xl"
        />
      </div>

      <div className="relative">
        {/* Header */}
        <nav className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  FashionHub
                </h1>
                <p className="text-xs text-slate-600">Store Management</p>
              </div>
            </motion.div>
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={onGetStarted}
              className="px-6 py-2.5 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              Get Started
            </motion.button>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="container mx-auto px-6 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="inline-block px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm font-semibold text-purple-600 shadow-sm mb-6">
                ✨ Next-Gen Fashion Retail Management
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            >
              <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Revolutionize
              </span>
              <br />
              <span className="text-slate-800">Your Fashion Business</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto"
            >
              Complete garment store management solution with smart inventory, 
              powerful analytics, and seamless checkout experience
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button
                onClick={onGetStarted}
                className="px-8 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-3xl transition-all hover:scale-105"
              >
                Start Free Trial
              </button>
              <button className="px-8 py-4 bg-white/80 backdrop-blur-sm text-slate-800 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105">
                Watch Demo
              </button>
            </motion.div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all hover:scale-105"
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 shadow-md`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{feature.title}</h3>
                  <p className="text-slate-600">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Innovative Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-20 bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl"
          >
            <div className="text-center mb-10">
              <div className="inline-block p-3 bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                Innovative Features for Modern Retail
              </h3>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Powered by cutting-edge technology to give you a competitive edge
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {innovativeFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                  className="flex items-center gap-3 p-4 bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl border border-purple-200"
                >
                  <div className="w-2 h-2 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full" />
                  <span className="text-slate-700 font-medium">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Stats Section */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Active Stores', value: '1000+' },
              { label: 'Daily Transactions', value: '50K+' },
              { label: 'Products Managed', value: '5M+' },
              { label: 'Satisfaction Rate', value: '99%' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5 + index * 0.1 }}
                className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg"
              >
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-slate-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2 }}
            className="mt-20 text-center bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 rounded-3xl p-12 shadow-2xl"
          >
            <Shield className="w-16 h-16 text-white mx-auto mb-6" />
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Store?
            </h3>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of fashion retailers who trust FashionHub for their business
            </p>
            <button
              onClick={onGetStarted}
              className="px-10 py-4 bg-white text-purple-600 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105"
            >
              Start Your Free Trial Today
            </button>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="container mx-auto px-6 py-8 mt-20 border-t border-slate-200">
          <div className="text-center text-slate-600">
            <p>© 2026 FashionHub. All rights reserved.</p>
            <p className="text-sm mt-2">Empowering fashion retail with innovative technology</p>
          </div>
        </div>
      </div>
    </div>
  );
}
