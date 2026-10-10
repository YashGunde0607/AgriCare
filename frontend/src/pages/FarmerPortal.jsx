import React, { useState } from 'react';
import { createGrievance } from '../services/api';

export default function FarmerPortal() {
  const [formData, setFormData] = useState({
    farmerName: '',
    contactNumber: '',
    district: '',
    category: 'Crop Damage',
    description: ''
  });
  const [statusMsg, setStatusMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createGrievance(formData);
      setStatusMsg('✅ Grievance submitted successfully to local backend!');
      setFormData({ farmerName: '', contactNumber: '', district: '', category: 'Crop Damage', description: '' });
    } catch (err) {
      setStatusMsg('❌ Error submitting grievance.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
      <div className="mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-emerald-800">🌾 Farmer Support Portal</h2>
        <p className="text-slate-600 text-sm">Submit agricultural grievances and track crop assistance requests.</p>
      </div>

      {statusMsg && (
        <div className="mb-6 p-4 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
          {statusMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Farmer Name</label>
            <input
              type="text"
              required
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              value={formData.farmerName}
              onChange={(e) => setFormData({ ...formData, farmerName: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Contact Number</label>
            <input
              type="text"
              required
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              value={formData.contactNumber}
              onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">District</label>
            <input
              type="text"
              required
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              value={formData.district}
              onChange={(e) => setFormData({ ...formData, district: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Grievance Category</label>
            <select
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="Crop Damage">Crop Damage</option>
              <option value="Subsidy Delay">Subsidy Delay</option>
              <option value="Irrigation">Irrigation Disruption</option>
              <option value="Market Price">Market Price Drop</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Issue Description</label>
          <textarea
            rows="4"
            required
            className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-lg transition shadow-sm"
        >
          Submit Grievance
        </button>
      </form>
    </div>
  );
}