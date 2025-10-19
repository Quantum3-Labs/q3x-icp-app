import { useState, useEffect } from 'react';
import { historyStorage, HistoryTransaction } from '@/utils/historyStorage';

export const useTransactionHistory = (walletName: string) => {
  const [history, setHistory] = useState<HistoryTransaction[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = () => {
    if (!walletName) return;
    
    try {
      setLoading(true);
      const walletHistory = historyStorage.getWalletHistory(walletName);
      setHistory(walletHistory);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveTransaction = (transaction: Omit<HistoryTransaction, 'id' | 'createdAt' | 'walletId'>) => {
    if (!walletName) return null;
    
    try {
      const savedTx = historyStorage.saveTransaction(walletName, transaction);
      setHistory(prev => [savedTx, ...prev.slice(0, 99)]); // Keep UI in sync
      return savedTx;
    } catch (error) {
      console.error('Failed to save transaction:', error);
      return null;
    }
  };

  const updateTransaction = (id: string, updates: Partial<HistoryTransaction>) => {
    if (!walletName) return false;
    
    try {
      const success = historyStorage.updateTransaction(walletName, id, updates);
      if (success) {
        fetchHistory(); // Refresh history
      }
      return success;
    } catch (error) {
      console.error('Failed to update transaction:', error);
      return false;
    }
  };

  const clearHistory = () => {
    if (!walletName) return;
    
    try {
      historyStorage.clearWalletHistory(walletName);
      setHistory([]);
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  };

  // Refresh history when wallet changes
  useEffect(() => {
    if (walletName) {
      fetchHistory();
    } else {
      setHistory([]);
    }
  }, [walletName]);

  return {
    history,
    loading,
    fetchHistory,
    saveTransaction,
    updateTransaction,
    clearHistory
  };
};
