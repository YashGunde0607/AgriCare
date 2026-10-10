import 'dotenv/config';
import mongoose from 'mongoose';
import Farmer from './models/Farmer.js';
import Grievance from './models/Grievance.js';
import RiskAssessment from './models/RiskAssessment.js';

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/Farmer';

const sampleFarmers = [
  { farmerId: "F101", name: "Ramesh Patel", district: "Nagpur", landAreaAcres: 4.5, primaryCrop: "Cotton", irrigationType: "Rainfed" },
  { farmerId: "F102", name: "Suresh Kumar", district: "Wardha", landAreaAcres: 6.0, primaryCrop: "Soybean", irrigationType: "Canal" },
  { farmerId: "F103", name: "Anita Devi", district: "Amravati", landAreaAcres: 3.2, primaryCrop: "Wheat", irrigationType: "Borewell" }
];

const sampleGrievances = [
  { farmerName: "Ramesh Patel", contactNumber: "9876543210", district: "Nagpur", category: "Crop Damage", description: "Unseasonal rainfall damaged 70% of standing cotton crop.", status: "Pending" },
  { farmerName: "Suresh Kumar", contactNumber: "9123456789", district: "Wardha", category: "Subsidy Delay", description: "Delay in receiving seed distribution subsidy for Kharif season.", status: "In Progress" },
  { farmerName: "Anita Devi", contactNumber: "9988776655", district: "Amravati", category: "Irrigation", description: "Canal water supply disruption near Village Plot 12.", status: "Resolved" }
];

const sampleRiskAssessments = [
  {
    district: "Nagpur",
    features: { rainfallDeficitPct: 42.5, tempAnomalyC: 2.1, soilMoisturePct: 18.0, cropYieldLossPct: 35.0, marketPriceDropPct: 15.0, debtToIncomeRatio: 1.8 },
    riskOutput: { category: "HIGH", confidenceScore: 0.88, riskFactors: ["Severe Rainfall Deficit", "High Debt Ratio"] }
  },
  {
    district: "Wardha",
    features: { rainfallDeficitPct: 20.0, tempAnomalyC: 1.0, soilMoisturePct: 35.0, cropYieldLossPct: 15.0, marketPriceDropPct: 5.0, debtToIncomeRatio: 1.1 },
    riskOutput: { category: "MEDIUM", confidenceScore: 0.72, riskFactors: ["Moderate Temperature Anomaly"] }
  },
  {
    district: "Amravati",
    features: { rainfallDeficitPct: 5.0, tempAnomalyC: 0.2, soilMoisturePct: 65.0, cropYieldLossPct: 2.0, marketPriceDropPct: 0.0, debtToIncomeRatio: 0.6 },
    riskOutput: { category: "LOW", confidenceScore: 0.94, riskFactors: ["Stable Environmental Conditions"] }
  }
];

async function runSeed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log(`Connected to MongoDB: ${mongoose.connection.name}`);

    if (!(await Farmer.exists({}))) await Farmer.insertMany(sampleFarmers);
    if (!(await Grievance.exists({}))) await Grievance.insertMany(sampleGrievances);
    if (!(await RiskAssessment.exists({}))) await RiskAssessment.insertMany(sampleRiskAssessments);

    const farmerCount = await Farmer.countDocuments();
    const grievanceCount = await Grievance.countDocuments();
    const riskCount = await RiskAssessment.countDocuments();

    console.log("--------------------------------------------------");
    console.log(`✅ SEED SUCCESSFUL (existing records preserved)`);
    console.log(`📊 Farmers Seeded: ${farmerCount}`);
    console.log(`📋 Grievances Seeded: ${grievanceCount}`);
    console.log(`🎯 Risk Assessments Seeded: ${riskCount}`);
    console.log("--------------------------------------------------");
  } catch (error) {
    console.error("❌ Seeding Error:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

runSeed();