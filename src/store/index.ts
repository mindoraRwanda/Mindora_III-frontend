import { create } from "zustand";

interface AppState {
  user: { id: string; name: string; email: string } | null;
  setUser: (user: AppState["user"]) => void;
  clearUser: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
