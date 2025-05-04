import mongoose from "mongoose";

const inventoryItemSchema = new mongoose.Schema({
  name: String,
  batchId: String,
  quantity: Number,
  price: Number,
  expiryDate: String
});

export default mongoose.model("InventoryItem", inventoryItemSchema);
