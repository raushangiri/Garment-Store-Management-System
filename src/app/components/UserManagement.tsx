import { useState } from 'react';
import { useUserManagement } from '@/app/context/UserManagementContext';
import { Plus, Edit2, Trash2, Users, UserCheck, UserX, Shield } from 'lucide-react';
import { format } from 'date-fns';
import { CreateUserModal } from '@/app/components/CreateUserModal';
import { EditUserModal } from '@/app/components/EditUserModal';
import { toast } from 'sonner';

export function UserManagement() {
  const { salesUsers, deleteSalesUser, updateSalesUser } = useUserManagement();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  const filteredUsers = salesUsers.filter(user => {
    if (filterStatus === 'all') return true;
    return user.status === filterStatus;
  });

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      deleteSalesUser(id);
      toast.success('User deleted successfully');
    }
  };

  const handleToggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    updateSalesUser(id, { status: newStatus });
    toast.success(`User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            User Management
          </h1>
          <p className="text-slate-600 mt-1">{salesUsers.length} sales users in system</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white rounded-xl hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Add New User</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl p-2 shadow-sm border border-slate-200">
        <div className="flex gap-2">
          {[
            { value: 'all', label: 'All Users' },
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' }
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilterStatus(tab.value as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterStatus === tab.value
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Users List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredUsers.map((user) => (
          <div key={user.id} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                  user.status === 'active' 
                    ? 'bg-gradient-to-br from-green-100 to-emerald-100' 
                    : 'bg-gradient-to-br from-slate-100 to-slate-200'
                }`}>
                  <Users className={`w-7 h-7 ${
                    user.status === 'active' ? 'text-green-600' : 'text-slate-400'
                  }`} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">{user.name}</h3>
                  <p className="text-sm text-slate-600">{user.email}</p>
                  <p className="text-sm text-slate-600">{user.phone}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingUserId(user.id)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {/* Status Badge */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">Status:</span>
                <button
                  onClick={() => handleToggleStatus(user.id, user.status)}
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    user.status === 'active'
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {user.status === 'active' ? (
                    <>
                      <UserCheck className="w-3 h-3" />
                      Active
                    </>
                  ) : (
                    <>
                      <UserX className="w-3 h-3" />
                      Inactive
                    </>
                  )}
                </button>
              </div>

              {/* Permissions */}
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-4 border border-purple-200">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-semibold text-slate-800">Permissions</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Can Discount:</span>
                    <span className={`font-medium ${user.permissions.canDiscount ? 'text-green-600' : 'text-red-600'}`}>
                      {user.permissions.canDiscount ? 'Yes' : 'No'}
                    </span>
                  </div>
                  {user.permissions.canDiscount && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Max Discount:</span>
                      <span className="font-medium text-purple-600">{user.permissions.maxDiscountPercent}%</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Can Refund:</span>
                    <span className={`font-medium ${user.permissions.canRefund ? 'text-green-600' : 'text-red-600'}`}>
                      {user.permissions.canRefund ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">View Reports:</span>
                    <span className={`font-medium ${user.permissions.canViewReports ? 'text-green-600' : 'text-red-600'}`}>
                      {user.permissions.canViewReports ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Account Info */}
              <div className="text-xs text-slate-500 pt-2 border-t border-slate-200">
                <div className="flex justify-between">
                  <span>Created:</span>
                  <span>{format(new Date(user.createdAt), 'dd MMM yyyy')}</span>
                </div>
                {user.lastLogin && (
                  <div className="flex justify-between mt-1">
                    <span>Last Login:</span>
                    <span>{format(new Date(user.lastLogin), 'dd MMM yyyy HH:mm')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-slate-200">
          <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 text-lg">No users found</p>
          <p className="text-slate-400 text-sm mt-2">
            {filterStatus === 'all' 
              ? 'Add your first sales user to get started' 
              : `No ${filterStatus} users at the moment`}
          </p>
        </div>
      )}

      {/* Modals */}
      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {editingUserId && (
        <EditUserModal
          userId={editingUserId}
          onClose={() => setEditingUserId(null)}
        />
      )}
    </div>
  );
}
