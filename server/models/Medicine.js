import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  quantity: { type: Number, required: true }, // Quantity in stock
  expireDate: { type: Date, required: true },
});

const Medicine = mongoose.model("Medicine", medicineSchema);

export default Medicine;
