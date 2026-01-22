import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  user: {
    email: string;
    firstName: string;
    lastName: string;
    roles: string[];
  } | null;
  isAuthenticated: boolean;
  login: (token: string, user: any) => void;
  logout: () => void;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      login: (token, user) => {
        localStorage.setItem('token', token);
        set({ token, user, isAuthenticated: true });
      },
      logout: () => {
        localStorage.removeItem('token');
        set({ token: null, user: null, isAuthenticated: false });
      },
      isAdmin: () => {
        const state = get();
        return state.user?.roles.includes('Admin') ?? false;
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

