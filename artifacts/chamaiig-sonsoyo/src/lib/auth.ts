import { create } from "zustand";

export type Role = "student" | "teacher" | "psychologist" | "social_worker" | "admin" | null;

interface AuthState {
  id: number | null;
  role: Role;
  name: string;
  email: string;
  phone: string;
  setRole: (role: Role, name?: string) => void;
  setUserData: (role: Role, name: string, email: string, phone: string, id: number) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  id: null,
  role: null,
  name: "",
  email: "",
  phone: "",
  setRole: (role, name = "") => set({ role, name }),
  setUserData: (role, name, email, phone, id) => set({ role, name, email, phone, id }),
  logout: () => set({ id: null, role: null, name: "", email: "", phone: "" }),
}));
