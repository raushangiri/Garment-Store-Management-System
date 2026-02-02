import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface DraftOrder {
  id: string;
  name: string;
  createdAt: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    size?: string;
    color?: string;
    discount: number;
  }[];
  customerName?: string;
  customerPhone?: string;
  notes?: string;
}

interface DraftContextType {
  drafts: DraftOrder[];
  addDraft: (draft: Omit<DraftOrder, 'id' | 'createdAt'>) => void;
  updateDraft: (id: string, draft: Partial<DraftOrder>) => void;
  deleteDraft: (id: string) => void;
  getDraft: (id: string) => DraftOrder | undefined;
}

const DraftContext = createContext<DraftContextType | undefined>(undefined);

export function DraftProvider({ children }: { children: ReactNode }) {
  const [drafts, setDrafts] = useState<DraftOrder[]>(() => {
    const saved = localStorage.getItem('fashionhub-drafts');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('fashionhub-drafts', JSON.stringify(drafts));
  }, [drafts]);

  const addDraft = (draft: Omit<DraftOrder, 'id' | 'createdAt'>) => {
    const newDraft: DraftOrder = {
      ...draft,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setDrafts([newDraft, ...drafts]);
  };

  const updateDraft = (id: string, updatedDraft: Partial<DraftOrder>) => {
    setDrafts(drafts.map(d => d.id === id ? { ...d, ...updatedDraft } : d));
  };

  const deleteDraft = (id: string) => {
    setDrafts(drafts.filter(d => d.id !== id));
  };

  const getDraft = (id: string) => {
    return drafts.find(d => d.id === id);
  };

  return (
    <DraftContext.Provider
      value={{
        drafts,
        addDraft,
        updateDraft,
        deleteDraft,
        getDraft
      }}
    >
      {children}
    </DraftContext.Provider>
  );
}

export function useDraft() {
  const context = useContext(DraftContext);
  if (context === undefined) {
    throw new Error('useDraft must be used within a DraftProvider');
  }
  return context;
}
