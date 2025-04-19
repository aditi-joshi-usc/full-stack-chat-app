import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
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
    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", data, { withCredentials: true });
            toast.success("User Registration Successful!");
            set({ authUser: res.data });
        } catch (error) {
            console.error("Error signing up", error);
        } finally {
            set({ isSigningUp: false });
        }

    }

    }));    
    