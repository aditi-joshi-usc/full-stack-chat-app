import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:5001";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isCheckingAuth: true,
    isLoggingIn: false,
    isSigningUp: false,
    isUpdatingProfile: false,
    onlineUsers: [],
    socket: null,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check", { withCredentials: true });
            set({ authUser: res.data});
            get().connectSocket();
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
            set({ authUser: res.data });
            toast.success("User Registration Successful!");

            get().connectSocket();
        } catch (error) {
            console.error("Error signing up", error);
        } finally {
            set({ isSigningUp: false });
        }

    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data, { withCredentials: true });
            if (res.status == 200) {    
            set({ authUser: res.data });
            toast.success("Login Successful!");
            get().connectSocket();

            }
        } catch (error) {
            console.error("Error logging in", error);
            toast.error("Invalid email or password. Please try again.");
        } finally {
            set({ isLoggingIn: false });    

        }
    }
,

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout", { withCredentials: true });
            set({ authUser: null });
            toast.success("Logged out successfully!");
            get().disconnectSocket();
        } catch (error) {
            console.error("Error logging out", error);
            toast.error("Error logging out. Please try again.");
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put("/auth/update-profile", data, { withCredentials: true });
            set({ authUser: res.data });
            toast.success("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile", error);
            toast.error(error.response.data.message || "Error updating profile. Please try again.");
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    connectSocket: () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) {
            return;
        }
        
        const socket = io(BASE_URL, { query: { userId: authUser._id } });
        socket.connect();
        set({ socket: socket });
        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
            
        })
    },

    disconnectSocket: () => {
        if (get().socket?.connected) {
            get().socket.disconnect();
        }
    }

    }));    
    