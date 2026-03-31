import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Calendar, PlusCircle, AlertTriangle, PhoneCall, HeartPulse, X } from 'lucide-react';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);

  if (!user) return null;

  return (
    <Layout>
      <div className="p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Welcome back!</h2>
          <p className="text-slate-500 mt-1">Here's your summary for today.</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <button 
            onClick={() => navigate('/appointments')}
            className="flex flex-col items-center justify-center p-8 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-2xl transition-colors group"
          >
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform shadow-lg">
              <PlusCircle size={32} />
            </div>
            <h3 className="text-xl font-bold text-blue-900">Book Appointment</h3>
            <p className="text-blue-600 mt-2 text-center">Schedule a visit with our specialists</p>
          </button>

          <button 
            onClick={() => setShowEmergencyModal(true)}
            className="flex flex-col items-center justify-center p-8 bg-red-50 hover:bg-red-100 border border-red-200 rounded-2xl transition-colors group relative overflow-hidden"
          >
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform shadow-lg z-10">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-xl font-bold text-red-900 z-10">Emergency</h3>
            <p className="text-red-600 mt-2 text-center z-10">Immediate assistance for critical conditions</p>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Stat Cards */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-500 font-medium">Total Appointments</h3>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Calendar size={20}/></div>
            </div>
            <p className="text-3xl font-bold text-slate-800">12</p>
            <p className="text-sm text-emerald-600 flex items-center mt-2 font-medium">
              <span className="mr-1">↑ 2</span> since yesterday
            </p>
          </div>
        </div>

        {/* Emergency Modal */}
        {showEmergencyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden relative border border-red-100">
              <div className="bg-red-600 p-6 flex flex-col items-center text-white relative">
                <button 
                  onClick={() => setShowEmergencyModal(false)}
                  className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4 relative z-10">
                  <HeartPulse size={48} className="animate-pulse" />
                </div>
                <h3 className="text-2xl font-bold">Emergency Assistance</h3>
                <p className="text-red-100 mt-2 text-center text-sm">Our emergency services are available 24/7. Don't hesitate to reach out immediately.</p>
              </div>
              <div className="p-8 space-y-6 bg-red-50">
                <a href="tel:911" className="flex items-center p-4 bg-white rounded-2xl shadow-sm border border-red-100 hover:border-red-300 transition-colors group">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-600 mr-4 group-hover:bg-red-600 group-hover:text-white transition-colors">
                    <PhoneCall size={24} />
                  </div>
                  <div>
                    <div className="text-slate-500 text-sm font-medium">National Emergency</div>
                    <div className="text-2xl font-bold text-red-600">911</div>
                  </div>
                </a>
                
                <a href="tel:+12345678900" className="flex items-center p-4 bg-white rounded-2xl shadow-sm border border-red-100 hover:border-red-300 transition-colors group">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-600 mr-4 group-hover:bg-red-600 group-hover:text-white transition-colors">
                    <AlertTriangle size={24} />
                  </div>
                  <div>
                    <div className="text-slate-500 text-sm font-medium">OXWAY Hospital Reception</div>
                    <div className="text-xl font-bold text-slate-800">+1 234 567 8900</div>
                  </div>
                </a>
              </div>
              <div className="p-6 bg-white border-t border-red-100 flex justify-center">
                <button 
                  onClick={() => {
                    setShowEmergencyModal(false);
                    navigate('/appointments', { state: { emergency: true } });
                  }}
                  className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors"
                >
                  Book Urgent Appointment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
