import jwt from "jsonwebtoken";
import { HttpError } from "../helpers/errors/httpError.js";
import User from "../models/user.js";
// import HttpError from "./httpError.js";

const httpError = new HttpError()


const authCheck = async (req, res, next) => {
    try {
        const token = req?.headers.authorization.split(" ")[1];
        if (!token) {

            return next(httpError.createError("Authentication failed", 403))
        } else {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

            const validUser = await User.findOne({ _id: decodedToken?.id })
            if (!validUser) {

                return next(httpError.createError("Authentication failed", 403))
            } else {
                req.userData = { userId: decodedToken?.id, userRole: decodedToken?.role }
                next()
            }
        }
    } catch (error) {

        return next(httpError.createError("Authentication failed", 403))
    }
}

export default authCheck