import { useState } from 'react';
import { useStore } from '@/app/context/StoreContext';
import { Search, Eye, Download, FileText, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export function OrderHistory() {
  const { sales } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPayment, setFilterPayment] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const filteredSales = sales.filter(sale => {
    const matchesSearch = sale.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.customerPhone?.includes(searchTerm);
    const matchesPayment = filterPayment === 'all' || sale.paymentMethod === filterPayment;
    return matchesSearch && matchesPayment;
  });

  const selectedSale = selectedOrder ? sales.find(s => s.id === selectedOrder) : null;

  const handlePrint = (sale: typeof sales[0]) => {
    // Create a print window with invoice details
    const printWindow = window.open('', '', 'height=800,width=600');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice ${sale.invoiceNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-center; border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 20px; }
            .invoice-details { margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            th { background-color: #f3f4f6; }
            .totals { text-align: right; margin-top: 20px; }
            .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #ddd; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>FashionHub</h1>
            <p>Fashion Store Management</p>
          </div>
          <div class="invoice-details">
            <p><strong>Invoice Number:</strong> ${sale.invoiceNumber}</p>
            <p><strong>Date:</strong> ${format(new Date(sale.date), 'dd MMM yyyy HH:mm')}</p>
            ${sale.customerName ? `<p><strong>Customer:</strong> ${sale.customerName}</p>` : ''}
            ${sale.customerPhone ? `<p><strong>Phone:</strong> ${sale.customerPhone}</p>` : ''}
          </div>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${sale.items.map((item, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${item.productName}<br><small>${item.size} | ${item.color}</small></td>
                  <td>${item.quantity}</td>
                  <td>₹${item.price}</td>
                  <td>₹${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="totals">
            <p>Subtotal: ₹${sale.subtotal.toFixed(2)}</p>
            <p>GST (5%): ₹${sale.tax.toFixed(2)}</p>
            <p><strong>Total: ₹${sale.total.toFixed(2)}</strong></p>
            <p>Payment Method: ${sale.paymentMethod}</p>
          </div>
          <div class="footer">
            <p>Thank you for shopping with FashionHub!</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
          Order History
        </h1>
        <p className="text-slate-600 mt-1">{sales.length} total orders</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by invoice, customer name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <select
            value={filterPayment}
            onChange={(e) => setFilterPayment(e.target.value)}
            className="px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Payment Methods</option>
            <option value="UPI">UPI</option>
            <option value="CREDIT_CARD">Credit Card</option>
            <option value="DEBIT_CARD">Debit Card</option>
            <option value="CASH">Cash</option>
          </select>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredSales.map((sale) => (
          <div key={sale.id} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="w-5 h-5 text-purple-600" />
                  <h3 className="text-xl font-bold text-slate-800">{sale.invoiceNumber}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    sale.paymentMethod === 'UPI'
                      ? 'bg-blue-100 text-blue-700'
                      : sale.paymentMethod === 'CASH'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-purple-100 text-purple-700'
                  }`}>
                    {sale.paymentMethod}
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{format(new Date(sale.date), 'dd MMM yyyy HH:mm')}</span>
                  </div>
                  {sale.customerName && (
                    <div>
                      Customer: <span className="font-medium text-slate-800">{sale.customerName}</span>
                    </div>
                  )}
                  {sale.customerPhone && (
                    <div>
                      Phone: <span className="font-medium text-slate-800">{sale.customerPhone}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm text-slate-600">Total Amount</p>
                  <p className="text-2xl font-bold text-purple-600">
                    ₹{sale.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(sale.id)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>
                <button
                  onClick={() => handlePrint(sale)}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Print
                </button>
              </div>
            </div>

            {/* Order Items Preview */}
            <div className="mt-4 pt-4 border-t border-slate-200">
              <p className="text-sm font-medium text-slate-700 mb-2">Items ({sale.items.length}):</p>
              <div className="flex flex-wrap gap-2">
                {sale.items.map((item, index) => (
                  <span key={index} className="text-xs px-3 py-1 bg-slate-100 text-slate-700 rounded-full">
                    {item.productName} × {item.quantity}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredSales.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-slate-200">
          <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 text-lg">No orders found</p>
          <p className="text-slate-400 text-sm mt-2">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedSale && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full my-8 shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-2xl font-bold">{selectedSale.invoiceNumber}</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-600">Date & Time:</p>
                  <p className="font-semibold text-slate-800">
                    {format(new Date(selectedSale.date), 'dd MMM yyyy HH:mm')}
                  </p>
                </div>
                <div>
                  <p className="text-slate-600">Payment Method:</p>
                  <p className="font-semibold text-slate-800">{selectedSale.paymentMethod}</p>
                </div>
                {selectedSale.customerName && (
                  <div>
                    <p className="text-slate-600">Customer Name:</p>
                    <p className="font-semibold text-slate-800">{selectedSale.customerName}</p>
                  </div>
                )}
                {selectedSale.customerPhone && (
                  <div>
                    <p className="text-slate-600">Customer Phone:</p>
                    <p className="font-semibold text-slate-800">{selectedSale.customerPhone}</p>
                  </div>
                )}
              </div>

              {/* Items */}
              <div>
                <h3 className="font-bold text-slate-800 mb-3">Order Items</h3>
                <div className="space-y-2">
                  {selectedSale.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-slate-800">{item.productName}</p>
                        <p className="text-sm text-slate-600">{item.size} | {item.color}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-slate-600">Qty: {item.quantity}</p>
                        <p className="font-semibold text-slate-800">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-200">
                <div className="space-y-2">
                  <div className="flex justify-between text-slate-700">
                    <span>Subtotal:</span>
                    <span>₹{selectedSale.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>GST (5%):</span>
                    <span>₹{selectedSale.tax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-purple-600 pt-2 border-t border-purple-300">
                    <span>Total:</span>
                    <span>₹{selectedSale.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => handlePrint(selectedSale)}
                  className="flex-1 px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Print Invoice
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
