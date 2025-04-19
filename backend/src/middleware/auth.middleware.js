import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';


export const protectRoute = async (req, res, next) => {

    try {
        const token = req.cookies.jwt

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized - No token found!' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ message: 'Unauthorized - Invalid token!' });
        }
        const user = await User.findById(decoded.id).select('-password'); // Exclude password
        
        if (!user) {
            return res.status(404).json({ message: 'Unauthorized - User not found!' });
        }
        console.log(user);
        
        
        req.user = user; // Attach the user to the request object for later use
        res.status(200).json(user);
        next(); // Call the next middleware or route handler
    } catch (error) {
        console.error("Error in protectRoute middleware", error);
        res.status(500).json({ message: 'Internal server error' });

    }

}