import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { productsAPI, salesAPI } from '@/services/api';
import { toast } from 'sonner';

export interface Product {
  id: string;
  name: string;
  barcode: string;
  price: number;
  stock: number;
  category: string;
  minStock: number;
  image?: string;
  description?: string;
  size?: string;
  color?: string;
  brand?: string;
  gender?: 'Men' | 'Women' | 'Unisex' | 'Kids';
  // Discount configuration
  discountEnabled: boolean;
  discountPercent: number;
  maxDiscountForSales: number; // Max discount % sales person can apply
  maxDiscountForAdmin: number; // Max discount % admin can apply
}

export interface Sale {
  id: string;
  invoiceNumber: string;
  date: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    size?: string;
    color?: string;
    discount?: number;
  }[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: string;
  cardLast4?: string;
  upiTransactionId?: string;
  customerName?: string;
  customerPhone?: string;
  salesPersonName?: string;
}

interface StoreContextType {
  products: Product[];
  sales: Sale[];
  loading: boolean;
  error: string | null;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addSale: (sale: Omit<Sale, 'id' | 'invoiceNumber' | 'date'>) => Promise<Sale | void>;
  getLowStockProducts: () => Product[];
  updateStock: (productId: string, quantity: number) => Promise<void>;
  generateInvoiceNumber: () => string;
  refreshProducts: () => Promise<void>;
  refreshSales: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial data on mount
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        refreshProducts(),
        refreshSales()
      ]);
    } catch (err: any) {
      console.error('Failed to load initial data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshProducts = async () => {
    try {
      const response = await productsAPI.getAll();
      // Map _id to id for frontend compatibility
      const mappedProducts = response.data.map((p: any) => ({
        ...p,
        id: p._id || p.id
      }));
      setProducts(mappedProducts);
    } catch (err: any) {
      console.error('Failed to load products:', err);
      toast.error('Failed to load products');
      throw err;
    }
  };

  const refreshSales = async () => {
    try {
      const response = await salesAPI.getAll();
      // Map _id to id and createdAt to date
      const mappedSales = response.data.map((s: any) => ({
        ...s,
        id: s._id || s.id,
        date: s.createdAt || s.date
      }));
      setSales(mappedSales);
    } catch (err: any) {
      console.error('Failed to load sales:', err);
      toast.error('Failed to load sales');
      throw err;
    }
  };

  const generateInvoiceNumber = () => {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');
    const lastInvoice = sales[0];
    let sequence = 1;

    if (lastInvoice && lastInvoice.invoiceNumber.includes(dateStr)) {
      const lastSeq = parseInt(lastInvoice.invoiceNumber.split('-').pop() || '0');
      sequence = lastSeq + 1;
    }

    return `INV-${dateStr}-${sequence.toString().padStart(3, '0')}`;
  };

  const addProduct = async (product: Omit<Product, 'id'>) => {
    try {
      const response = await productsAPI.create(product);
      const newProduct = { ...response.data, id: response.data._id };
      setProducts([...products, newProduct]);
      toast.success('Product added successfully');
    } catch (err: any) {
      console.error('Failed to add product:', err);
      toast.error(err.message || 'Failed to add product');
      throw err;
    }
  };

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    try {
      const response = await productsAPI.update(id, productData);
      const updatedProduct = { ...response.data, id: response.data._id };
      setProducts(products.map(p => p.id === id ? updatedProduct : p));
      toast.success('Product updated successfully');
    } catch (err: any) {
      console.error('Failed to update product:', err);
      toast.error(err.message || 'Failed to update product');
      throw err;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await productsAPI.delete(id);
      setProducts(products.filter(p => p.id !== id));
      toast.success('Product deleted successfully');
    } catch (err: any) {
      console.error('Failed to delete product:', err);
      toast.error(err.message || 'Failed to delete product');
      throw err;
    }
  };

  const addSale = async (saleData: Omit<Sale, 'id' | 'invoiceNumber' | 'date'>): Promise<Sale | void> => {
    try {
      const response = await salesAPI.create({
        ...saleData,
        date: new Date().toISOString()
      });
      
      const newSale = { 
        ...response.data, 
        id: response.data._id,
        date: response.data.createdAt || response.data.date 
      };
      
      setSales([newSale, ...sales]);
      
      // Refresh products to get updated stock
      await refreshProducts();
      
      toast.success('Sale recorded successfully');
      return newSale;
    } catch (err: any) {
      console.error('Failed to record sale:', err);
      toast.error(err.message || 'Failed to record sale');
      throw err;
    }
  };

  const updateStock = async (productId: string, quantity: number) => {
    try {
      const operation = quantity > 0 ? 'add' : 'subtract';
      await productsAPI.updateStock(productId, Math.abs(quantity), operation);
      
      // Update local state
      setProducts(products.map(p => 
        p.id === productId 
          ? { ...p, stock: Math.max(0, p.stock + quantity) }
          : p
      ));
    } catch (err: any) {
      console.error('Failed to update stock:', err);
      toast.error(err.message || 'Failed to update stock');
      throw err;
    }
  };

  const getLowStockProducts = () => {
    return products.filter(p => p.stock <= p.minStock);
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        sales,
        loading,
        error,
        addProduct,
        updateProduct,
        deleteProduct,
        addSale,
        getLowStockProducts,
        updateStock,
        generateInvoiceNumber,
        refreshProducts,
        refreshSales
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
