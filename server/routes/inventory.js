import express from "express";
import Medicine from "../models/Medicine.js"; // Assuming you have a Medicine model now

const router = express.Router();

// Get all medicines in inventory
router.get("/", async (req, res) => {
  try {
    const medicines = await Medicine.find();
    res.json(medicines);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch medicines" });
  }
});

// Add new medicine to inventory
router.post("/", async (req, res) => {
  try {
    const { name, price, image, quantity, expireDate } = req.body;

    // Validate data
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

// Update medicine stock (for inventory adjustments)
router.put("/:id", async (req, res) => {
  try {
    const { quantity } = req.body;
    if (quantity !== undefined) {
      const updatedMedicine = await Medicine.findByIdAndUpdate(
        req.params.id,
        { $set: { quantity } },
        { new: true }
      );
      res.json(updatedMedicine);
    } else {
      res.status(400).json({ error: "Quantity is required to update stock" });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to update medicine" });
  }
});

// Delete medicine from inventory
router.delete("/:id", async (req, res) => {
  try {
    await Medicine.findByIdAndDelete(req.params.id);
    res.json({ message: "Medicine deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete medicine" });
  }
});

// Get expired medicines (based on expireDate field)
router.get("/expired", async (req, res) => {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  try {
    const expiredMedicines = await Medicine.find({ expireDate: { $lt: today } });
    res.json(expiredMedicines);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch expired medicines" });
  }
});

export default router;
