import { useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import { LandingPage } from '@/app/components/LandingPage';
import { LoginPage } from '@/app/components/LoginPage';
import Setup from '@/app/components/Setup';
import { Dashboard } from '@/app/components/Dashboard';
import { Inventory } from '@/app/components/Inventory';
import { PointOfSale } from '@/app/components/PointOfSale';
import { Reports } from '@/app/components/Reports';
import { Settings } from '@/app/components/Settings';
import { PurchaseOrders } from '@/app/components/PurchaseOrders';
import { UserManagement } from '@/app/components/UserManagement';
import { OrderHistory } from '@/app/components/OrderHistory';
import { Sidebar } from '@/app/components/Sidebar';
import { MobileNav } from '@/app/components/MobileNav';
import { StoreProvider } from '@/app/context/StoreContext';
import { AuthProvider, useAuth } from '@/app/context/AuthContext';
import { PurchaseProvider } from '@/app/context/PurchaseContext';
import { UserManagementProvider } from '@/app/context/UserManagementContext';
import { DraftProvider } from '@/app/context/DraftContext';

function AppContent() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showLanding, setShowLanding] = useState(true);
  const [showSetup, setShowSetup] = useState(true);

  useEffect(() => {
    // Check if user has visited before
    const hasVisited = localStorage.getItem('hasVisited');
    if (hasVisited && user) {
      setShowLanding(false);
    }
    
    // Check if setup is complete
    const setupComplete = localStorage.getItem('setupComplete');
    if (setupComplete === 'true') {
      setShowSetup(false);
    }
  }, [user]);

  const handleSetupComplete = () => {
    localStorage.setItem('setupComplete', 'true');
    setShowSetup(false);
  };

  const handleGetStarted = () => {
    localStorage.setItem('hasVisited', 'true');
    setShowLanding(false);
  };

  // Show setup page first if not completed
  if (showSetup && !user) {
    return (
      <>
        <Toaster position="top-right" richColors />
        <Setup onSetupComplete={handleSetupComplete} />
      </>
    );
  }

  // Show landing page for first-time visitors
  if (showLanding && !user) {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  // Show login page if not authenticated
  if (!user) {
    return <LoginPage />;
  }

  // For salesPerson role, set default tab based on permissions
  useEffect(() => {
    if (user?.role === 'salesPerson') {
      // Valid tabs for sales person: pos, orders, reports (if permitted)
      const validTabs = ['pos', 'orders'];
      if (user?.permissions?.canViewReports) {
        validTabs.push('reports');
      }
      
      // Default to POS if current tab is not accessible
      if (!validTabs.includes(activeTab)) {
        setActiveTab('pos');
      }
    }
  }, [user, activeTab]);

  const renderContent = () => {
    // SalesPerson has limited access based on permissions
    if (user.role === 'salesPerson') {
      switch (activeTab) {
        case 'pos':
          return <PointOfSale />;
        case 'orders':
          return <OrderHistory />;
        case 'reports':
          // Only show reports if they have permission
          return user.permissions?.canViewReports ? <Reports /> : <PointOfSale />;
        default:
          return <PointOfSale />;
      }
    }

    // Admin has full access
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'inventory':
        return <Inventory />;
      case 'pos':
        return <PointOfSale />;
      case 'purchase':
        return <PurchaseOrders />;
      case 'orders':
        return <OrderHistory />;
      case 'users':
        return <UserManagement />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-50">
      <Toaster position="top-right" richColors />
      
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} userRole={user.role} onLogout={logout} />
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        <main className="p-4 pb-20 lg:p-8 lg:pb-8">
          {renderContent()}
        </main>
      </div>

      {/* Mobile Navigation */}
      {user.role !== 'salesPerson' && (
        <div className="lg:hidden">
          <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <UserManagementProvider>
        <StoreProvider>
          <DraftProvider>
            <PurchaseProvider>
              <AppContent />
            </PurchaseProvider>
          </DraftProvider>
        </StoreProvider>
      </UserManagementProvider>
    </AuthProvider>
  );
}