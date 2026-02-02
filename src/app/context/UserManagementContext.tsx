import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface SalesUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'salesPerson';
  status: 'active' | 'inactive';
  permissions: {
    canDiscount: boolean;
    canRefund: boolean;
    canViewReports: boolean;
    maxDiscountPercent: number;
  };
  createdAt: string;
  lastLogin?: string;
}

interface UserManagementContextType {
  salesUsers: SalesUser[];
  addSalesUser: (user: Omit<SalesUser, 'id' | 'createdAt' | 'role'>) => void;
  updateSalesUser: (id: string, user: Partial<SalesUser>) => void;
  deleteSalesUser: (id: string) => void;
  getSalesUser: (email: string, password: string) => SalesUser | undefined;
}

const UserManagementContext = createContext<UserManagementContextType | undefined>(undefined);

const initialSalesUsers: SalesUser[] = [
  {
    id: '1',
    name: 'Sales Person',
    email: 'sales@fashionhub.com',
    phone: '+91 98765 43210',
    password: 'sales123',
    role: 'salesPerson',
    status: 'active',
    permissions: {
      canDiscount: true,
      canRefund: false,
      canViewReports: false,
      maxDiscountPercent: 10
    },
    createdAt: new Date().toISOString()
  }
];

export function UserManagementProvider({ children }: { children: ReactNode }) {
  const [salesUsers, setSalesUsers] = useState<SalesUser[]>(() => {
    const saved = localStorage.getItem('fashionhub-sales-users');
    return saved ? JSON.parse(saved) : initialSalesUsers;
  });

  useEffect(() => {
    localStorage.setItem('fashionhub-sales-users', JSON.stringify(salesUsers));
  }, [salesUsers]);

  const addSalesUser = (user: Omit<SalesUser, 'id' | 'createdAt' | 'role'>) => {
    const newUser: SalesUser = {
      ...user,
      id: Date.now().toString(),
      role: 'salesPerson',
      createdAt: new Date().toISOString()
    };
    setSalesUsers([...salesUsers, newUser]);
  };

  const updateSalesUser = (id: string, updatedUser: Partial<SalesUser>) => {
    setSalesUsers(salesUsers.map(u => u.id === id ? { ...u, ...updatedUser } : u));
  };

  const deleteSalesUser = (id: string) => {
    setSalesUsers(salesUsers.filter(u => u.id !== id));
  };

  const getSalesUser = (email: string, password: string) => {
    return salesUsers.find(u => u.email === email && u.password === password && u.status === 'active');
  };

  return (
    <UserManagementContext.Provider
      value={{
        salesUsers,
        addSalesUser,
        updateSalesUser,
        deleteSalesUser,
        getSalesUser
      }}
    >
      {children}
    </UserManagementContext.Provider>
  );
}

export function useUserManagement() {
  const context = useContext(UserManagementContext);
  if (context === undefined) {
    throw new Error('useUserManagement must be used within a UserManagementProvider');
  }
  return context;
}
