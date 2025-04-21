import cloudinary from '../lib/cloudinary.js';
import { generateToken } from '../lib/utils.js';
import User  from '../models/user.model.js';
import bcrypt from 'bcryptjs';

export const signup = async(req, res) => {
    const {fullName, email, password} = req.body;
    // Validate the input data
    try {

        if (!fullName || !email || !password) {
            return res.status(400).json({ message: 'Please fill in all the required fields' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
        });

        if (newUser) {
            // generate a jwt token
            generateToken(newUser._id, res);
            // save the user to the database
            // and send the response
            await newUser.save();
            res.status(201).json({_id: newUser._id, fullName: newUser.fullName, email: newUser.email, profilePicture: newUser.profilePicture, message: 'User Registration Successful!' });
        }
    } catch (error) {
        console.error("Error in signup controller", error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: 'Please fill in all the required fields' });
        }

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        await bcrypt.compare(password, user.password).then((isMatch) => {
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid email or password' });
            } else {
                // generate a jwt token
                generateToken(user._id, res);
                res.status(200).json({ _id: user._id, fullName: user.fullName, email: user.email, profilePicture: user.profilePicture, message: 'Login Successful!' });
            }
        })
            
    } catch (error) {
        console.error("Error in login controller", error);
        res.status(500).json({ message: 'Internal server error' });
}
}

export const logout = (req, res) => {
    try{
        res.clearCookie('token', { path: '/' });
        res.status(200).json({ message: 'Logout Successful!' });
    } catch (error) {
        console.error("Error in logout controller", error);
        res.status(500).json({ message: 'Internal server error' });
    }  
     
}

export const updateProfile = async (req, res) => {
    try {
       
        const {profilePicture} = req.body;
        const userId = req.user._id; // Get the user ID from the request object
        
        if (!profilePicture) {
            return res.status(400).json({ message: 'Please provide a profile picture' });
        }

        const uploadResult = await cloudinary.uploader.upload(profilePicture)
        const updatedUser = await User.findByIdAndUpdate(userId, {
            profilePicture: uploadResult.secure_url,
        }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ _id: updatedUser._id, fullName: updatedUser.fullName, email: updatedUser.email, profilePicture: updatedUser.profilePicture, message: 'Profile updated successfully!' });


    } catch (error) {
        console.error("Error in updateProfile controller", error);
        res.status(500).json({ message: 'Internal server error' });
    }

   
}

export const checkAuth = (req, res) => {
    try {
      const { password, ...userWithoutPassword } = req.user._doc || req.user;
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error("Error in checkAuth controller", error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
