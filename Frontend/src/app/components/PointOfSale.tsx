import { useState } from 'react';
import { useStore, Product } from '@/app/context/StoreContext';
import { useDraft } from '@/app/context/DraftContext';
import { Search, Plus, Minus, Trash2, ShoppingCart, Camera, FileText, Save, List } from 'lucide-react';
import { InvoiceModal } from '@/app/components/InvoiceModal';
import { BarcodeScanner } from '@/app/components/BarcodeScanner';
import { DraftListModal } from '@/app/components/DraftListModal';
import { toast } from 'sonner';

interface CartItem {
  product: Product;
  quantity: number;
}

export function PointOfSale() {
  const { products } = useStore();
  const { drafts, addDraft, removeDraft, deleteDraft } = useDraft();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isDraftListOpen, setIsDraftListOpen] = useState(false);

  const categories = ['all', ...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.barcode.includes(searchTerm) ||
      product.brand?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product: Product) => {
    if (product.stock <= 0) {
      toast.error('Product out of stock');
      return;
    }

    const existingItem = cart.find(item => item.product.id === product.id);
    
    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        toast.error('Not enough stock available');
        return;
      }
      setCart(cart.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
    toast.success(`${product.name} added to cart`);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.product.id === productId) {
        const newQuantity = item.quantity + delta;
        if (newQuantity <= 0) return item;
        if (newQuantity > item.product.stock) {
          toast.error('Not enough stock available');
          return item;
        }
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setCustomerName('');
    setCustomerPhone('');
  };

  const handleScanComplete = (barcode: string) => {
    const product = products.find(p => p.barcode === barcode);
    if (product) {
      addToCart(product);
    } else {
      toast.error('Product not found');
    }
    setIsScannerOpen(false);
  };

  const handleGenerateInvoice = () => {
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }
    setIsInvoiceModalOpen(true);
  };

  const handleSaveToDraft = () => {
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    const draftName = prompt('Enter a name for this draft:') || `Draft ${new Date().toLocaleString()}`;
    
    addDraft({
      name: draftName,
      items: cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        size: item.product.size,
        color: item.product.color,
        discount: 0
      })),
      customerName,
      customerPhone
    });

    toast.success('Cart saved to drafts');
    clearCart();
  };

  const handleLoadDraft = (draftItems: any[], draftCustomerName?: string, draftCustomerPhone?: string) => {
    const loadedCart: CartItem[] = [];
    
    draftItems.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        loadedCart.push({
          product,
          quantity: item.quantity
        });
      }
    });

    setCart(loadedCart);
    setCustomerName(draftCustomerName || '');
    setCustomerPhone(draftCustomerPhone || '');
    setIsDraftListOpen(false);
    toast.success('Draft loaded successfully');
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const tax = subtotal * 0.05; // 5% GST
  const discount = 0;
  const total = subtotal + tax - discount;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Point of Sale
          </h1>
          <p className="text-slate-600 mt-1">Scan or select products to create invoice</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsDraftListOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105"
          >
            <List className="w-5 h-5" />
            <span>Drafts ({drafts.length})</span>
          </button>
          <button
            onClick={() => setIsScannerOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105"
          >
            <Camera className="w-5 h-5" />
            <span>Scan Barcode</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products Section */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search and Filter */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name, brand, or barcode..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[calc(100vh-350px)] overflow-y-auto pr-2">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                disabled={product.stock <= 0}
                className={`bg-white p-4 rounded-xl border-2 text-left transition-all ${
                  product.stock <= 0
                    ? 'border-slate-200 opacity-50 cursor-not-allowed'
                    : 'border-slate-200 hover:border-purple-500 hover:shadow-lg cursor-pointer'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800 mb-1">{product.name}</h3>
                    <p className="text-xs text-slate-500">{product.brand}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    product.stock > product.minStock
                      ? 'bg-green-100 text-green-700'
                      : product.stock > 0
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {product.stock} in stock
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600 mb-2">
                  {product.size && <span className="px-2 py-1 bg-slate-100 rounded">Size: {product.size}</span>}
                  {product.color && <span className="px-2 py-1 bg-slate-100 rounded">{product.color}</span>}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xl font-bold text-purple-600">₹{product.price.toLocaleString('en-IN')}</p>
                  <span className="text-xs text-slate-500">{product.category}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Cart Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 sticky top-4">
            <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-purple-50 to-indigo-50">
              <div className="flex items-center gap-2 mb-3">
                <ShoppingCart className="w-5 h-5 text-purple-600" />
                <h2 className="font-bold text-slate-800">Shopping Cart ({cart.length})</h2>
              </div>
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Customer Info */}
            <div className="p-4 border-b border-slate-200 space-y-2">
              <input
                type="text"
                placeholder="Customer Name (Optional)"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="tel"
                placeholder="Customer Phone (Optional)"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="p-4 space-y-3 max-h-[300px] overflow-y-auto">
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-500">Cart is empty</p>
                  <p className="text-sm text-slate-400 mt-1">Add items to start</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.product.id} className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-3 border border-purple-200">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <p className="font-semibold text-slate-800 text-sm">{item.product.name}</p>
                        <p className="text-xs text-slate-600">{item.product.size} | {item.product.color}</p>
                        <p className="text-sm text-purple-600 font-medium">₹{item.product.price}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-red-600 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 bg-white rounded-lg border border-purple-300">
                        <button
                          onClick={() => updateQuantity(item.product.id, -1)}
                          className="p-2 hover:bg-purple-50 rounded-l-lg transition-colors"
                        >
                          <Minus className="w-4 h-4 text-purple-600" />
                        </button>
                        <span className="px-3 font-medium text-slate-800">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, 1)}
                          className="p-2 hover:bg-purple-50 rounded-r-lg transition-colors"
                        >
                          <Plus className="w-4 h-4 text-purple-600" />
                        </button>
                      </div>
                      <span className="font-bold text-slate-800">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-4 border-t border-slate-200 space-y-3 bg-gradient-to-br from-slate-50 to-purple-50">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>GST (5%)</span>
                    <span>₹{tax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-slate-800 pt-2 border-t border-slate-300">
                    <span>Total</span>
                    <span className="text-purple-600">₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
                <button
                  onClick={handleGenerateInvoice}
                  className="w-full py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white rounded-xl hover:shadow-xl transition-all font-semibold flex items-center justify-center gap-2"
                >
                  <FileText className="w-5 h-5" />
                  Generate Invoice
                </button>
                <button
                  onClick={handleSaveToDraft}
                  className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl hover:shadow-xl transition-all font-semibold flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Save Draft
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <InvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        cart={cart}
        subtotal={subtotal}
        tax={tax}
        discount={discount}
        total={total}
        customerName={customerName}
        customerPhone={customerPhone}
        onSuccess={clearCart}
      />

      <BarcodeScanner
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanComplete={handleScanComplete}
      />

      <DraftListModal
        isOpen={isDraftListOpen}
        onClose={() => setIsDraftListOpen(false)}
        drafts={drafts}
        onLoadDraft={handleLoadDraft}
        onDeleteDraft={(id) => {
          deleteDraft(id);
          toast.success('Draft deleted');
        }}
      />
    </div>
  );
}