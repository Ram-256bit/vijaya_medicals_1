import express from "express";
import Order from "../models/Order.js";
import Medicine from "../models/Medicine.js"; // Assuming you've created a Medicine model
import mongoose from "mongoose";

const router = express.Router();

// Create a new order
router.post("/", async (req, res) => {
  try {
    const { customer, items, subtotal, tax, total, date } = req.body;

    // Save the order
    const newOrder = new Order({
      customer,
      items,
      subtotal,
      tax,
      total,
      date
    });

    await newOrder.save();

    // Update the inventory stock based on the order
    for (let item of items) {
      const medicine = await Medicine.findById(item.id);
      if (medicine) {
        medicine.quantity -= item.quantity; // Decrease quantity based on the sale
        await medicine.save();
      }
    }

    res.status(201).json({ message: "Order placed successfully", order: newOrder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all orders (optional)
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().populate("items.id", "name price"); // Populate item info
    res.status(200).json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
