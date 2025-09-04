import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

const MAX_USERNAME_LENGTH = 30;
const MAX_EMAIL_LENGTH = 254;

// Password complexity regex: min 6 chars, at least 1 uppercase, 1 lowercase, 1 number, 1 special char
const passwordComplexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;

// Username regex: only letters; no spaces or special chars
const usernameRegex = /^[a-zA-Z]+$/;

// Email regex (simple but covers most cases)
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const signup = async (req, res, next) => {
    // Check content-type
    if (!req.is('application/json')) {
        return next(errorHandler(415, "Unsupported media type"));
    }

    // Trim input fields or reject if all fields missing
    const username = req.body.username?.trim();
    const email = req.body.email?.trim();
    const password = req.body.password;

    if (!username && !email && !password) {
        return next(errorHandler(400, "Required fields are missing"));
    }

    // Validate username
    if (!username) {
        return next(errorHandler(400, "Username is required"));
    }
    if (username.length > MAX_USERNAME_LENGTH) {
        return next(errorHandler(400, "Username exceeds length limit"));
    }
    if (!usernameRegex.test(username)) {
        return next(errorHandler(400, "Invalid characters in username"));
    }

    // Validate email
    if (!email) {
        return next(errorHandler(400, "Email is required"));
    }
    if (email.length > MAX_EMAIL_LENGTH) {
        return next(errorHandler(400, "Email exceeds length limit"));
    }
    if (!emailRegex.test(email)) {
        return next(errorHandler(400, "Invalid email format"));
    }

    // Validate password
    if (!password) {
        return next(errorHandler(400, "Password is required"));
    }
    if (!passwordComplexityRegex.test(password)) {
        return next(errorHandler(400, "Password does not meet complexity requirements"));
    }

    try {
        // Check if username or email already exist
        const usernameExists = await User.findOne({ username });
        if (usernameExists) {
            return next(errorHandler(409, "Username is already registered"));
        }

        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return next(errorHandler(409, "Email is already registered"));
        }

        const hashedPassword = bcryptjs.hashSync(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });

        await newUser.save();

        return res.status(201).json("User registration completed successfully");
    } catch (error) {
        return next(error);
    }
};

export const signin = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const validUser = await User.findOne({ email });
        if (!validUser) return next(errorHandler(404, "User not found!"));
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) return next(errorHandler(401, "Wrong Credentials!"));
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);

        //To remove password from the json destructure the password and restInfo from the validUser 
        const { password: pass, ...restInfo } = validUser._doc;
        res.cookie('access_token', token, { httpOnly: true }).status(200).json(restInfo);
    } catch (error) {
        next(error);
    }
}

export const google = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

            const { password: pass, ...restInfo } = user._doc;
            res.cookie('access_token', token, { httpOnly: true }).status(200).json(restInfo);
        }
        else {
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
            const newUser = new User({
                username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4),
                email: req.body.email,
                password: hashedPassword,
                avatar: req.body.photo
            })

            await newUser.save();
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);

            const { password: pass, ...restInfo } = newUser._doc;
            res.cookie('access_token', token, { httpOnly: true }).status(200).json(restInfo);
        }
    } catch (error) {
        next(error)
    }
}

export const signout = async (req, res, next) => {
    try {
        res.clearCookie('access_token');
        res.status(200).json("User has been logged out!");
    }
    catch (error) {
        next(error);
    }
}