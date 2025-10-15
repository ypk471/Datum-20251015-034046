import { create } from 'zustand';
import { api } from '@/lib/api-client';
import type { Document } from '@shared/types';
import { toast } from 'sonner';
type DocumentState = {
  documents: Document[];
  isLoading: boolean;
  error: string | null;
  fetchDocuments: () => Promise<void>;
  addDocument: (newDocument: Omit<Document, 'id'>) => Promise<Document | undefined>;
  updateDocument: (id: string, updatedDocument: Omit<Document, 'id'>) => Promise<Document | undefined>;
  deleteDocument: (id: string) => Promise<void>;
};
export const useDocumentsStore = create<DocumentState>((set, get) => ({
  documents: [],
  isLoading: true,
  error: null,
  fetchDocuments: async () => {
    set({ isLoading: true, error: null });
    try {
      const documents = await api<Document[]>('/api/documents');
      set({ documents: [...documents].sort((a, b) => a.endDate - b.endDate), isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch documents';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
    }
  },
  addDocument: async (newDocument) => {
    try {
      const createdDocument = await api<Document>('/api/documents', {
        method: 'POST',
        body: JSON.stringify(newDocument),
      });
      set((state) => ({
        documents: [...state.documents, createdDocument].sort((a, b) => a.endDate - b.endDate),
      }));
      toast.success('Document added successfully!');
      return createdDocument;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add document';
      toast.error(errorMessage);
      return undefined;
    }
  },
  updateDocument: async (id, updatedDocumentData) => {
    try {
      const updatedDocument = await api<Document>(`/api/documents/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedDocumentData),
      });
      set((state) => ({
        documents: state.documents.map((doc) => (doc.id === id ? updatedDocument : doc)).sort((a, b) => a.endDate - b.endDate),
      }));
      toast.success('Document updated successfully!');
      return updatedDocument;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update document';
      toast.error(errorMessage);
      return undefined;
    }
  },
  deleteDocument: async (id: string) => {
    const originalDocuments = get().documents;
    set((state) => ({
      documents: state.documents.filter((doc) => doc.id !== id),
    }));
    try {
      await api(`/api/documents/${id}`, { method: 'DELETE' });
      toast.success('Document deleted.');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete document';
      toast.error(errorMessage);
      set({ documents: originalDocuments });
    }
  },
}));