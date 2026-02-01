import { useState } from 'react';
import { usePurchase, PurchaseOrderItem } from '@/app/context/PurchaseContext';
import { useStore } from '@/app/context/StoreContext';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface CreatePurchaseOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  suggestedProduct?: {
    name: string;
    category: string;
    brand?: string;
    size?: string;
    color?: string;
    quantity: number;
  };
}

export function CreatePurchaseOrderModal({ isOpen, onClose, suggestedProduct }: CreatePurchaseOrderModalProps) {
  const { suppliers, addPurchaseOrder } = usePurchase();
  const { getLowStockProducts } = useStore();
  
  const [supplierId, setSupplierId] = useState('');
  const [expectedDelivery, setExpectedDelivery] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<PurchaseOrderItem[]>(
    suggestedProduct ? [{
      productName: suggestedProduct.name,
      category: suggestedProduct.category,
      brand: suggestedProduct.brand,
      size: suggestedProduct.size,
      color: suggestedProduct.color,
      quantity: suggestedProduct.quantity,
      costPrice: 0,
      mrp: 0,
      gst: 5
    }] : []
  );

  if (!isOpen) return null;

  const handleAddItem = () => {
    setItems([...items, {
      productName: '',
      category: '',
      brand: '',
      size: '',
      color: '',
      quantity: 1,
      costPrice: 0,
      mrp: 0,
      gst: 5
    }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleUpdateItem = (index: number, field: keyof PurchaseOrderItem, value: any) => {
    setItems(items.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!supplierId) {
      toast.error('Please select a supplier');
      return;
    }

    if (!expectedDelivery) {
      toast.error('Please select expected delivery date');
      return;
    }

    if (items.length === 0) {
      toast.error('Please add at least one item');
      return;
    }

    const invalidItems = items.filter(item => 
      !item.productName || !item.category || item.quantity <= 0 || item.costPrice <= 0
    );

    if (invalidItems.length > 0) {
      toast.error('Please fill all required fields for items');
      return;
    }

    const supplier = suppliers.find(s => s.id === supplierId);
    if (!supplier) return;

    const subtotal = items.reduce((sum, item) => sum + (item.costPrice * item.quantity), 0);
    const gstAmount = items.reduce((sum, item) => 
      sum + ((item.costPrice * item.quantity * item.gst) / 100), 0
    );
    const total = subtotal + gstAmount;

    addPurchaseOrder({
      supplierId,
      supplierName: supplier.name,
      date: new Date().toISOString(),
      expectedDelivery,
      items,
      subtotal,
      gstAmount,
      total,
      status: 'pending',
      notes,
      paymentStatus: 'unpaid',
      paidAmount: 0
    });

    toast.success('Purchase order created successfully');
    handleClose();
  };

  const handleClose = () => {
    setSupplierId('');
    setExpectedDelivery('');
    setNotes('');
    setItems([]);
    onClose();
  };

  const handleLoadLowStockItems = () => {
    const lowStock = getLowStockProducts();
    const newItems = lowStock.map(product => ({
      productName: product.name,
      category: product.category,
      brand: product.brand,
      size: product.size,
      color: product.color,
      quantity: product.minStock - product.stock,
      costPrice: product.price * 0.6, // Estimate cost price as 60% of selling price
      mrp: product.price,
      gst: 5
    }));
    setItems(newItems);
    toast.success(`Added ${newItems.length} low stock items`);
  };

  const subtotal = items.reduce((sum, item) => sum + (item.costPrice * item.quantity), 0);
  const gstAmount = items.reduce((sum, item) => 
    sum + ((item.costPrice * item.quantity * item.gst) / 100), 0
  );
  const total = subtotal + gstAmount;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-5xl w-full my-8 shadow-2xl">
        <div className="sticky top-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-2xl font-bold">Create Purchase Order</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Supplier and Delivery */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Supplier *
              </label>
              <select
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              >
                <option value="">Select Supplier</option>
                {suppliers.map(supplier => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Expected Delivery Date *
              </label>
              <input
                type="date"
                value={expectedDelivery}
                onChange={(e) => setExpectedDelivery(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
          </div>

          {/* Items Section */}
          <div className="border border-slate-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800">Order Items</h3>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleLoadLowStockItems}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm"
                >
                  Load Low Stock Items
                </button>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Item
                </button>
              </div>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {items.map((item, index) => (
                <div key={index} className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-4 border border-purple-200">
                  <div className="flex items-start justify-between mb-3">
                    <span className="font-semibold text-slate-800">Item {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        value={item.productName}
                        onChange={(e) => handleUpdateItem(index, 'productName', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Category *
                      </label>
                      <input
                        type="text"
                        value={item.category}
                        onChange={(e) => handleUpdateItem(index, 'category', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Brand
                      </label>
                      <input
                        type="text"
                        value={item.brand}
                        onChange={(e) => handleUpdateItem(index, 'brand', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Size
                      </label>
                      <input
                        type="text"
                        value={item.size}
                        onChange={(e) => handleUpdateItem(index, 'size', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Color
                      </label>
                      <input
                        type="text"
                        value={item.color}
                        onChange={(e) => handleUpdateItem(index, 'color', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Quantity *
                      </label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleUpdateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                        min="1"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Cost Price (₹) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={item.costPrice}
                        onChange={(e) => handleUpdateItem(index, 'costPrice', parseFloat(e.target.value) || 0)}
                        min="0"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        MRP (₹) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={item.mrp}
                        onChange={(e) => handleUpdateItem(index, 'mrp', parseFloat(e.target.value) || 0)}
                        min="0"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        GST (%)
                      </label>
                      <select
                        value={item.gst}
                        onChange={(e) => handleUpdateItem(index, 'gst', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="0">0%</option>
                        <option value="5">5%</option>
                        <option value="12">12%</option>
                        <option value="18">18%</option>
                        <option value="28">28%</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-3 text-right">
                    <span className="text-sm font-semibold text-slate-700">
                      Item Total: ₹{((item.costPrice * item.quantity) + ((item.costPrice * item.quantity * item.gst) / 100)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              ))}

              {items.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  No items added. Click "Add Item" or "Load Low Stock Items" to get started.
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          {items.length > 0 && (
            <div className="bg-gradient-to-br from-slate-50 to-purple-50 rounded-xl p-6 border border-purple-200">
              <h3 className="font-bold text-slate-800 mb-4">Order Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-slate-700">
                  <span>Subtotal:</span>
                  <span>₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>GST:</span>
                  <span>₹{gstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-purple-600 pt-2 border-t border-purple-300">
                  <span>Total:</span>
                  <span>₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Add any special instructions or notes..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white rounded-xl hover:shadow-xl transition-all font-semibold"
            >
              Create Purchase Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
