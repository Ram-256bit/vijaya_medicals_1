import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// ====== Mongoose Schema and Model ======
const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  quantity: { type: Number, required: true },
  expireDate: { type: String, required: true } // store as YYYY-MM-DD
});

const Medicine = mongoose.model("Medicine", medicineSchema);

// ====== API Routes ======

// Get all medicines
app.get("/api/inventory", async (req, res) => {
  try {
    const medicines = await Medicine.find();
    res.json(medicines);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch medicines" });
  }
});

// Add a new medicine
app.post("/api/inventory", async (req, res) => {
  try {
    const { name, price, image, quantity, expireDate } = req.body;

    if (!name || !price || !quantity || !expireDate) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newMedicine = new Medicine({ name, price, image, quantity, expireDate });
    await newMedicine.save();
    res.status(201).json(newMedicine);
  } catch (err) {
    res.status(500).json({ error: "Failed to add medicine" });
  }
});

// Update stock (quantity) of a medicine
app.put("/api/inventory/:id", async (req, res) => {
  try {
    const { quantity } = req.body;
    if (quantity === undefined) {
      return res.status(400).json({ error: "Quantity is required" });
    }

    const updatedMedicine = await Medicine.findByIdAndUpdate(
      req.params.id,
      { $set: { quantity } },
      { new: true }
    );

    if (!updatedMedicine) return res.status(404).json({ error: "Medicine not found" });

    res.json(updatedMedicine);
  } catch (err) {
    res.status(500).json({ error: "Failed to update medicine" });
  }
});

// Delete a medicine
app.delete("/api/inventory/:id", async (req, res) => {
  try {
    const deleted = await Medicine.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Medicine not found" });
    res.json({ message: "Medicine deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete medicine" });
  }
});

// Get expired medicines
app.get("/api/inventory/expired", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const expired = await Medicine.find({ expireDate: { $lt: today } });
    res.json(expired);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch expired medicines" });
  }
});

// ====== Start Server ======
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
