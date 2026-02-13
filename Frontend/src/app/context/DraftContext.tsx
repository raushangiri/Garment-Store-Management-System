import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { draftsAPI } from '@/services/api';
import { toast } from 'sonner';

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
  loading: boolean;
  error: string | null;
  addDraft: (draft: Omit<DraftOrder, 'id' | 'createdAt'>) => Promise<void>;
  updateDraft: (id: string, draft: Partial<DraftOrder>) => Promise<void>;
  deleteDraft: (id: string) => Promise<void>;
  getDraft: (id: string) => DraftOrder | undefined;
  refreshDrafts: () => Promise<void>;
}

const DraftContext = createContext<DraftContextType | undefined>(undefined);

export function DraftProvider({ children }: { children: ReactNode }) {
  const [drafts, setDrafts] = useState<DraftOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load drafts on mount
  useEffect(() => {
    refreshDrafts();
  }, []);

  const refreshDrafts = async () => {
    try {
      setLoading(true);
      const response = await draftsAPI.getAll();
      // Map _id to id and createdAt
      const mappedDrafts = response.data.map((d: any) => ({
        ...d,
        id: d._id || d.id,
        createdAt: d.createdAt || new Date().toISOString()
      }));
      setDrafts(mappedDrafts);
    } catch (err: any) {
      console.error('Failed to load drafts:', err);
      setError(err.message);
      toast.error('Failed to load drafts');
    } finally {
      setLoading(false);
    }
  };

  const addDraft = async (draft: Omit<DraftOrder, 'id' | 'createdAt'>) => {
    try {
      const response = await draftsAPI.create(draft);
      const newDraft = {
        ...response.data,
        id: response.data._id,
        createdAt: response.data.createdAt || new Date().toISOString()
      };
      setDrafts([newDraft, ...drafts]);
      toast.success('Draft saved successfully');
    } catch (err: any) {
      console.error('Failed to save draft:', err);
      toast.error(err.message || 'Failed to save draft');
      throw err;
    }
  };

  const updateDraft = async (id: string, updatedDraft: Partial<DraftOrder>) => {
    try {
      const response = await draftsAPI.update(id, updatedDraft);
      const updated = {
        ...response.data,
        id: response.data._id
      };
      setDrafts(drafts.map(d => d.id === id ? updated : d));
      toast.success('Draft updated successfully');
    } catch (err: any) {
      console.error('Failed to update draft:', err);
      toast.error(err.message || 'Failed to update draft');
      throw err;
    }
  };

  const deleteDraft = async (id: string) => {
    try {
      await draftsAPI.delete(id);
      setDrafts(drafts.filter(d => d.id !== id));
      toast.success('Draft deleted successfully');
    } catch (err: any) {
      console.error('Failed to delete draft:', err);
      toast.error(err.message || 'Failed to delete draft');
      throw err;
    }
  };

  const getDraft = (id: string) => {
    return drafts.find(d => d.id === id);
  };

  return (
    <DraftContext.Provider
      value={{
        drafts,
        loading,
        error,
        addDraft,
        updateDraft,
        deleteDraft,
        getDraft,
        refreshDrafts
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
