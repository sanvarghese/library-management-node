import express from "express";
import { loginUser, registerUser } from "../../../controller/userController.js";
// import { registerUser, loginUser } from "../../../../controller/userController.js";
// import { registerUser, loginUser } from "../controllers/userController.js";

const bookRouter = express.Router();

bookRouter.post("/register", registerUser);
bookRouter.post("/login", loginUser);

export default bookRouter;
