import { create } from "zustand";

export type Role = "student" | "teacher" | "psychologist" | "social_worker" | "admin" | null;

interface AuthState {
  role: Role;
  name: string;
  setRole: (role: Role, name?: string) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  role: null,
  name: "",
  setRole: (role, name = "") => set({ role, name }),
  logout: () => set({ role: null, name: "" }),
}));
