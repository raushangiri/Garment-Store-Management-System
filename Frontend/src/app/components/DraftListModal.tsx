import { useState } from 'react';
import { DraftOrder } from '@/app/context/DraftContext';
import { X, FileText, Trash2, ShoppingCart, Eye } from 'lucide-react';
import { format } from 'date-fns';

interface DraftListModalProps {
  isOpen: boolean;
  onClose: () => void;
  drafts: DraftOrder[];
  onLoadDraft: (items: any[], customerName?: string, customerPhone?: string) => void;
  onDeleteDraft: (id: string) => void;
}

export function DraftListModal({ isOpen, onClose, drafts, onLoadDraft, onDeleteDraft }: DraftListModalProps) {
  const [selectedDraftId, setSelectedDraftId] = useState<string | null>(null);

  if (!isOpen) return null;

  const selectedDraft = selectedDraftId ? drafts.find(d => d.id === selectedDraftId) : null;

  const handleLoadDraft = (draft: DraftOrder) => {
    onLoadDraft(draft.items, draft.customerName, draft.customerPhone);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full my-8 shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Draft Orders ({drafts.length})</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {drafts.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-lg">No draft orders saved</p>
              <p className="text-slate-400 text-sm mt-2">
                Save items from cart to create draft orders
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {drafts.map((draft) => {
                const subtotal = draft.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                const tax = subtotal * 0.05;
                const total = subtotal + tax;

                return (
                  <div key={draft.id} className="bg-white rounded-xl p-6 shadow-sm border-2 border-slate-200 hover:border-blue-400 transition-all">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-800 mb-1">{draft.name}</h3>
                        <p className="text-sm text-slate-600">
                          Created: {format(new Date(draft.createdAt), 'dd MMM yyyy HH:mm')}
                        </p>
                        {draft.customerName && (
                          <p className="text-sm text-slate-600 mt-1">
                            Customer: <span className="font-medium">{draft.customerName}</span>
                            {draft.customerPhone && <span> • {draft.customerPhone}</span>}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-600">Total Amount</p>
                        <p className="text-2xl font-bold text-blue-600">
                          ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>

                    {/* Items Preview */}
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 mb-4 border border-blue-200">
                      <p className="text-sm font-semibold text-slate-700 mb-2">
                        Items ({draft.items.length}):
                      </p>
                      <div className="space-y-2">
                        {draft.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center text-sm">
                            <div className="flex-1">
                              <span className="font-medium text-slate-800">{item.productName}</span>
                              <span className="text-slate-600 ml-2">
                                {item.size && `${item.size}`}
                                {item.size && item.color && ' | '}
                                {item.color && `${item.color}`}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-slate-600">Qty: {item.quantity}</span>
                              <span className="font-semibold text-slate-800 ml-3">
                                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => setSelectedDraftId(draft.id)}
                        className="flex-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                      <button
                        onClick={() => handleLoadDraft(draft)}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white rounded-lg hover:shadow-lg transition-all font-semibold flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Load & Generate Invoice
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this draft?')) {
                            onDeleteDraft(draft.id);
                          }
                        }}
                        className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Draft Detail Modal */}
        {selectedDraft && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-2xl w-full my-8 shadow-2xl">
              <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-4 flex items-center justify-between rounded-t-2xl">
                <h2 className="text-2xl font-bold">{selectedDraft.name}</h2>
                <button
                  onClick={() => setSelectedDraftId(null)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>

              <div className="p-6 space-y-4">
                {/* Draft Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-600">Created Date:</p>
                    <p className="font-semibold text-slate-800">
                      {format(new Date(selectedDraft.createdAt), 'dd MMM yyyy HH:mm')}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-600">Total Items:</p>
                    <p className="font-semibold text-slate-800">{selectedDraft.items.length}</p>
                  </div>
                  {selectedDraft.customerName && (
                    <div>
                      <p className="text-slate-600">Customer Name:</p>
                      <p className="font-semibold text-slate-800">{selectedDraft.customerName}</p>
                    </div>
                  )}
                  {selectedDraft.customerPhone && (
                    <div>
                      <p className="text-slate-600">Customer Phone:</p>
                      <p className="font-semibold text-slate-800">{selectedDraft.customerPhone}</p>
                    </div>
                  )}
                </div>

                {/* Items */}
                <div>
                  <h3 className="font-bold text-slate-800 mb-3">Draft Items</h3>
                  <div className="space-y-2">
                    {selectedDraft.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                        <div>
                          <p className="font-semibold text-slate-800">{item.productName}</p>
                          <p className="text-sm text-slate-600">
                            {item.size && `${item.size}`}
                            {item.size && item.color && ' | '}
                            {item.color && `${item.color}`}
                          </p>
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
                      <span>
                        ₹{selectedDraft.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-700">
                      <span>GST (5%):</span>
                      <span>
                        ₹{(selectedDraft.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 0.05).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-purple-600 pt-2 border-t border-purple-300">
                      <span>Total:</span>
                      <span>
                        ₹{(selectedDraft.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 1.05).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedDraft.notes && (
                  <div>
                    <h3 className="font-bold text-slate-800 mb-2">Notes</h3>
                    <p className="text-slate-600 bg-slate-50 p-3 rounded-lg">{selectedDraft.notes}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      handleLoadDraft(selectedDraft);
                      setSelectedDraftId(null);
                    }}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white rounded-xl hover:shadow-xl transition-all font-semibold flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Load & Generate Invoice
                  </button>
                  <button
                    onClick={() => setSelectedDraftId(null)}
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
    </div>
  );
}
