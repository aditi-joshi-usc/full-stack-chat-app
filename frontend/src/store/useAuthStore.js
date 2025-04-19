import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
export const useAuthStore = create((set) => ({
    authUser: null,
    isCheckingAuth: true,
    isLoggingIn: false,
    isSigningUp: false,
    isUpdatingProfile: false,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check", { withCredentials: true });
            set({ authUser: res.data});
        } catch (error) {
            console.error("Error checking authentication", error);
            set({ authUser: null });
        }
        finally {
            set({ isCheckingAuth: false });
        }
    },
    }));    