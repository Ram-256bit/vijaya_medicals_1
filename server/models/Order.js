import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.ObjectId, ref: "Medicine", required: true }, // Reference to Medicine model
  quantity: { type: Number, required: true },
  total: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
  customer: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
  },
  items: [orderItemSchema],
  subtotal: { type: Number, required: true },
  tax: { type: Number, required: true },
  total: { type: Number, required: true },
  date: { type: Date, required: true },
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
