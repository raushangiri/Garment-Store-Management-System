import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { authAPI } from '@/services/api';
import { toast } from 'sonner';

export type UserRole = 'admin' | 'salesPerson';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  permissions?: {
    canDiscount: boolean;
    canRefund: boolean;
    canViewReports: boolean;
    maxDiscountPercent: number;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('fashionhub-user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('fashionhub-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('fashionhub-user');
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await authAPI.login(email, password);
      
      // API already stores token in localStorage
      // Map the user data
      const userData: User = {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        role: response.user.role,
        permissions: response.user.permissions
      };
      
      setUser(userData);
      toast.success(`Welcome back, ${userData.name}!`);
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Invalid email or password');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('fashionhub-user');
      localStorage.removeItem('fashionhub-token');
      localStorage.removeItem('hasVisited');
      toast.success('Logged out successfully');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}