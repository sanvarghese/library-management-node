// import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
// import HttpError from "../middlewares/httperror.js";
import User from "../models/user.js";
import { HttpError } from "../helpers/errors/httpError.js";
import { validationResult } from "express-validator";

// Generate JWT Token
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "24h" });
};

//  Register User
export const registerUser = async (req, res, next) => {

    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(HttpError.invalidInputs())
        } else {

            const { name, email, password } = req.body;

            let user = await User.findOne({ email });

            if (user) {
                return res.status(400).json({ message: "User already exists" });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            user = new User({
                name,
                email,
                password: hashedPassword,
            });

            await user.save();

            res.status(201).json({
                name: user.name,
                userRole: user.role,
                                email: user.email,
                token: generateToken(user.id, user.role),
            });
        }

    } catch (error) {
        console.log(error, 'err')
        return next(HttpError.internalServer())

    }
};

// @desc   Login User
export const loginUser = async (req, res) => {

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(HttpError.invalidInputs())
        } else {

            const { email, password } = req.body;

            const user = await User.findOne({ email });

            if (!user) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            res.json({
                // _id: user.id,
                name: user.name,
                userRole: user.role,
                email: user.email,
                token: generateToken(user.id),
            });
        }
    } catch (error) {
        console.log(error, 'error')
        return next(HttpError.internalServer())
    }
};
