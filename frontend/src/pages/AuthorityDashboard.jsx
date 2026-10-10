import React, { useEffect, useState } from 'react';
import { fetchFarmers, fetchGrievances, fetchRiskAssessments } from '../services/api';

export default function AuthorityDashboard() {
  const [farmers, setFarmers] = useState([]);
  const [grievances, setGrievances] = useState([]);
  const [risks, setRisks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [farmerRes, grievanceRes, riskRes] = await Promise.all([
          fetchFarmers(),
          fetchGrievances(),
          fetchRiskAssessments()
        ]);
        setFarmers(farmerRes.data);
        setGrievances(grievanceRes.data);
        setRisks(riskRes.data);
      } catch (err) {
        console.error('Error loading backend data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-600 font-semibold">Loading Portal Data...</div>;

  return (
    <div className="space-y-8">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-bold text-slate-800">🏛️ Authority Monitoring & Control Panel</h2>
        <p className="text-slate-600 text-sm">Real-time risk telemetry and agricultural grievance resolution.</p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-slate-500 font-semibold text-sm">Registered Farmers</h3>
          <p className="text-4xl font-bold text-slate-800 mt-2">{farmers.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-slate-500 font-semibold text-sm">Active Grievances</h3>
          <p className="text-4xl font-bold text-amber-600 mt-2">{grievances.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-slate-500 font-semibold text-sm">High Risk Districts</h3>
          <p className="text-4xl font-bold text-rose-600 mt-2">
            {risks.filter(r => r.riskOutput?.category === 'HIGH').length}
          </p>
        </div>
      </div>

      {/* Grievances List Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-xl font-bold text-slate-800 mb-4">Grievance Overview</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-100 text-slate-700 uppercase text-xs">
              <tr>
                <th className="p-3">Farmer</th>
                <th className="p-3">District</th>
                <th className="p-3">Category</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {grievances.map((g) => (
                <tr key={g._id} className="border-b hover:bg-slate-50">
                  <td className="p-3 font-medium text-slate-900">{g.farmerName}</td>
                  <td className="p-3">{g.district}</td>
                  <td className="p-3">{g.category}</td>
                  <td className="p-3">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                      g.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' :
                      g.status === 'In Progress' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {g.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}