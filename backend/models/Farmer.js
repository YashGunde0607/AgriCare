import mongoose from 'mongoose';

const FarmerSchema = new mongoose.Schema({
  farmerId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  district: { type: String, required: true },
  landAreaAcres: { type: Number, required: true },
  primaryCrop: { type: String, required: true },
  irrigationType: { type: String, enum: ['Rainfed', 'Canal', 'Borewell'], default: 'Rainfed' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Farmer', FarmerSchema);