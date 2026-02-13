import { useState } from 'react';
import { useStore } from '@/app/context/StoreContext';
import { Plus, Search, Edit2, Trash2, Package, Barcode, Camera, ShoppingCart } from 'lucide-react';
import { AddProductModal } from '@/app/components/AddProductModal';
import { EditProductModal } from '@/app/components/EditProductModal';
import { BarcodeScanner } from '@/app/components/BarcodeScanner';
import { CreatePurchaseOrderModal } from '@/app/components/CreatePurchaseOrderModal';
import { toast } from 'sonner';

export function Inventory() {
  const { products, deleteProduct, updateStock } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const [placeOrderProduct, setPlaceOrderProduct] = useState<any>(null);

  const categories = ['all', ...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.barcode.includes(searchTerm);
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
      toast.success('Product deleted successfully');
    }
  };

  const handleScanComplete = (barcode: string) => {
    const product = products.find(p => p.barcode === barcode);
    if (product) {
      setEditingProduct(product.id);
      toast.success(`Product found: ${product.name}`);
    } else {
      toast.error('Product not found. Please add it manually.');
      setIsAddModalOpen(true);
    }
    setIsScannerOpen(false);
  };

  const getStockStatus = (product: typeof products[0]) => {
    if (product.stock === 0) {
      return { label: 'Out of Stock', color: 'bg-red-100 text-red-700' };
    } else if (product.stock <= product.minStock) {
      return { label: 'Low Stock', color: 'bg-orange-100 text-orange-700' };
    } else {
      return { label: 'In Stock', color: 'bg-green-100 text-green-700' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Inventory Management
          </h1>
          <p className="text-slate-600 mt-1">{products.length} garment products in stock</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsScannerOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:shadow-lg transition-all shadow-sm"
          >
            <Camera className="w-5 h-5" />
            <span className="hidden sm:inline">Scan Barcode</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white rounded-lg hover:shadow-lg transition-all shadow-sm"
          >
            <Plus className="w-5 h-5" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or barcode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product) => {
          const stockStatus = getStockStatus(product);
          return (
            <div
              key={product.id}
              className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800 text-lg">{product.name}</h3>
                  <p className="text-sm text-purple-600 mt-1">{product.brand}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingProduct(product.id)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">
                    {product.category}
                  </span>
                  <span className="text-xs px-2 py-1 bg-slate-100 text-slate-700 rounded">
                    {product.gender}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  {product.size && <span className="px-2 py-1 bg-slate-100 rounded">Size: {product.size}</span>}
                  {product.color && <span className="px-2 py-1 bg-slate-100 rounded">{product.color}</span>}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Barcode className="w-4 h-4" />
                  <span className="font-mono">{product.barcode}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Package className="w-4 h-4" />
                  <span>Stock: {product.stock} units</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}>
                    {stockStatus.label}
                  </span>
                </div>
                
                {/* Place Order Button for Low/Out of Stock */}
                {product.stock <= product.minStock && (
                  <button
                    onClick={() => setPlaceOrderProduct({
                      name: product.name,
                      category: product.category,
                      brand: product.brand,
                      size: product.size,
                      color: product.color,
                      quantity: product.minStock - product.stock + 10
                    })}
                    className="w-full mt-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Place Order</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-slate-200">
          <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 text-lg">No products found</p>
          <p className="text-slate-400 text-sm mt-2">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Modals */}
      <AddProductModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      {editingProduct && (
        <EditProductModal
          productId={editingProduct}
          onClose={() => setEditingProduct(null)}
        />
      )}
      <BarcodeScanner
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanComplete={handleScanComplete}
      />
      {placeOrderProduct && (
        <CreatePurchaseOrderModal
          isOpen={true}
          onClose={() => setPlaceOrderProduct(null)}
          suggestedProduct={placeOrderProduct}
        />
      )}
    </div>
  );
}