import orderModel from "../models/orderModel.js";

const createBooking = async (req, res) => {
  try {
    const { userId, toolId, days, totalPrice } = req.body;

    if (!toolId) {
      return res.json({ success: false, message: "Tool is required" });
    }

    const parsedDays = Number(days);
    const parsedTotalPrice = Number(totalPrice);

    if (!Number.isFinite(parsedDays) || parsedDays < 1) {
      return res.json({ success: false, message: "Days must be at least 1" });
    }

    if (!Number.isFinite(parsedTotalPrice) || parsedTotalPrice < 0) {
      return res.json({ success: false, message: "Total price must be valid" });
    }

    const booking = await orderModel.create({
      toolId,
      userId,
      days: parsedDays,
      totalPrice: parsedTotalPrice,
      status: "pending",
      date: Date.now(),
    });

    res.json({ success: true, message: "Booking created", booking });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const allOrders = async (req, res) => {
  try {
    const bookings = await orderModel.find({}).sort({ date: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const bookings = await orderModel.find({ userId }).sort({ date: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    if (!status) {
      return res.json({ success: false, message: "Status is required" });
    }

    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Booking status updated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export { createBooking, allOrders, userOrders, updateStatus };
