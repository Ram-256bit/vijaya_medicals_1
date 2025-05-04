
import express from "express";
import InventoryItem from "../models/InventoryItem.js";

const router = express.Router();

// Get all items
router.get("/", async (req, res) => {
  const items = await InventoryItem.find();
  res.json(items);
});

// Add new item
router.post("/", async (req, res) => {
  try {
    const item = new InventoryItem(req.body);
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: "Failed to add item" });
  }
});

// Update item
router.put("/:id", async (req, res) => {
  try {
    const updated = await InventoryItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update item" });
  }
});

// Delete item
router.delete("/:id", async (req, res) => {
  try {
    await InventoryItem.findByIdAndDelete(req.params.id);
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete item" });
  }
});

// Get expired medicines
router.get("/expired", async (req, res) => {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    try {
      const expired = await InventoryItem.find({ expiryDate: { $lt: today } });
      res.json(expired);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch expired medicines" });
    }
  });
  
export default router;
