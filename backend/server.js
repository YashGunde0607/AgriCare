import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import Farmer from './models/Farmer.js';
import Grievance from './models/Grievance.js';
import RiskAssessment from './models/RiskAssessment.js';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/Farmer';
const asyncHandler = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);

// Connect to persistent MongoDB before accepting requests.
async function startServer() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log(`MongoDB connected: ${mongoose.connection.name}`);

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Server initialization failed:', error.message);
    process.exitCode = 1;
  }
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

app.get('/api/farmers', asyncHandler(async (req, res) => {
  const farmers = await Farmer.find().sort({ createdAt: -1 });
  res.json(farmers);
}));

app.post('/api/farmers', asyncHandler(async (req, res) => {
  const farmer = await Farmer.create(req.body);
  res.status(201).json(farmer);
}));

app.get('/api/grievances', asyncHandler(async (req, res) => {
  const grievances = await Grievance.find().sort({ submittedAt: -1 });
  res.json(grievances);
}));

app.post('/api/grievances', asyncHandler(async (req, res) => {
  const newGrievance = await Grievance.create(req.body);
  res.status(201).json(newGrievance);
}));

app.get('/api/risk-assessments', asyncHandler(async (req, res) => {
  const risks = await RiskAssessment.find().sort({ assessedAt: -1 });
  res.json(risks);
}));

app.post('/api/risk-assessments', asyncHandler(async (req, res) => {
  const assessment = await RiskAssessment.create(req.body);
  res.status(201).json(assessment);
}));

app.get('/api/analytics', asyncHandler(async (req, res) => {
  const [farmerCount, grievanceCount, riskCount, grievanceStatuses, riskCategories, crops] = await Promise.all([
    Farmer.countDocuments(),
    Grievance.countDocuments(),
    RiskAssessment.countDocuments(),
    Grievance.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    RiskAssessment.aggregate([{ $group: { _id: '$riskOutput.category', count: { $sum: 1 } } }]),
    Farmer.aggregate([{ $group: { _id: '$primaryCrop', count: { $sum: 1 } } }, { $sort: { count: -1 } }])
  ]);

  res.json({ farmerCount, grievanceCount, riskCount, grievanceStatuses, riskCategories, crops });
}));

app.use((error, req, res, next) => {
  if (error.name === 'ValidationError' || error.name === 'CastError') {
    return res.status(400).json({ error: error.message });
  }
  if (error.code === 11000) {
    return res.status(409).json({ error: 'A record with that unique value already exists.' });
  }
  console.error(error);
  res.status(500).json({ error: 'Internal server error.' });
});

startServer();