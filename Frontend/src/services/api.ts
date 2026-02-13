// API Service for FashionHub Frontend

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('fashionhub-token');
};

// Helper function to make authenticated requests
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

// ==================== AUTH API ====================
export const authAPI = {
  login: async (email: string, password: string) => {
    const data = await fetchWithAuth('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    // Store token in localStorage
    if (data.token) {
      localStorage.setItem('fashionhub-token', data.token);
      localStorage.setItem('fashionhub-user', JSON.stringify(data.user));
    }
    
    return data;
  },

  logout: async () => {
    await fetchWithAuth('/auth/logout', {
      method: 'POST',
    });
    localStorage.removeItem('fashionhub-token');
    localStorage.removeItem('fashionhub-user');
  },

  getMe: async () => {
    return await fetchWithAuth('/auth/me');
  },
};

// ==================== PRODUCTS API ====================
export const productsAPI = {
  getAll: async () => {
    return await fetchWithAuth('/products');
  },

  getOne: async (id: string) => {
    return await fetchWithAuth(`/products/${id}`);
  },

  create: async (productData: any) => {
    return await fetchWithAuth('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  update: async (id: string, productData: any) => {
    return await fetchWithAuth(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  },

  delete: async (id: string) => {
    return await fetchWithAuth(`/products/${id}`, {
      method: 'DELETE',
    });
  },

  updateStock: async (id: string, quantity: number, operation: 'add' | 'subtract' | 'set' = 'set') => {
    return await fetchWithAuth(`/products/${id}/stock`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity, operation }),
    });
  },

  getLowStock: async () => {
    return await fetchWithAuth('/products/low-stock');
  },
};

// ==================== SALES API ====================
export const salesAPI = {
  getAll: async () => {
    return await fetchWithAuth('/sales');
  },

  getOne: async (id: string) => {
    return await fetchWithAuth(`/sales/${id}`);
  },

  create: async (saleData: any) => {
    return await fetchWithAuth('/sales', {
      method: 'POST',
      body: JSON.stringify(saleData),
    });
  },

  getStats: async (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return await fetchWithAuth(`/sales/stats${query}`);
  },
};

// ==================== PURCHASE ORDERS API ====================
export const purchaseOrdersAPI = {
  getAll: async () => {
    return await fetchWithAuth('/purchase-orders');
  },

  getOne: async (id: string) => {
    return await fetchWithAuth(`/purchase-orders/${id}`);
  },

  create: async (orderData: any) => {
    return await fetchWithAuth('/purchase-orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  update: async (id: string, orderData: any) => {
    return await fetchWithAuth(`/purchase-orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(orderData),
    });
  },

  delete: async (id: string) => {
    return await fetchWithAuth(`/purchase-orders/${id}`, {
      method: 'DELETE',
    });
  },

  markAsReceived: async (id: string) => {
    return await fetchWithAuth(`/purchase-orders/${id}/receive`, {
      method: 'PATCH',
    });
  },
};

// ==================== SUPPLIERS API ====================
export const suppliersAPI = {
  getAll: async () => {
    return await fetchWithAuth('/suppliers');
  },

  getOne: async (id: string) => {
    return await fetchWithAuth(`/suppliers/${id}`);
  },

  create: async (supplierData: any) => {
    return await fetchWithAuth('/suppliers', {
      method: 'POST',
      body: JSON.stringify(supplierData),
    });
  },

  update: async (id: string, supplierData: any) => {
    return await fetchWithAuth(`/suppliers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(supplierData),
    });
  },

  delete: async (id: string) => {
    return await fetchWithAuth(`/suppliers/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================== DRAFTS API ====================
export const draftsAPI = {
  getAll: async () => {
    return await fetchWithAuth('/drafts');
  },

  getOne: async (id: string) => {
    return await fetchWithAuth(`/drafts/${id}`);
  },

  create: async (draftData: any) => {
    return await fetchWithAuth('/drafts', {
      method: 'POST',
      body: JSON.stringify(draftData),
    });
  },

  update: async (id: string, draftData: any) => {
    return await fetchWithAuth(`/drafts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(draftData),
    });
  },

  delete: async (id: string) => {
    return await fetchWithAuth(`/drafts/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================== USERS API ====================
export const usersAPI = {
  getAll: async () => {
    return await fetchWithAuth('/users');
  },

  getOne: async (id: string) => {
    return await fetchWithAuth(`/users/${id}`);
  },

  create: async (userData: any) => {
    return await fetchWithAuth('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  update: async (id: string, userData: any) => {
    return await fetchWithAuth(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  delete: async (id: string) => {
    return await fetchWithAuth(`/users/${id}`, {
      method: 'DELETE',
    });
  },
};

export default {
  auth: authAPI,
  products: productsAPI,
  sales: salesAPI,
  purchaseOrders: purchaseOrdersAPI,
  suppliers: suppliersAPI,
  drafts: draftsAPI,
  users: usersAPI,
};
