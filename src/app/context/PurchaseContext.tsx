import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  gstNumber: string;
  rating: number;
  totalOrders: number;
  outstandingAmount: number;
}

export interface PurchaseOrderItem {
  productId?: string;
  productName: string;
  category: string;
  brand?: string;
  size?: string;
  color?: string;
  quantity: number;
  costPrice: number;
  mrp: number;
  gst: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  date: string;
  expectedDelivery: string;
  items: PurchaseOrderItem[];
  subtotal: number;
  gstAmount: number;
  total: number;
  status: 'pending' | 'received' | 'partial' | 'cancelled';
  receivedDate?: string;
  notes?: string;
  paymentStatus: 'unpaid' | 'partial' | 'paid';
  paidAmount: number;
}

interface PurchaseContextType {
  suppliers: Supplier[];
  purchaseOrders: PurchaseOrder[];
  addSupplier: (supplier: Omit<Supplier, 'id' | 'totalOrders' | 'outstandingAmount'>) => void;
  updateSupplier: (id: string, supplier: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;
  addPurchaseOrder: (order: Omit<PurchaseOrder, 'id' | 'poNumber'>) => void;
  updatePurchaseOrder: (id: string, order: Partial<PurchaseOrder>) => void;
  markAsReceived: (id: string, receivedItems: { productId?: string; productName: string; quantity: number }[]) => void;
  generatePONumber: () => string;
  getPendingOrders: () => PurchaseOrder[];
}

const PurchaseContext = createContext<PurchaseContextType | undefined>(undefined);

const initialSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'Textile World Pvt Ltd',
    contactPerson: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    email: 'sales@textileworld.com',
    address: '123, Fashion Street, Mumbai, MH 400001',
    gstNumber: '27AAAAA0000A1Z5',
    rating: 4.5,
    totalOrders: 15,
    outstandingAmount: 45000
  },
  {
    id: '2',
    name: 'Fashion Fabrics India',
    contactPerson: 'Priya Sharma',
    phone: '+91 98765 43211',
    email: 'info@fashionfabrics.com',
    address: '456, Garment Hub, Delhi, DL 110001',
    gstNumber: '07BBBBB1111B2Z6',
    rating: 4.8,
    totalOrders: 23,
    outstandingAmount: 0
  }
];

export function PurchaseProvider({ children }: { children: ReactNode }) {
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const saved = localStorage.getItem('fashionhub-suppliers');
    return saved ? JSON.parse(saved) : initialSuppliers;
  });

  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(() => {
    const saved = localStorage.getItem('fashionhub-purchase-orders');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('fashionhub-suppliers', JSON.stringify(suppliers));
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem('fashionhub-purchase-orders', JSON.stringify(purchaseOrders));
  }, [purchaseOrders]);

  const generatePONumber = () => {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');
    const lastPO = purchaseOrders[0];
    let sequence = 1;

    if (lastPO && lastPO.poNumber.includes(dateStr)) {
      const lastSeq = parseInt(lastPO.poNumber.split('-').pop() || '0');
      sequence = lastSeq + 1;
    }

    return `PO-${dateStr}-${sequence.toString().padStart(3, '0')}`;
  };

  const addSupplier = (supplier: Omit<Supplier, 'id' | 'totalOrders' | 'outstandingAmount'>) => {
    const newSupplier = {
      ...supplier,
      id: Date.now().toString(),
      totalOrders: 0,
      outstandingAmount: 0
    };
    setSuppliers([...suppliers, newSupplier]);
  };

  const updateSupplier = (id: string, updatedSupplier: Partial<Supplier>) => {
    setSuppliers(suppliers.map(s => s.id === id ? { ...s, ...updatedSupplier } : s));
  };

  const deleteSupplier = (id: string) => {
    setSuppliers(suppliers.filter(s => s.id !== id));
  };

  const addPurchaseOrder = (order: Omit<PurchaseOrder, 'id' | 'poNumber'>) => {
    const newOrder = {
      ...order,
      id: Date.now().toString(),
      poNumber: generatePONumber()
    };
    setPurchaseOrders([newOrder, ...purchaseOrders]);

    // Update supplier stats
    const supplier = suppliers.find(s => s.id === order.supplierId);
    if (supplier) {
      updateSupplier(supplier.id, {
        totalOrders: supplier.totalOrders + 1,
        outstandingAmount: supplier.outstandingAmount + order.total
      });
    }
  };

  const updatePurchaseOrder = (id: string, updatedOrder: Partial<PurchaseOrder>) => {
    setPurchaseOrders(purchaseOrders.map(po => po.id === id ? { ...po, ...updatedOrder } : po));
  };

  const markAsReceived = (id: string, receivedItems: { productId?: string; productName: string; quantity: number }[]) => {
    const order = purchaseOrders.find(po => po.id === id);
    if (order) {
      updatePurchaseOrder(id, {
        status: 'received',
        receivedDate: new Date().toISOString()
      });
    }
  };

  const getPendingOrders = () => {
    return purchaseOrders.filter(po => po.status === 'pending' || po.status === 'partial');
  };

  return (
    <PurchaseContext.Provider
      value={{
        suppliers,
        purchaseOrders,
        addSupplier,
        updateSupplier,
        deleteSupplier,
        addPurchaseOrder,
        updatePurchaseOrder,
        markAsReceived,
        generatePONumber,
        getPendingOrders
      }}
    >
      {children}
    </PurchaseContext.Provider>
  );
}

export function usePurchase() {
  const context = useContext(PurchaseContext);
  if (context === undefined) {
    throw new Error('usePurchase must be used within a PurchaseProvider');
  }
  return context;
}
