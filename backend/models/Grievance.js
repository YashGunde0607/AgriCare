import mongoose from 'mongoose';

const GrievanceSchema = new mongoose.Schema({
  farmerName: { type: String, required: true },
  contactNumber: { type: String, required: true },
  district: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Crop Damage', 'Subsidy Delay', 'Irrigation', 'Market Price'], 
    required: true 
  },
  description: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'In Progress', 'Resolved'], 
    default: 'Pending' 
  },
  submittedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Grievance', GrievanceSchema);