import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getUsersForSidebar = async (req, res) => {
    try {
      if (!req.user || !req.user._id) {
        console.error("User not authenticated");
        return res.status(401).json({ error: "Unauthorized" });
      }
  
      const loggedInUserId = req.user._id;
      console.log("Logged in user ID:", loggedInUserId);
  
      const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
      console.log("Filtered users:", filteredUsers);
  
      return res.status(200).json(filteredUsers);
      
    } catch (error) {
      console.error("Error in getUsersForSidebar:", error.message);
      return res.status(500).json({ error: "Internal server error" });
    }
  };
  
  
export const getMessages = async (req, res) => {
    try {
        const { id } = req.params;
        const loggedInUserId = req.user._id;

        console.log("Logged in user ID:", loggedInUserId);
        console.log("Other user ID:", id);

        const messages = await Message.find({
            $or: [
                { senderId: loggedInUserId, receiverId: id },
                { senderId: id, receiverId: loggedInUserId }
            ]
        })
        console.log("Messages:", messages);
        res.status(200).json(messages);

    } catch (error) {
        console.error("Error in getMessages controller", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const sendMessage = async (req, res) => {

    
    try {
        const {text, image} = req.body;
    const {id: receiverId} = req.params;
    const senderId = req.user._id;
    let imageUrl;

    if (image) {
        const uploadResponse = await cloudinary.uploader.upload(image);
        imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({    
        senderId,
        receiverId,
        text,
        image: imageUrl
    });


    const savedMessage = await newMessage.save();


    // todo: real time functionality goes here => socket.io

    res.status(200).json(newMessage);
    }
    catch (error) {
        console.error("Error in sendMessage controller", error);
        res.status(500).json({ message: 'Internal server error' });
    }

}