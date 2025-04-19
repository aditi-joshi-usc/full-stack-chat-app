import jwt from 'jsonwebtoken';


export const generateToken = (userId, res) => {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '7d', // Token expires in 7 days
    });

    res.cookie('jwt', token, {
        httpOnly: true, // Prevents client-side JavaScript from accessing the cookie, prevents XSS attacks
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict', // CSRF protection (cross-site request forgery attack)
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    }); 

    return token;
};