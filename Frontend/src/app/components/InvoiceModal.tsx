import { useState, useRef } from 'react';
import { useStore, Product } from '@/app/context/StoreContext';
import { X, CreditCard, Smartphone, Banknote, QrCode, Printer, CheckCircle2, Sparkles } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';
import { useAuth } from '@/app/context/AuthContext';

interface CartItem {
  product: Product;
  quantity: number;
}

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  customerName?: string;
  customerPhone?: string;
  onSuccess: () => void;
}

export function InvoiceModal({ 
  isOpen, 
  onClose, 
  cart, 
  subtotal, 
  tax, 
  discount, 
  total, 
  customerName,
  customerPhone,
  onSuccess 
}: InvoiceModalProps) {
  const { addSale, generateInvoiceNumber } = useStore();
  const { user } = useAuth();
  const [step, setStep] = useState<'invoice' | 'payment' | 'success'>('invoice');
  const [paymentMethod, setPaymentMethod] = useState<'CREDIT_CARD' | 'DEBIT_CARD' | 'UPI' | 'CASH'>('UPI');
  const [cardNumber, setCardNumber] = useState('');
  const [upiId, setUpiId] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [invoiceNumber] = useState(generateInvoiceNumber());

  if (!isOpen) return null;

  const handleProceedToPayment = () => {
    setStep('payment');
  };

  const handlePayment = async () => {
    if (paymentMethod === 'UPI' && !upiId && !showQR) {
      toast.error('Please enter UPI ID or scan QR code');
      return;
    }

    if ((paymentMethod === 'CREDIT_CARD' || paymentMethod === 'DEBIT_CARD') && cardNumber.length < 16) {
      toast.error('Please enter valid card number');
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
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
        subtotal,
        tax,
        discount,
        total,
        paymentMethod,
        cardLast4: (paymentMethod === 'CREDIT_CARD' || paymentMethod === 'DEBIT_CARD') 
          ? cardNumber.slice(-4) 
          : undefined,
        upiTransactionId: paymentMethod === 'UPI' ? `UPI${Date.now()}` : undefined,
        customerName,
        customerPhone
      };

      addSale(sale);
      setIsProcessing(false);
      setStep('success');
      
      setTimeout(() => {
        toast.success('Payment successful!');
      }, 500);
    }, 2000);
  };

  const handlePrint = () => {
    const printContent = invoiceRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '', 'height=800,width=600');
    if (!printWindow) return;

    printWindow.document.write('<html><head><title>Invoice</title>');
    printWindow.document.write('<style>');
    printWindow.document.write(`
      body { font-family: Arial, sans-serif; padding: 20px; }
      .invoice-header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #000; padding-bottom: 20px; }
      .logo { font-size: 28px; font-weight: bold; color: #8b5cf6; margin-bottom: 5px; }
      .company-name { font-size: 14px; color: #666; }
      .invoice-details { margin-bottom: 20px; }
      .invoice-details table { width: 100%; border-collapse: collapse; }
      .invoice-details td { padding: 5px 0; }
      .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
      .items-table th, .items-table td { border: 1px solid #ddd; padding: 10px; text-align: left; }
      .items-table th { background-color: #f3f4f6; font-weight: bold; }
      .totals { margin-top: 20px; text-align: right; }
      .totals table { margin-left: auto; }
      .totals td { padding: 5px 10px; }
      .grand-total { font-size: 18px; font-weight: bold; border-top: 2px solid #000; }
      .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #ddd; padding-top: 20px; }
      @media print {
        body { padding: 0; }
        button { display: none; }
      }
    `);
    printWindow.document.write('</style></head><body>');
    printWindow.document.write(printContent.innerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);

    toast.success('Printing invoice...');
  };

  const handleClose = () => {
    if (step === 'success') {
      onSuccess();
    }
    setStep('invoice');
    setPaymentMethod('UPI');
    setCardNumber('');
    setUpiId('');
    setShowQR(false);
    setIsProcessing(false);
    onClose();
  };

  const upiPaymentString = `upi://pay?pa=merchant@upi&pn=FashionHub&am=${total.toFixed(2)}&cu=INR&tn=Invoice ${invoiceNumber}`;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full my-8 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-2">
            {step === 'invoice' && <Sparkles className="w-6 h-6" />}
            {step === 'payment' && <CreditCard className="w-6 h-6" />}
            {step === 'success' && <CheckCircle2 className="w-6 h-6" />}
            <h2 className="text-2xl font-bold">
              {step === 'invoice' && 'Invoice Preview'}
              {step === 'payment' && 'Payment Method'}
              {step === 'success' && 'Payment Successful'}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {step === 'invoice' && (
            <div ref={invoiceRef}>
              {/* Invoice Header */}
              <div className="invoice-header text-center mb-8 border-b-2 border-slate-200 pb-6">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-7 h-7 text-white" />
                  </div>
                  <div className="logo text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    FashionHub
                  </div>
                </div>
                <div className="company-name text-slate-600">Fashion Store Management</div>
                <div className="text-sm text-slate-500 mt-1">123 Fashion Street, Mumbai, MH 400001</div>
                <div className="text-sm text-slate-500">Phone: +91 22 1234 5678 | Email: info@fashionhub.com</div>
                <div className="text-sm text-slate-500 mt-2">GSTIN: 27AAAAA0000A1Z5</div>
              </div>

              {/* Invoice Details */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="invoice-details">
                  <h3 className="font-bold text-slate-800 mb-2">Invoice Details</h3>
                  <table className="text-sm">
                    <tbody>
                      <tr>
                        <td className="text-slate-600 pr-4">Invoice Number:</td>
                        <td className="font-semibold text-slate-800">{invoiceNumber}</td>
                      </tr>
                      <tr>
                        <td className="text-slate-600 pr-4">Date:</td>
                        <td className="font-semibold text-slate-800">{new Date().toLocaleDateString('en-IN', { 
                          day: '2-digit', 
                          month: 'short', 
                          year: 'numeric' 
                        })}</td>
                      </tr>
                      <tr>
                        <td className="text-slate-600 pr-4">Time:</td>
                        <td className="font-semibold text-slate-800">{new Date().toLocaleTimeString('en-IN')}</td>
                      </tr>
                      <tr>
                        <td className="text-slate-600 pr-4">Cashier:</td>
                        <td className="font-semibold text-slate-800">{user?.name}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {(customerName || customerPhone) && (
                  <div className="invoice-details">
                    <h3 className="font-bold text-slate-800 mb-2">Customer Details</h3>
                    <table className="text-sm">
                      <tbody>
                        {customerName && (
                          <tr>
                            <td className="text-slate-600 pr-4">Name:</td>
                            <td className="font-semibold text-slate-800">{customerName}</td>
                          </tr>
                        )}
                        {customerPhone && (
                          <tr>
                            <td className="text-slate-600 pr-4">Phone:</td>
                            <td className="font-semibold text-slate-800">{customerPhone}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Items Table */}
              <div className="mb-6">
                <table className="items-table w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-purple-50 to-indigo-50">
                      <th className="border border-slate-300 px-4 py-3 text-left text-sm font-bold text-slate-700">#</th>
                      <th className="border border-slate-300 px-4 py-3 text-left text-sm font-bold text-slate-700">Item Description</th>
                      <th className="border border-slate-300 px-4 py-3 text-center text-sm font-bold text-slate-700">Size</th>
                      <th className="border border-slate-300 px-4 py-3 text-center text-sm font-bold text-slate-700">Qty</th>
                      <th className="border border-slate-300 px-4 py-3 text-right text-sm font-bold text-slate-700">Price</th>
                      <th className="border border-slate-300 px-4 py-3 text-right text-sm font-bold text-slate-700">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((item, index) => (
                      <tr key={item.product.id} className="hover:bg-slate-50">
                        <td className="border border-slate-300 px-4 py-3 text-sm">{index + 1}</td>
                        <td className="border border-slate-300 px-4 py-3 text-sm">
                          <div className="font-semibold text-slate-800">{item.product.name}</div>
                          <div className="text-xs text-slate-600">{item.product.color} | {item.product.brand}</div>
                        </td>
                        <td className="border border-slate-300 px-4 py-3 text-sm text-center">{item.product.size}</td>
                        <td className="border border-slate-300 px-4 py-3 text-sm text-center font-semibold">{item.quantity}</td>
                        <td className="border border-slate-300 px-4 py-3 text-sm text-right">₹{item.product.price.toLocaleString('en-IN')}</td>
                        <td className="border border-slate-300 px-4 py-3 text-sm text-right font-semibold">
                          ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="totals">
                <table className="ml-auto">
                  <tbody>
                    <tr>
                      <td className="text-slate-600 pr-8 py-2">Subtotal:</td>
                      <td className="text-right font-semibold text-slate-800">₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    </tr>
                    <tr>
                      <td className="text-slate-600 pr-8 py-2">GST (5%):</td>
                      <td className="text-right font-semibold text-slate-800">₹{tax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    </tr>
                    {discount > 0 && (
                      <tr>
                        <td className="text-slate-600 pr-8 py-2">Discount:</td>
                        <td className="text-right font-semibold text-green-600">-₹{discount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      </tr>
                    )}
                    <tr className="grand-total border-t-2 border-slate-300">
                      <td className="text-slate-800 font-bold pr-8 py-3 text-lg">Grand Total:</td>
                      <td className="text-right font-bold text-purple-600 text-xl">₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Footer */}
              <div className="footer mt-8 pt-6 border-t border-slate-200 text-center">
                <p className="text-sm text-slate-600 mb-2">Thank you for shopping with FashionHub!</p>
                <p className="text-xs text-slate-500">For any queries, please contact us at support@fashionhub.com</p>
                <p className="text-xs text-slate-500 mt-1">Terms & Conditions apply. No exchange without bill.</p>
              </div>
            </div>
          )}

          {step === 'payment' && (
            <div className="space-y-6">
              {/* Payment Methods */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-4">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button
                    onClick={() => {
                      setPaymentMethod('CREDIT_CARD');
                      setShowQR(false);
                    }}
                    className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                      paymentMethod === 'CREDIT_CARD'
                        ? 'border-purple-500 bg-purple-50 shadow-lg'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <CreditCard className={`w-8 h-8 ${
                      paymentMethod === 'CREDIT_CARD' ? 'text-purple-600' : 'text-slate-600'
                    }`} />
                    <span className={`font-medium text-sm ${
                      paymentMethod === 'CREDIT_CARD' ? 'text-purple-600' : 'text-slate-700'
                    }`}>
                      Credit Card
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setPaymentMethod('DEBIT_CARD');
                      setShowQR(false);
                    }}
                    className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                      paymentMethod === 'DEBIT_CARD'
                        ? 'border-blue-500 bg-blue-50 shadow-lg'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <CreditCard className={`w-8 h-8 ${
                      paymentMethod === 'DEBIT_CARD' ? 'text-blue-600' : 'text-slate-600'
                    }`} />
                    <span className={`font-medium text-sm ${
                      paymentMethod === 'DEBIT_CARD' ? 'text-blue-600' : 'text-slate-700'
                    }`}>
                      Debit Card
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setPaymentMethod('UPI');
                      setShowQR(false);
                    }}
                    className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                      paymentMethod === 'UPI'
                        ? 'border-indigo-500 bg-indigo-50 shadow-lg'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <Smartphone className={`w-8 h-8 ${
                      paymentMethod === 'UPI' ? 'text-indigo-600' : 'text-slate-600'
                    }`} />
                    <span className={`font-medium text-sm ${
                      paymentMethod === 'UPI' ? 'text-indigo-600' : 'text-slate-700'
                    }`}>
                      UPI
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setPaymentMethod('CASH');
                      setShowQR(false);
                    }}
                    className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                      paymentMethod === 'CASH'
                        ? 'border-green-500 bg-green-50 shadow-lg'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <Banknote className={`w-8 h-8 ${
                      paymentMethod === 'CASH' ? 'text-green-600' : 'text-slate-600'
                    }`} />
                    <span className={`font-medium text-sm ${
                      paymentMethod === 'CASH' ? 'text-green-600' : 'text-slate-700'
                    }`}>
                      Cash
                    </span>
                  </button>
                </div>
              </div>

              {/* Payment Details */}
              <div className="bg-gradient-to-br from-slate-50 to-purple-50 rounded-xl p-6 border border-purple-200">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-slate-700 font-medium">Amount to Pay</span>
                  <span className="text-3xl font-bold text-purple-600">
                    ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                {/* Card Payment */}
                {(paymentMethod === 'CREDIT_CARD' || paymentMethod === 'DEBIT_CARD') && (
                  <div className="space-y-3 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 16);
                          setCardNumber(value);
                        }}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="1234 5678 9012 3456"
                        maxLength={16}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="MM/YY"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          CVV
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="123"
                          maxLength={3}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* UPI Payment */}
                {paymentMethod === 'UPI' && (
                  <div className="mt-4 space-y-4">
                    {!showQR ? (
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          UPI ID / Mobile Number
                        </label>
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="username@upi or 9876543210"
                        />
                        <div className="flex items-center gap-2 mt-3">
                          <div className="flex-1 border-t border-slate-300"></div>
                          <span className="text-sm text-slate-500">OR</span>
                          <div className="flex-1 border-t border-slate-300"></div>
                        </div>
                        <button
                          onClick={() => setShowQR(true)}
                          className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all"
                        >
                          <QrCode className="w-5 h-5" />
                          Show QR Code to Scan
                        </button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <p className="text-sm font-medium text-slate-700 mb-4">
                          Scan QR Code to Pay
                        </p>
                        <div className="inline-block p-4 bg-white rounded-xl shadow-lg">
                          <QRCodeSVG
                            value={upiPaymentString}
                            size={200}
                            level="H"
                            includeMargin={true}
                          />
                        </div>
                        <p className="text-xs text-slate-600 mt-4">
                          Invoice: {invoiceNumber}
                        </p>
                        <button
                          onClick={() => setShowQR(false)}
                          className="mt-4 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                        >
                          Enter UPI ID instead
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Cash Payment */}
                {paymentMethod === 'CASH' && (
                  <div className="mt-4 text-center py-4">
                    <Banknote className="w-16 h-16 text-green-600 mx-auto mb-3" />
                    <p className="text-slate-700 font-medium">Cash Payment</p>
                    <p className="text-sm text-slate-600 mt-2">
                      Please collect ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })} from customer
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setStep('invoice')}
                  className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-medium"
                >
                  Back to Invoice
                </button>
                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white rounded-xl hover:shadow-xl transition-all font-semibold disabled:opacity-50"
                >
                  {isProcessing ? 'Processing...' : 'Confirm Payment'}
                </button>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold text-slate-800 mb-3">Payment Successful!</h3>
              <p className="text-slate-600 mb-2">Invoice: {invoiceNumber}</p>
              <p className="text-sm text-slate-500 mb-8">
                Payment of ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })} completed successfully
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handlePrint}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:shadow-lg transition-all font-medium"
                >
                  <Printer className="w-5 h-5" />
                  Print Invoice
                </button>
                <button
                  onClick={handleClose}
                  className="px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-medium"
                >
                  New Sale
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions for Invoice Step */}
        {step === 'invoice' && (
          <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-4 flex flex-col sm:flex-row gap-3 rounded-b-2xl">
            <button
              onClick={handlePrint}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border-2 border-purple-500 text-purple-600 rounded-xl hover:bg-purple-50 transition-all font-medium"
            >
              <Printer className="w-5 h-5" />
              Print Invoice
            </button>
            <button
              onClick={handleProceedToPayment}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white rounded-xl hover:shadow-xl transition-all font-semibold"
            >
              Proceed to Payment
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
