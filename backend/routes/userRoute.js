import express from "express";
import { loginAdmin, loginUser, registerUser } from "../controllers/userController.js";

const userRouter = express.Router();

// Keep user authentication routes thin so controller logic stays in one place.
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/admin", loginAdmin);

export default userRouter;
