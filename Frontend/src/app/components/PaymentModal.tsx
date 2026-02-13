import { useState } from 'react';
import { useStore, Product } from '@/app/context/StoreContext';
import { useAuth } from '@/app/context/AuthContext';
import { X, CreditCard, Smartphone, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface CartItem {
  product: Product;
  quantity: number;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  total: number;
  onSuccess: () => void;
}

export function PaymentModal({ isOpen, onClose, cart, total, onSuccess }: PaymentModalProps) {
  const { addSale } = useStore();
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CASH'>('UPI');
  const [upiId, setUpiId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePayment = async () => {
    if (paymentMethod === 'UPI' && !upiId) {
      toast.error('Please enter UPI ID');
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(async () => {
      try {
        const sale = {
          date: new Date().toISOString(),
          items: cart.map(item => ({
            productId: item.product.id,
            productName: item.product.name,
            quantity: item.quantity,
            price: item.product.price,
            size: item.product.size,
            color: item.product.color
          })),
          subtotal: total,
          tax: 0,
          discount: 0,
          total,
          paymentMethod,
          upiTransactionId: paymentMethod === 'UPI' ? `UPI${Date.now()}` : undefined,
          salesPersonId: user?.id,
          salesPersonName: user?.name
        };

        await addSale(sale);
        setIsProcessing(false);
        setIsSuccess(true);
        
        setTimeout(() => {
          toast.success('Payment successful!');
          onSuccess();
          handleClose();
        }, 1500);
      } catch (error) {
        console.error('Payment error:', error);
        toast.error('Payment failed. Please try again.');
        setIsProcessing(false);
      }
    }, 2000);
  };

  const handleClose = () => {
    setPaymentMethod('UPI');
    setUpiId('');
    setIsProcessing(false);
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800">Payment</h2>
          {!isProcessing && !isSuccess && (
            <button
              onClick={handleClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-slate-600" />
            </button>
          )}
        </div>

        <div className="p-6">
          {isSuccess ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Payment Successful!</h3>
              <p className="text-slate-600">Transaction completed successfully</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Payment Summary */}
              <div className="bg-slate-50 rounded-lg p-4">
                <h3 className="font-semibold text-slate-800 mb-3">Order Summary</h3>
                <div className="space-y-2">
                  {cart.map(item => (
                    <div key={item.product.id} className="flex justify-between text-sm">
                      <span className="text-slate-600">
                        {item.product.name} × {item.quantity}
                      </span>
                      <span className="font-medium text-slate-800">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                  <div className="border-t border-slate-200 pt-2 mt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span className="text-slate-800">Total</span>
                      <span className="text-slate-800">₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPaymentMethod('UPI')}
                    className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                      paymentMethod === 'UPI'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <Smartphone className={`w-8 h-8 ${
                      paymentMethod === 'UPI' ? 'text-blue-600' : 'text-slate-600'
                    }`} />
                    <span className={`font-medium ${
                      paymentMethod === 'UPI' ? 'text-blue-600' : 'text-slate-700'
                    }`}>
                      UPI
                    </span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('CASH')}
                    className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                      paymentMethod === 'CASH'
                        ? 'border-green-500 bg-green-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <CreditCard className={`w-8 h-8 ${
                      paymentMethod === 'CASH' ? 'text-green-600' : 'text-slate-600'
                    }`} />
                    <span className={`font-medium ${
                      paymentMethod === 'CASH' ? 'text-green-600' : 'text-slate-700'
                    }`}>
                      Cash
                    </span>
                  </button>
                </div>
              </div>

              {/* UPI ID Input */}
              {paymentMethod === 'UPI' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    UPI ID / Mobile Number
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="username@upi or 9876543210"
                  />
                  <p className="text-xs text-slate-500 mt-2">
                    Enter UPI ID or registered mobile number
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all shadow-sm font-medium disabled:opacity-50"
                >
                  {isProcessing ? 'Processing...' : `Pay ₹${total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}