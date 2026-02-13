import { useState } from 'react';
import { usePurchase } from '@/app/context/PurchaseContext';
import { useStore } from '@/app/context/StoreContext';
import { X, CheckCircle, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface ReceiveOrderModalProps {
  orderId: string;
  onClose: () => void;
}

export function ReceiveOrderModal({ orderId, onClose }: ReceiveOrderModalProps) {
  const { purchaseOrders, markAsReceived } = usePurchase();
  const { products, addProduct, updateProduct } = useStore();
  const order = purchaseOrders.find(po => po.id === orderId);

  const [receivedQuantities, setReceivedQuantities] = useState<{ [key: number]: number }>(
    order ? Object.fromEntries(order.items.map((item, index) => [index, item.quantity])) : {}
  );

  if (!order) {
    onClose();
    return null;
  }

  const handleQuantityChange = (index: number, quantity: number) => {
    setReceivedQuantities({
      ...receivedQuantities,
      [index]: Math.max(0, Math.min(quantity, order.items[index].quantity))
    });
  };

  const handleReceive = () => {
    // Update inventory for each item
    order.items.forEach((item, index) => {
      const receivedQty = receivedQuantities[index] || 0;
      
      if (receivedQty > 0) {
        // Try to find existing product by name, size, and color
        const existingProduct = products.find(p => 
          p.name === item.productName &&
          p.size === item.size &&
          p.color === item.color
        );

        if (existingProduct) {
          // Update existing product stock
          updateProduct(existingProduct.id, {
            stock: existingProduct.stock + receivedQty,
            price: item.mrp
          });
        } else {
          // Create new product
          addProduct({
            name: item.productName,
            barcode: `${Date.now()}-${index}`, // Generate temporary barcode
            price: item.mrp,
            stock: receivedQty,
            category: item.category,
            minStock: 10,
            brand: item.brand,
            size: item.size,
            color: item.color,
            gender: 'Unisex',
            description: `Added from PO ${order.poNumber}`
          });
        }
      }
    });

    // Mark order as received
    const receivedItems = order.items.map((item, index) => ({
      productName: item.productName,
      quantity: receivedQuantities[index] || 0
    }));

    markAsReceived(orderId, receivedItems);

    toast.success('Purchase order received and inventory updated');
    onClose();
  };

  const totalOrdered = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalReceived = Object.values(receivedQuantities).reduce((sum, qty) => sum + qty, 0);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full my-8 shadow-2xl">
        <div className="sticky top-0 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6" />
            <div>
              <h2 className="text-2xl font-bold">Receive Purchase Order</h2>
              <p className="text-sm text-white/90">{order.poNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Info */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-600">Supplier:</span>
                <span className="ml-2 font-semibold text-slate-800">{order.supplierName}</span>
              </div>
              <div>
                <span className="text-slate-600">Order Date:</span>
                <span className="ml-2 font-semibold text-slate-800">
                  {new Date(order.date).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-slate-600">Expected:</span>
                <span className="ml-2 font-semibold text-slate-800">
                  {new Date(order.expectedDelivery).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-slate-600">Total Amount:</span>
                <span className="ml-2 font-semibold text-green-600">
                  ₹{order.total.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Received Items */}
          <div>
            <h3 className="font-bold text-slate-800 mb-4">Confirm Received Quantities</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {order.items.map((item, index) => (
                <div key={index} className="bg-white border border-slate-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-800">{item.productName}</h4>
                      <p className="text-sm text-slate-600">
                        {item.category} • {item.brand} • {item.size} • {item.color}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 items-center">
                    <div>
                      <span className="text-sm text-slate-600">Ordered:</span>
                      <span className="ml-2 font-semibold text-slate-800">{item.quantity}</span>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Received Quantity
                      </label>
                      <input
                        type="number"
                        value={receivedQuantities[index] || 0}
                        onChange={(e) => handleQuantityChange(index, parseInt(e.target.value) || 0)}
                        min="0"
                        max={item.quantity}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    <div>
                      <span className="text-sm text-slate-600">Cost per unit:</span>
                      <span className="ml-2 font-semibold text-slate-800">
                        ₹{item.costPrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-200 flex justify-between items-center">
                    <span className="text-sm text-slate-600">
                      Receiving: {receivedQuantities[index] || 0} / {item.quantity} units
                    </span>
                    <span className="font-semibold text-slate-800">
                      ₹{((receivedQuantities[index] || 0) * item.costPrice).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gradient-to-br from-slate-50 to-green-50 rounded-xl p-6 border border-green-200">
            <h3 className="font-bold text-slate-800 mb-4">Receive Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-slate-700">
                <span>Total Items Ordered:</span>
                <span className="font-semibold">{totalOrdered} units</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Total Items Receiving:</span>
                <span className="font-semibold">{totalReceived} units</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-green-600 pt-2 border-t border-green-200">
                <span>Status:</span>
                <span>{totalReceived === totalOrdered ? 'Complete' : 'Partial'}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleReceive}
              disabled={totalReceived === 0}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-xl transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Confirm & Update Inventory
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
