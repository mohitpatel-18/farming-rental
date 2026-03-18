import express from "express";
import { createBooking, allOrders, userOrders, updateStatus } from "../controllers/orderController.js";
import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/auth.js";

const orderRouter = express.Router();

orderRouter.post("/list", adminAuth, allOrders);
orderRouter.post("/status", adminAuth, updateStatus);
orderRouter.post("/place", authUser, createBooking);
orderRouter.post("/book", authUser, createBooking);
orderRouter.post("/userorders", authUser, userOrders);

export default orderRouter;
