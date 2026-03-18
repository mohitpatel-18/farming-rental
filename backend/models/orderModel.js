import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  toolId: { type: String, required: true },
  userId: { type: String, required: true },
  days: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  status: { type: String, required: true, default: "pending" },
  date: { type: Number, required: true },
});

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;
