import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";


export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    newMessage: "",
    selectedUser: null,
    isUserLoading: false,
    isMessagesLoading: false,
    

    getUsers: async () => {
        set({ isUserLoading: true });
        try {
            const response = await axiosInstance.get("/messages/");
            console.log("Users for sidebar:", response.data);
            
            set({ users: response.data });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch users");
        } finally {
            set({ isUserLoading: false });
        }
    },
    getMessages: async (userId) => {
        console.log("Fetching messages for user:", userId);
        set({ isMessagesLoading: true });
        try {
          const res = await axiosInstance.get(`/messages/${userId}`);
            console.log("Messages for user:", res.data);
          set({ messages: res.data });
        } catch (error) {
          toast.error(error.response.data.message);
        } finally {
          set({ isMessagesLoading: false });
        }
      },

    sendMessage: async (messageData) => {
        const {selectedUser, messages} = get();
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            set({ messages: [...messages, res.data] });
            toast.success("Message sent successfully");

        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send message");
        }
    },
    //optimize this function to only update the messages array when a new message is added
    setSelectedUser: (selectedUser) => set({ selectedUser}),
    }));