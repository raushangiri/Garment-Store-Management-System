import { ShoppingCart, Package, BarChart3, Settings, LayoutDashboard, LogOut, User, Sparkles, ShoppingBag, Users, FileText } from 'lucide-react';
import { useAuth, UserRole } from '@/app/context/AuthContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: UserRole;
  onLogout: () => void;
}

export function Sidebar({ activeTab, setActiveTab, userRole, onLogout }: SidebarProps) {
  const { user } = useAuth();

  const adminNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pos', label: 'Point of Sale', icon: ShoppingCart },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'purchase', label: 'Purchase Orders', icon: ShoppingBag },
    { id: 'orders', label: 'Order History', icon: FileText },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // Sales person nav items - dynamic based on permissions
  const salesNavItems = [
    { id: 'pos', label: 'Point of Sale', icon: ShoppingCart },
    { id: 'orders', label: 'Order History', icon: FileText },
  ];

  // Add reports tab if sales person has permission
  if (userRole === 'salesPerson' && user?.permissions?.canViewReports) {
    salesNavItems.push({ id: 'reports', label: 'Reports', icon: BarChart3 });
  }

  const navItems = userRole === 'admin' ? adminNavItems : salesNavItems;

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 shadow-lg">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-md">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              FashionHub
            </h1>
            <p className="text-xs text-slate-500">Fashion Store</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-slate-800 text-sm truncate">{user?.name}</p>
            <p className="text-xs text-purple-600 capitalize">{user?.role === 'salesPerson' ? 'Sales Person' : 'Administrator'}</p>
          </div>
        </div>
      </div>

      <nav className="p-4 space-y-2 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-lg'
                  : 'text-slate-600 hover:bg-purple-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}