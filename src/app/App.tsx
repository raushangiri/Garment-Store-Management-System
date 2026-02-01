import { useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import { LandingPage } from '@/app/components/LandingPage';
import { LoginPage } from '@/app/components/LoginPage';
import { Dashboard } from '@/app/components/Dashboard';
import { Inventory } from '@/app/components/Inventory';
import { PointOfSale } from '@/app/components/PointOfSale';
import { Reports } from '@/app/components/Reports';
import { Settings } from '@/app/components/Settings';
import { PurchaseOrders } from '@/app/components/PurchaseOrders';
import { Sidebar } from '@/app/components/Sidebar';
import { MobileNav } from '@/app/components/MobileNav';
import { StoreProvider } from '@/app/context/StoreContext';
import { AuthProvider, useAuth } from '@/app/context/AuthContext';
import { PurchaseProvider } from '@/app/context/PurchaseContext';

function AppContent() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showLanding, setShowLanding] = useState(true);

  useEffect(() => {
    // Check if user has visited before
    const hasVisited = localStorage.getItem('hasVisited');
    if (hasVisited && user) {
      setShowLanding(false);
    }
  }, [user]);

  const handleGetStarted = () => {
    localStorage.setItem('hasVisited', 'true');
    setShowLanding(false);
  };

  // Show landing page for first-time visitors
  if (showLanding && !user) {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  // Show login page if not authenticated
  if (!user) {
    return <LoginPage />;
  }

  // For salesPerson role, redirect to POS only
  if (user.role === 'salesPerson' && activeTab !== 'pos') {
    setActiveTab('pos');
  }

  const renderContent = () => {
    // SalesPerson can only access POS
    if (user.role === 'salesPerson') {
      return <PointOfSale />;
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
      <StoreProvider>
        <PurchaseProvider>
          <AppContent />
        </PurchaseProvider>
      </StoreProvider>
    </AuthProvider>
  );
}