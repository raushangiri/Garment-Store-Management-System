import { useState } from 'react';
import { usePurchase } from '@/app/context/PurchaseContext';
import { useStore } from '@/app/context/StoreContext';
import { Plus, Package, CheckCircle, Clock, XCircle, Eye, Truck } from 'lucide-react';
import { format } from 'date-fns';
import { CreatePurchaseOrderModal } from '@/app/components/CreatePurchaseOrderModal';
import { ReceiveOrderModal } from '@/app/components/ReceiveOrderModal';
import { toast } from 'sonner';

export function PurchaseOrders() {
  const { purchaseOrders, updatePurchaseOrder } = usePurchase();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [receivingOrderId, setReceivingOrderId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'received' | 'cancelled'>('all');

  const filteredOrders = purchaseOrders.filter(order => {
    if (filterStatus === 'all') return true;
    return order.status === filterStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { icon: Clock, color: 'bg-orange-100 text-orange-700', label: 'Pending' },
      received: { icon: CheckCircle, color: 'bg-green-100 text-green-700', label: 'Received' },
      partial: { icon: Package, color: 'bg-blue-100 text-blue-700', label: 'Partial' },
      cancelled: { icon: XCircle, color: 'bg-red-100 text-red-700', label: 'Cancelled' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const getPaymentBadge = (status: string) => {
    const statusConfig = {
      unpaid: { color: 'bg-red-100 text-red-700', label: 'Unpaid' },
      partial: { color: 'bg-yellow-100 text-yellow-700', label: 'Partial' },
      paid: { color: 'bg-green-100 text-green-700', label: 'Paid' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.unpaid;

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const handleCancelOrder = (id: string) => {
    if (confirm('Are you sure you want to cancel this purchase order?')) {
      updatePurchaseOrder(id, { status: 'cancelled' });
      toast.success('Purchase order cancelled');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Purchase Orders
          </h1>
          <p className="text-slate-600 mt-1">{purchaseOrders.length} total purchase orders</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white rounded-xl hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Create Purchase Order</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl p-2 shadow-sm border border-slate-200">
        <div className="flex gap-2 overflow-x-auto">
          {[
            { value: 'all', label: 'All Orders' },
            { value: 'pending', label: 'Pending' },
            { value: 'received', label: 'Received' },
            { value: 'cancelled', label: 'Cancelled' }
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilterStatus(tab.value as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                filterStatus === tab.value
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Purchase Orders List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-slate-800">{order.poNumber}</h3>
                  {getStatusBadge(order.status)}
                  {getPaymentBadge(order.paymentStatus)}
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4" />
                    <span className="font-medium">{order.supplierName}</span>
                  </div>
                  <div>
                    Order Date: {format(new Date(order.date), 'dd MMM yyyy')}
                  </div>
                  <div>
                    Expected: {format(new Date(order.expectedDelivery), 'dd MMM yyyy')}
                  </div>
                  {order.receivedDate && (
                    <div className="text-green-600">
                      Received: {format(new Date(order.receivedDate), 'dd MMM yyyy')}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                {order.status === 'pending' && (
                  <>
                    <button
                      onClick={() => setReceivingOrderId(order.id)}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span className="hidden sm:inline">Mark Received</span>
                    </button>
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-4 border border-purple-200">
              <h4 className="font-semibold text-slate-800 mb-3">Order Items</h4>
              <div className="space-y-2 mb-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <div className="flex-1">
                      <span className="font-medium text-slate-800">{item.productName}</span>
                      <span className="text-slate-600 ml-2">
                        ({item.category} • {item.size} • {item.color})
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-slate-600">Qty: {item.quantity}</span>
                      <span className="text-slate-800 font-semibold">
                        ₹{(item.costPrice * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-purple-200 pt-3 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Subtotal:</span>
                  <span className="text-slate-800">₹{order.subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">GST:</span>
                  <span className="text-slate-800">₹{order.gstAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-slate-800">Total:</span>
                  <span className="text-purple-600">₹{order.total.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600 pt-2 border-t border-purple-200">
                  <span>Payment Status:</span>
                  <span>Paid: ₹{order.paidAmount.toLocaleString('en-IN')} / ₹{order.total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {order.notes && (
              <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-700">
                  <span className="font-semibold">Notes:</span> {order.notes}
                </p>
              </div>
            )}
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-slate-200">
            <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">No purchase orders found</p>
            <p className="text-slate-400 text-sm mt-2">
              {filterStatus === 'all' 
                ? 'Create your first purchase order to get started' 
                : `No ${filterStatus} orders at the moment`}
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      <CreatePurchaseOrderModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {receivingOrderId && (
        <ReceiveOrderModal
          orderId={receivingOrderId}
          onClose={() => setReceivingOrderId(null)}
        />
      )}
    </div>
  );
}
