import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type UserRole = 'admin' | 'salesPerson';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users
const DEMO_USERS = {
  admin: {
    id: '1',
    name: 'Admin User',
    email: 'admin@fashionhub.com',
    password: 'admin123',
    role: 'admin' as UserRole
  },
  sales: {
    id: '2',
    name: 'Sales Person',
    email: 'sales@fashionhub.com',
    password: 'sales123',
    role: 'salesPerson' as UserRole
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('fashionhub-user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('fashionhub-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('fashionhub-user');
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Check demo users
    const demoUser = Object.values(DEMO_USERS).find(
      u => u.email === email && u.password === password
    );

    if (demoUser) {
      const { password: _, ...userWithoutPassword } = demoUser;
      setUser(userWithoutPassword);
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fashionhub-user');
    localStorage.removeItem('hasVisited');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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
