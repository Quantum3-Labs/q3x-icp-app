export interface HistoryTransaction {
  id: string;
  walletId: string;
  type: string;
  data: any;
  status: "pending" | "success" | "failed";
  txHash?: string;
  amount: string;
  recipient: string;
  createdAt: string;
  approveNumber?: number;
  signers?: string[];
}

class HistoryStorage {
  private readonly STORAGE_PREFIX = 'wallet_history_';

  // Generate wallet-specific key
  private getWalletKey(walletName: string): string {
    return `${this.STORAGE_PREFIX}${walletName}`;
  }

  // Get history for specific wallet
  getWalletHistory(walletName: string): HistoryTransaction[] {
    try {
      const key = this.getWalletKey(walletName);
      const data = localStorage.getItem(key);
      const history = data ? JSON.parse(data) : [];
      
      return history.sort((a: HistoryTransaction, b: HistoryTransaction) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      console.error('Failed to get wallet history:', error);
      return [];
    }
  }

  // Save new transaction to specific wallet
  saveTransaction(walletName: string, transaction: Omit<HistoryTransaction, 'id' | 'createdAt' | 'walletId'>): HistoryTransaction {
    const newTransaction: HistoryTransaction = {
      ...transaction,
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      walletId: walletName, // Use wallet name as ID
      createdAt: new Date().toISOString()
    };

    const key = this.getWalletKey(walletName);
    const currentHistory = this.getWalletHistory(walletName);
    
    // Add to beginning of array
    currentHistory.unshift(newTransaction);
    
    // Keep only last 100 transactions to avoid storage bloat
    const limitedHistory = currentHistory.slice(0, 100);
    
    localStorage.setItem(key, JSON.stringify(limitedHistory));
    return newTransaction;
  }

  // Update existing transaction in specific wallet
  updateTransaction(walletName: string, id: string, updates: Partial<HistoryTransaction>): boolean {
    try {
      const key = this.getWalletKey(walletName);
      const history = this.getWalletHistory(walletName);
      const index = history.findIndex(tx => tx.id === id);
      
      if (index !== -1) {
        history[index] = { ...history[index], ...updates };
        localStorage.setItem(key, JSON.stringify(history));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to update transaction:', error);
      return false;
    }
  }

  // Clear history for specific wallet
  clearWalletHistory(walletName: string): void {
    try {
      const key = this.getWalletKey(walletName);
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to clear wallet history:', error);
    }
  }

  // Get all wallet names that have history
  getAllWalletNames(): string[] {
    try {
      const keys = Object.keys(localStorage);
      return keys
        .filter(key => key.startsWith(this.STORAGE_PREFIX))
        .map(key => key.replace(this.STORAGE_PREFIX, ''));
    } catch (error) {
      console.error('Failed to get wallet names:', error);
      return [];
    }
  }

  // Clear all wallet histories (for cleanup)
  clearAllHistory(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.STORAGE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Failed to clear all history:', error);
    }
  }

  // Get storage usage info
  getStorageInfo(): { totalWallets: number; totalTransactions: number; storageSize: number } {
    try {
      const walletNames = this.getAllWalletNames();
      let totalTransactions = 0;
      let storageSize = 0;

      walletNames.forEach(walletName => {
        const history = this.getWalletHistory(walletName);
        totalTransactions += history.length;
        
        const key = this.getWalletKey(walletName);
        const data = localStorage.getItem(key);
        if (data) {
          storageSize += data.length;
        }
      });

      return {
        totalWallets: walletNames.length,
        totalTransactions,
        storageSize: Math.round(storageSize / 1024) // KB
      };
    } catch (error) {
      console.error('Failed to get storage info:', error);
      return { totalWallets: 0, totalTransactions: 0, storageSize: 0 };
    }
  }
}

export const historyStorage = new HistoryStorage();
