import { useState, useEffect } from 'react';
import { useUserManagement } from '@/app/context/UserManagementContext';
import { X, Save } from 'lucide-react';
import { toast } from 'sonner';

interface EditUserModalProps {
  userId: string;
  onClose: () => void;
}

export function EditUserModal({ userId, onClose }: EditUserModalProps) {
  const { salesUsers, updateSalesUser } = useUserManagement();
  const user = salesUsers.find(u => u.id === userId);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    status: 'active' as 'active' | 'inactive',
    permissions: {
      canDiscount: true,
      canRefund: false,
      canViewReports: false,
      maxDiscountPercent: 10
    }
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        password: user.password,
        status: user.status,
        permissions: user.permissions
      });
    }
  }, [user]);

  if (!user) {
    onClose();
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    updateSalesUser(userId, formData);
    toast.success('User updated successfully');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full my-8 shadow-2xl">
        <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <Save className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Edit Sales User</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 text-lg">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Account Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Permissions */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 text-lg">Permissions</h3>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-slate-800">Allow Discounts</label>
                  <p className="text-sm text-slate-600">User can apply discounts on sales</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({
                    ...formData,
                    permissions: { ...formData.permissions, canDiscount: !formData.permissions.canDiscount }
                  })}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    formData.permissions.canDiscount ? 'bg-blue-500' : 'bg-slate-300'
                  }`}
                >
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    formData.permissions.canDiscount ? 'translate-x-6' : ''
                  }`} />
                </button>
              </div>

              {formData.permissions.canDiscount && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Maximum Discount Percentage
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.permissions.maxDiscountPercent}
                    onChange={(e) => setFormData({
                      ...formData,
                      permissions: { ...formData.permissions, maxDiscountPercent: parseInt(e.target.value) || 0 }
                    })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-blue-200">
                <div>
                  <label className="font-medium text-slate-800">Allow Refunds</label>
                  <p className="text-sm text-slate-600">User can process refunds</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({
                    ...formData,
                    permissions: { ...formData.permissions, canRefund: !formData.permissions.canRefund }
                  })}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    formData.permissions.canRefund ? 'bg-blue-500' : 'bg-slate-300'
                  }`}
                >
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    formData.permissions.canRefund ? 'translate-x-6' : ''
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-blue-200">
                <div>
                  <label className="font-medium text-slate-800">View Reports</label>
                  <p className="text-sm text-slate-600">User can access sales reports</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({
                    ...formData,
                    permissions: { ...formData.permissions, canViewReports: !formData.permissions.canViewReports }
                  })}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    formData.permissions.canViewReports ? 'bg-blue-500' : 'bg-slate-300'
                  }`}
                >
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    formData.permissions.canViewReports ? 'translate-x-6' : ''
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:shadow-xl transition-all font-semibold"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
