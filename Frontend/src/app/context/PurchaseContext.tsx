import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { purchaseOrdersAPI, suppliersAPI } from '@/services/api';
import { toast } from 'sonner';

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  city?: string;
  state?: string;
  pincode?: string;
  gstNumber?: string;
  gstin?: string;
  rating?: number;
  totalOrders?: number;
  outstandingAmount?: number;
  status?: 'active' | 'inactive';
}

export interface PurchaseOrderItem {
  productId?: string;
  productName: string;
  category?: string;
  brand?: string;
  size?: string;
  color?: string;
  quantity: number;
  costPrice?: number;
  price: number;
  mrp?: number;
  gst?: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber?: string;
  orderNumber?: string;
  supplierId: string;
  supplierName: string;
  date: string;
  expectedDelivery?: string;
  items: PurchaseOrderItem[];
  subtotal?: number;
  gstAmount?: number;
  total: number;
  totalAmount?: number;
  status: 'pending' | 'received' | 'partial' | 'cancelled';
  receivedDate?: string;
  notes?: string;
  paymentStatus: 'unpaid' | 'partial' | 'paid';
  paidAmount: number;
}

interface PurchaseContextType {
  suppliers: Supplier[];
  purchaseOrders: PurchaseOrder[];
  loading: boolean;
  error: string | null;
  addSupplier: (supplier: Omit<Supplier, 'id' | 'totalOrders' | 'outstandingAmount'>) => Promise<void>;
  updateSupplier: (id: string, supplier: Partial<Supplier>) => Promise<void>;
  deleteSupplier: (id: string) => Promise<void>;
  addPurchaseOrder: (order: Omit<PurchaseOrder, 'id' | 'poNumber' | 'orderNumber'>) => Promise<void>;
  updatePurchaseOrder: (id: string, order: Partial<PurchaseOrder>) => Promise<void>;
  markAsReceived: (id: string, receivedItems?: { productId?: string; productName: string; quantity: number }[]) => Promise<void>;
  generatePONumber: () => string;
  getPendingOrders: () => PurchaseOrder[];
  refreshSuppliers: () => Promise<void>;
  refreshPurchaseOrders: () => Promise<void>;
}

const PurchaseContext = createContext<PurchaseContextType | undefined>(undefined);

export function PurchaseProvider({ children }: { children: ReactNode }) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        refreshSuppliers(),
        refreshPurchaseOrders()
      ]);
    } catch (err: any) {
      console.error('Failed to load purchase data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshSuppliers = async () => {
    try {
      const response = await suppliersAPI.getAll();
      // Map _id to id and gstin to gstNumber
      const mappedSuppliers = response.data.map((s: any) => ({
        ...s,
        id: s._id || s.id,
        gstNumber: s.gstin || s.gstNumber
      }));
      setSuppliers(mappedSuppliers);
    } catch (err: any) {
      console.error('Failed to load suppliers:', err);
      toast.error('Failed to load suppliers');
      throw err;
    }
  };

  const refreshPurchaseOrders = async () => {
    try {
      const response = await purchaseOrdersAPI.getAll();
      // Map _id to id and orderNumber to poNumber
      const mappedOrders = response.data.map((po: any) => ({
        ...po,
        id: po._id || po.id,
        poNumber: po.orderNumber || po.poNumber,
        total: po.totalAmount || po.total,
        date: po.createdAt || po.date
      }));
      setPurchaseOrders(mappedOrders);
    } catch (err: any) {
      console.error('Failed to load purchase orders:', err);
      toast.error('Failed to load purchase orders');
      throw err;
    }
  };

  const generatePONumber = () => {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');
    const lastPO = purchaseOrders[0];
    let sequence = 1;

    if (lastPO && (lastPO.poNumber || lastPO.orderNumber)?.includes(dateStr)) {
      const lastSeq = parseInt((lastPO.poNumber || lastPO.orderNumber)?.split('-').pop() || '0');
      sequence = lastSeq + 1;
    }

    return `PO-${dateStr}-${sequence.toString().padStart(3, '0')}`;
  };

  const addSupplier = async (supplier: Omit<Supplier, 'id' | 'totalOrders' | 'outstandingAmount'>) => {
    try {
      const response = await suppliersAPI.create({
        ...supplier,
        gstin: supplier.gstNumber,
        status: 'active'
      });
      
      const newSupplier = {
        ...response.data,
        id: response.data._id,
        gstNumber: response.data.gstin || response.data.gstNumber,
        totalOrders: 0,
        outstandingAmount: 0
      };
      
      setSuppliers([...suppliers, newSupplier]);
      toast.success('Supplier added successfully');
    } catch (err: any) {
      console.error('Failed to add supplier:', err);
      toast.error(err.message || 'Failed to add supplier');
      throw err;
    }
  };

  const updateSupplier = async (id: string, updatedSupplier: Partial<Supplier>) => {
    try {
      const response = await suppliersAPI.update(id, {
        ...updatedSupplier,
        gstin: updatedSupplier.gstNumber
      });
      
      const updated = {
        ...response.data,
        id: response.data._id,
        gstNumber: response.data.gstin || response.data.gstNumber
      };
      
      setSuppliers(suppliers.map(s => s.id === id ? updated : s));
      toast.success('Supplier updated successfully');
    } catch (err: any) {
      console.error('Failed to update supplier:', err);
      toast.error(err.message || 'Failed to update supplier');
      throw err;
    }
  };

  const deleteSupplier = async (id: string) => {
    try {
      await suppliersAPI.delete(id);
      setSuppliers(suppliers.filter(s => s.id !== id));
      toast.success('Supplier deleted successfully');
    } catch (err: any) {
      console.error('Failed to delete supplier:', err);
      toast.error(err.message || 'Failed to delete supplier');
      throw err;
    }
  };

  const addPurchaseOrder = async (order: Omit<PurchaseOrder, 'id' | 'poNumber' | 'orderNumber'>) => {
    try {
      const response = await purchaseOrdersAPI.create({
        ...order,
        totalAmount: order.total,
        date: order.date || new Date().toISOString()
      });
      
      const newOrder = {
        ...response.data,
        id: response.data._id,
        poNumber: response.data.orderNumber,
        total: response.data.totalAmount || response.data.total,
        date: response.data.createdAt || response.data.date
      };
      
      setPurchaseOrders([newOrder, ...purchaseOrders]);
      toast.success('Purchase order created successfully');
    } catch (err: any) {
      console.error('Failed to create purchase order:', err);
      toast.error(err.message || 'Failed to create purchase order');
      throw err;
    }
  };

  const updatePurchaseOrder = async (id: string, updatedOrder: Partial<PurchaseOrder>) => {
    try {
      const response = await purchaseOrdersAPI.update(id, {
        ...updatedOrder,
        totalAmount: updatedOrder.total
      });
      
      const updated = {
        ...response.data,
        id: response.data._id,
        poNumber: response.data.orderNumber,
        total: response.data.totalAmount || response.data.total
      };
      
      setPurchaseOrders(purchaseOrders.map(po => po.id === id ? updated : po));
      toast.success('Purchase order updated successfully');
    } catch (err: any) {
      console.error('Failed to update purchase order:', err);
      toast.error(err.message || 'Failed to update purchase order');
      throw err;
    }
  };

  const markAsReceived = async (id: string, receivedItems?: { productId?: string; productName: string; quantity: number }[]) => {
    try {
      await purchaseOrdersAPI.markAsReceived(id);
      
      // Refresh purchase orders to get updated data
      await refreshPurchaseOrders();
      
      toast.success('Purchase order marked as received. Stock updated automatically.');
    } catch (err: any) {
      console.error('Failed to mark as received:', err);
      toast.error(err.message || 'Failed to mark as received');
      throw err;
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
        loading,
        error,
        addSupplier,
        updateSupplier,
        deleteSupplier,
        addPurchaseOrder,
        updatePurchaseOrder,
        markAsReceived,
        generatePONumber,
        getPendingOrders,
        refreshSuppliers,
        refreshPurchaseOrders
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
