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

// ====== Mongoose Schemas and Models ======
const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, required: false },
  image: { type: String },
  quantity: { type: Number, required: true },
  expireDate: { type: String, required: true } // store as YYYY-MM-DD
});
const Medicine = mongoose.model("Medicine", medicineSchema);

const orderSchema = new mongoose.Schema({
  customer: {
    name: { type: String, required: true },
    phone: { type: String }
  },
  items: [
    {
      _id: String,
      name: String,
      price: Number,
      quantity: Number,
      total: Number
    }
  ],
  subtotal: Number,
  tax: Number,
  total: Number,
  date: { type: Date, default: Date.now }
});
const Order = mongoose.model("Order", orderSchema);

// ====== API Routes ======

// --- Medicines Inventory ---
app.get("/api/inventory", async (req, res) => {
  try {
    const medicines = await Medicine.find();
    res.json(medicines);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch medicines" });
  }
});

app.post("/api/inventory", async (req, res) => {
  try {
    const { name, price, image, discount, quantity, expireDate } = req.body;
    // if (!discount) {
    //   discount = 0;
    // }
    if (!name || !price || !quantity || !expireDate) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newMedicine = new Medicine({ name, price, discount, image, quantity, expireDate });
    await newMedicine.save();
    res.status(201).json(newMedicine);
  } catch (err) {
    res.status(500).json({ error: `Failed to add medicine\n${err}` });
  }
});

app.put("/api/inventory/:id", async (req, res) => {
  try {
    const updateFields = {};

    if (req.body.quantity !== undefined) updateFields.quantity = req.body.quantity;
    if (req.body.discount !== undefined) updateFields.discount = req.body.discount;

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ error: "No valid fields provided for update" });
    }

    const updatedMedicine = await Medicine.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedMedicine) return res.status(404).json({ error: "Medicine not found" });

    res.json(updatedMedicine);
  } catch (err) {
    res.status(500).json({ error: "Failed to update medicine" });
  }
});

app.delete("/api/inventory/:id", async (req, res) => {
  try {
    const deleted = await Medicine.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Medicine not found" });
    res.json({ message: "Medicine deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete medicine" });
  }
});

app.get("/api/inventory/expired", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const expired = await Medicine.find({ expireDate: { $lt: today } });
    res.json(expired);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch expired medicines" });
  }
});

// --- Orders ---
app.post("/api/orders", async (req, res) => {
  try {
    const orderData = req.body;
    const order = new Order(orderData);
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    console.error("Failed to save order:", err);
    res.status(500).json({ error: "Failed to create order" });
  }
});

app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ date: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

app.get("/api/dashboard", async (req, res) => {
  try {
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    // Get total number of medicines with discounts (sum of quantities where discount > 0)
    const discountedMeds = await Medicine.find({ discount: { $gt: 0 } });
    const totalDiscounts = discountedMeds.reduce((sum, med) => sum + med.quantity, 0);

    // Get total number of expired medicines (sum of quantities where expireDate < today)
    const expiredMeds = await Medicine.find({
      expireDate: { $lt: today.toISOString().split("T")[0] }
    });
    const totalExpired = expiredMeds.reduce((sum, med) => sum + med.quantity, 0);

    // Count refunded orders (e.g., total ≤ 0)
    const totalRefunded = await Order.countDocuments({ total: { $lte: 0 } });

    // Get medicines expiring in the next 30 days
    const expiringSoon = await Medicine.find({
      expireDate: {
        $gte: today.toISOString().split("T")[0],
        $lte: thirtyDaysFromNow.toISOString().split("T")[0]
      }
    }).select("name _id");

    res.json({
      totalDiscounts,
      totalExpired,
      totalRefunded,
      expiringMedicines: expiringSoon.map(med => ({
        name: med.name,
        batchId: med._id
      }))
    });
  } catch (err) {
    console.error("Dashboard fetch error:", err);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
});

// ====== Start Server ======
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
