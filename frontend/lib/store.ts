import { create } from 'zustand';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  walletBalance: number;
  xHandle?: string;
  isPremiumAccount?: boolean;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isLoggedIn: false,
  isLoading: false,
  setUser: (user) => set({ user, isLoggedIn: !!user }),
  setToken: (token) => {
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('token', token);
      } else {
        localStorage.removeItem('token');
      }
    }
    set({ token });
  },
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    set({ user: null, token: null, isLoggedIn: false });
  },
}));

interface WalletStore {
  balance: number;
  totalEarned: number;
  setBalance: (balance: number) => void;
  setTotalEarned: (earned: number) => void;
}

export const useWalletStore = create<WalletStore>((set) => ({
  balance: 0,
  totalEarned: 0,
  setBalance: (balance) => set({ balance }),
  setTotalEarned: (earned) => set({ totalEarned: earned }),
}));
