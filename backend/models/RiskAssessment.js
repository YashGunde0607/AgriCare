import mongoose from 'mongoose';

const RiskAssessmentSchema = new mongoose.Schema({
  district: { type: String, required: true },
  features: {
    rainfallDeficitPct: Number,
    tempAnomalyC: Number,
    soilMoisturePct: Number,
    cropYieldLossPct: Number,
    marketPriceDropPct: Number,
    debtToIncomeRatio: Number
  },
  riskOutput: {
    category: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], required: true },
    confidenceScore: Number,
    riskFactors: [String]
  },
  assessedAt: { type: Date, default: Date.now }
});

export default mongoose.model('RiskAssessment', RiskAssessmentSchema);