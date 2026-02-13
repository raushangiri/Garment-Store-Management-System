import { useState } from 'react';
import { Store, User, Bell, Shield, Database, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export function Settings() {
  const [storeName, setStoreName] = useState('Super Mart');
  const [storeEmail, setStoreEmail] = useState('contact@supermart.com');
  const [storePhone, setStorePhone] = useState('+91 98765 43210');
  const [notifications, setNotifications] = useState({
    lowStock: true,
    dailyReport: true,
    newSale: false
  });

  const handleSaveStore = () => {
    toast.success('Store details updated successfully');
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      localStorage.removeItem('supermart-products');
      localStorage.removeItem('supermart-sales');
      toast.success('All data cleared. Please refresh the page.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your store settings and preferences</p>
      </div>

      {/* Store Information */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Store className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Store Information</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Store Name
            </label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={storeEmail}
              onChange={(e) => setStoreEmail(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={storePhone}
              onChange={(e) => setStorePhone(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleSaveStore}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all shadow-sm"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Bell className="w-5 h-5 text-purple-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Notifications</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div>
              <p className="font-medium text-slate-800">Low Stock Alerts</p>
              <p className="text-sm text-slate-600">Get notified when products are low on stock</p>
            </div>
            <button
              onClick={() => setNotifications({ ...notifications, lowStock: !notifications.lowStock })}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                notifications.lowStock ? 'bg-blue-500' : 'bg-slate-300'
              }`}
            >
              <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                notifications.lowStock ? 'translate-x-6' : ''
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div>
              <p className="font-medium text-slate-800">Daily Sales Report</p>
              <p className="text-sm text-slate-600">Receive daily summary of sales</p>
            </div>
            <button
              onClick={() => setNotifications({ ...notifications, dailyReport: !notifications.dailyReport })}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                notifications.dailyReport ? 'bg-blue-500' : 'bg-slate-300'
              }`}
            >
              <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                notifications.dailyReport ? 'translate-x-6' : ''
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div>
              <p className="font-medium text-slate-800">New Sale Notification</p>
              <p className="text-sm text-slate-600">Get notified for each new sale</p>
            </div>
            <button
              onClick={() => setNotifications({ ...notifications, newSale: !notifications.newSale })}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                notifications.newSale ? 'bg-blue-500' : 'bg-slate-300'
              }`}
            >
              <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                notifications.newSale ? 'translate-x-6' : ''
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Database className="w-5 h-5 text-orange-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Data Management</h2>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Trash2 className="w-5 h-5 text-orange-600 mt-1" />
              <div className="flex-1">
                <p className="font-medium text-slate-800 mb-1">Clear All Data</p>
                <p className="text-sm text-slate-600 mb-3">
                  This will permanently delete all products, sales, and transaction history.
                  This action cannot be undone.
                </p>
                <button
                  onClick={handleClearData}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                >
                  Clear All Data
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-100 rounded-lg">
            <Shield className="w-5 h-5 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">About</h2>
        </div>

        <div className="space-y-2 text-sm text-slate-600">
          <p>Super Mart Store Management System</p>
          <p>Version 1.0.0</p>
          <p className="mt-4 pt-4 border-t border-slate-200">
            All data is stored locally in your browser. For production use, consider connecting
            to a backend database for persistent storage and multi-device access.
          </p>
        </div>
      </div>
    </div>
  );
}
