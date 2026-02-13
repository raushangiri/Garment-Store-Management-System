import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { usersAPI } from '@/services/api';
import { toast } from 'sonner';

export interface SalesUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
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
  loading: boolean;
  error: string | null;
  addSalesUser: (user: Omit<SalesUser, 'id' | 'createdAt' | 'role'>) => Promise<void>;
  updateSalesUser: (id: string, user: Partial<SalesUser>) => Promise<void>;
  deleteSalesUser: (id: string) => Promise<void>;
  getSalesUser: (email: string, password: string) => SalesUser | undefined;
  refreshUsers: () => Promise<void>;
}

const UserManagementContext = createContext<UserManagementContextType | undefined>(undefined);

export function UserManagementProvider({ children }: { children: ReactNode }) {
  const [salesUsers, setSalesUsers] = useState<SalesUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load users on mount
  useEffect(() => {
    refreshUsers();
  }, []);

  const refreshUsers = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getAll();
      // Map _id to id
      const mappedUsers = response.data.map((u: any) => ({
        ...u,
        id: u._id || u.id,
        role: 'salesPerson' as const
      }));
      setSalesUsers(mappedUsers);
    } catch (err: any) {
      console.error('Failed to load users:', err);
      setError(err.message);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const addSalesUser = async (user: Omit<SalesUser, 'id' | 'createdAt' | 'role'>) => {
    try {
      const response = await usersAPI.create({
        ...user,
        role: 'salesPerson'
      });
      
      const newUser = {
        ...response.data,
        id: response.data._id,
        role: 'salesPerson' as const,
        createdAt: response.data.createdAt || new Date().toISOString()
      };
      
      setSalesUsers([...salesUsers, newUser]);
      toast.success('User created successfully');
    } catch (err: any) {
      console.error('Failed to create user:', err);
      toast.error(err.message || 'Failed to create user');
      throw err;
    }
  };

  const updateSalesUser = async (id: string, updatedUser: Partial<SalesUser>) => {
    try {
      const response = await usersAPI.update(id, updatedUser);
      const updated = {
        ...response.data,
        id: response.data._id,
        role: 'salesPerson' as const
      };
      
      setSalesUsers(salesUsers.map(u => u.id === id ? updated : u));
      toast.success('User updated successfully');
    } catch (err: any) {
      console.error('Failed to update user:', err);
      toast.error(err.message || 'Failed to update user');
      throw err;
    }
  };

  const deleteSalesUser = async (id: string) => {
    try {
      await usersAPI.delete(id);
      setSalesUsers(salesUsers.filter(u => u.id !== id));
      toast.success('User deleted successfully');
    } catch (err: any) {
      console.error('Failed to delete user:', err);
      toast.error(err.message || 'Failed to delete user');
      throw err;
    }
  };

  const getSalesUser = (email: string, password: string) => {
    return salesUsers.find(u => u.email === email && u.status === 'active');
  };

  return (
    <UserManagementContext.Provider
      value={{
        salesUsers,
        loading,
        error,
        addSalesUser,
        updateSalesUser,
        deleteSalesUser,
        getSalesUser,
        refreshUsers
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
