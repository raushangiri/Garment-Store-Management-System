import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

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
}

interface StoreContextType {
  products: Product[];
  sales: Sale[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addSale: (sale: Omit<Sale, 'id' | 'invoiceNumber'>) => void;
  getLowStockProducts: () => Product[];
  updateStock: (productId: string, quantity: number) => void;
  generateInvoiceNumber: () => string;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Sample initial data for garment store
const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Cotton T-Shirt',
    barcode: '8901234567890',
    price: 599,
    stock: 45,
    category: 'T-Shirts',
    minStock: 20,
    size: 'M',
    color: 'Navy Blue',
    brand: 'FashionHub',
    gender: 'Men',
    description: 'Comfortable cotton t-shirt with modern fit'
  },
  {
    id: '2',
    name: 'Slim Fit Denim Jeans',
    barcode: '8901234567891',
    price: 1899,
    stock: 8,
    category: 'Jeans',
    minStock: 15,
    size: '32',
    color: 'Dark Blue',
    brand: 'DenimCo',
    gender: 'Men',
    description: 'Classic slim fit denim jeans'
  },
  {
    id: '3',
    name: 'Floral Summer Dress',
    barcode: '8901234567892',
    price: 2499,
    stock: 30,
    category: 'Dresses',
    minStock: 10,
    size: 'L',
    color: 'Floral Print',
    brand: 'StyleWear',
    gender: 'Women',
    description: 'Beautiful floral print summer dress'
  },
  {
    id: '4',
    name: 'Casual Hoodie',
    barcode: '8901234567893',
    price: 1499,
    stock: 5,
    category: 'Hoodies',
    minStock: 10,
    size: 'XL',
    color: 'Grey',
    brand: 'Comfort+',
    gender: 'Unisex',
    description: 'Warm and comfortable hoodie'
  },
  {
    id: '5',
    name: 'Formal Shirt',
    barcode: '8901234567894',
    price: 1299,
    stock: 25,
    category: 'Shirts',
    minStock: 8,
    size: 'L',
    color: 'White',
    brand: 'FormalWear',
    gender: 'Men',
    description: 'Classic formal shirt for office wear'
  },
  {
    id: '6',
    name: 'Kids Cotton Shorts',
    barcode: '8901234567895',
    price: 399,
    stock: 0,
    category: 'Shorts',
    minStock: 12,
    size: '8-10Y',
    color: 'Multi',
    brand: 'KidsFun',
    gender: 'Kids',
    description: 'Comfortable cotton shorts for kids'
  },
  {
    id: '7',
    name: 'Sports Track Pants',
    barcode: '8901234567896',
    price: 999,
    stock: 35,
    category: 'Track Pants',
    minStock: 15,
    size: 'M',
    color: 'Black',
    brand: 'ActiveWear',
    gender: 'Unisex',
    description: 'Perfect for workouts and casual wear'
  },
  {
    id: '8',
    name: 'Designer Kurta',
    barcode: '8901234567897',
    price: 1799,
    stock: 18,
    category: 'Ethnic Wear',
    minStock: 10,
    size: 'M',
    color: 'Maroon',
    brand: 'EthnicStyle',
    gender: 'Women',
    description: 'Traditional designer kurta'
  }
];

const initialSales: Sale[] = [
  {
    id: '1',
    invoiceNumber: 'INV-20260201-001',
    date: new Date(2026, 0, 1, 10, 30).toISOString(),
    items: [
      { productId: '1', productName: 'Premium Cotton T-Shirt', quantity: 2, price: 599, size: 'M', color: 'Navy Blue' },
      { productId: '3', productName: 'Floral Summer Dress', quantity: 1, price: 2499, size: 'L', color: 'Floral Print' }
    ],
    subtotal: 3697,
    tax: 184.85,
    discount: 0,
    total: 3881.85,
    paymentMethod: 'UPI',
    upiTransactionId: 'UPI123456789',
    customerName: 'Priya Sharma',
    customerPhone: '+91 98765 43210'
  }
];

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('fashionhub-products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [sales, setSales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem('fashionhub-sales');
    return saved ? JSON.parse(saved) : initialSales;
  });

  useEffect(() => {
    localStorage.setItem('fashionhub-products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('fashionhub-sales', JSON.stringify(sales));
  }, [sales]);

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

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = {
      ...product,
      id: Date.now().toString()
    };
    setProducts([...products, newProduct]);
  };

  const updateProduct = (id: string, updatedProduct: Partial<Product>) => {
    setProducts(products.map(p => p.id === id ? { ...p, ...updatedProduct } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const addSale = (sale: Omit<Sale, 'id' | 'invoiceNumber'>) => {
    const newSale = {
      ...sale,
      id: Date.now().toString(),
      invoiceNumber: generateInvoiceNumber()
    };
    setSales([newSale, ...sales]);

    // Update stock for sold items
    sale.items.forEach(item => {
      updateStock(item.productId, -item.quantity);
    });
  };

  const updateStock = (productId: string, quantity: number) => {
    setProducts(products.map(p => 
      p.id === productId 
        ? { ...p, stock: Math.max(0, p.stock + quantity) }
        : p
    ));
  };

  const getLowStockProducts = () => {
    return products.filter(p => p.stock <= p.minStock);
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        sales,
        addProduct,
        updateProduct,
        deleteProduct,
        addSale,
        getLowStockProducts,
        updateStock,
        generateInvoiceNumber
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
