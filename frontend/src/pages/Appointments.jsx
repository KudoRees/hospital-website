import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Layout from '../components/Layout';
import axios from 'axios';
import { Calendar, Clock, User, FileText, Plus } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Appointments = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Booking Form State
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [formData, setFormData] = useState({
    doctor: '',
    date: '',
    timeSlot: '',
    symptoms: ''
  });
  const [bookingError, setBookingError] = useState('');

  const fetchAppointments = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get('http://localhost:5000/api/appointments', config);
      setAppointments(data);
    } catch (error) {
      console.error('Failed to fetch appointments', error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/doctors');
      setDoctors(data);
    } catch (error) {
      console.error('Failed to fetch doctors', error);
    }
  };

  const fetchPatients = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get('http://localhost:5000/api/patients', config);
      setPatients(data);
    } catch (error) {
      console.error('Failed to fetch patients', error);
    }
  };

  useEffect(() => {
    if (user) {
      Promise.all([fetchAppointments(), fetchDoctors(), fetchPatients()]).then(() => {
        setLoading(false);
        if (location.state?.emergency) {
          setShowBookingForm(true);
          setFormData(prev => ({ ...prev, symptoms: '[URGENT EMERGENCY] ' }));
        }
      });
    }
  }, [user, location.state]);

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    setBookingError('');
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      
      let patientId;
      if (user.role === 'patient') {
        const patientRecord = patients.find(p => (p.user && p.user._id === user._id) || (p.user && p.user.email === user.email));
        if (patientRecord) {
          patientId = patientRecord._id;
        } else {
          setBookingError("Patient profile not found. Please register as a patient via the registration flow first.");
          return;
        }
      } else {
        setBookingError("Only patients can book appointments via this form right now.");
        return;
      }

      await axios.post('http://localhost:5000/api/appointments', {
        ...formData,
        patient: patientId
      }, config);
      
      setShowBookingForm(false);
      setFormData({ doctor: '', date: '', timeSlot: '', symptoms: '' });
      fetchAppointments();
    } catch (error) {
      setBookingError(error.response?.data?.message || 'Failed to book appointment');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-8 flex items-center justify-center min-h-[50vh]">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 bg-slate-200 rounded-full mb-4"></div>
            <div className="text-slate-400">Loading Appointments...</div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Appointments</h2>
            <p className="text-slate-500 mt-1">Manage your medical appointments.</p>
          </div>
          {user.role === 'patient' && (
            <button 
              onClick={() => setShowBookingForm(!showBookingForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm flex items-center transition-colors"
            >
              <Plus size={20} className="mr-2" />
              {showBookingForm ? 'Cancel Booking' : 'Book Appointment'}
            </button>
          )}
        </div>

        {showBookingForm && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-8 max-w-2xl animate-fade-in">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Book a Session</h3>
            {bookingError && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100">{bookingError}</div>}
            
            <form onSubmit={handleBookAppointment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Select Doctor</label>
                <select 
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  value={formData.doctor} 
                  onChange={(e) => setFormData({...formData, doctor: e.target.value})}
                >
                  <option value="">-- Choose a Doctor --</option>
                  {doctors.map(doc => (
                    <option key={doc._id} value={doc._id}>
                      Dr. {doc.firstName} {doc.lastName} ({doc.specialization})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                  <input 
                    type="date" required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Time Slot</label>
                  <input 
                    type="time" required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    value={formData.timeSlot}
                    onChange={(e) => setFormData({...formData, timeSlot: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Symptoms or Reason</label>
                <textarea 
                  required rows="3"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  placeholder="Describe your symptoms briefly..."
                  value={formData.symptoms}
                  onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
                ></textarea>
              </div>

              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md transition-colors">
                Confirm Booking
              </button>
            </form>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {appointments.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No appointments found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="py-4 px-6 font-medium text-slate-600 whitespace-nowrap">Patient</th>
                    <th className="py-4 px-6 font-medium text-slate-600 whitespace-nowrap">Doctor</th>
                    <th className="py-4 px-6 font-medium text-slate-600 whitespace-nowrap">Date & Time</th>
                    <th className="py-4 px-6 font-medium text-slate-600">Symptoms</th>
                    <th className="py-4 px-6 font-medium text-slate-600">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {appointments.map(apt => (
                    <tr key={apt._id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center text-sm font-medium text-slate-900">
                          <User size={16} className="text-slate-400 mr-2" />
                          {apt.patient ? `${apt.patient.firstName || ''} ${apt.patient.lastName || ''}` : 'Unknown Patient'}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-slate-600">
                        {apt.doctor ? `Dr. ${apt.doctor.firstName || ''} ${apt.doctor.lastName || ''}` : 'Unassigned'}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col text-sm">
                          <span className="flex items-center text-slate-800 font-medium whitespace-nowrap">
                            <Calendar size={14} className="mr-1.5 text-blue-500" />
                            {new Date(apt.date).toLocaleDateString()}
                          </span>
                          <span className="flex items-center text-slate-500 mt-1 whitespace-nowrap">
                            <Clock size={14} className="mr-1.5 text-orange-400" />
                            {apt.timeSlot}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-slate-600">
                        <div className="flex items-start max-w-xs truncate">
                          <FileText size={16} className="text-slate-400 mr-2 shrink-0 mt-0.5" />
                          <span className="truncate" title={apt.symptoms}>{apt.symptoms || 'None'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize whitespace-nowrap ${
                          apt.status === 'scheduled' ? 'bg-blue-50 text-blue-700' :
                          apt.status === 'completed' ? 'bg-emerald-50 text-emerald-700' :
                          'bg-amber-50 text-amber-700'
                        }`}>
                          {apt.status || 'scheduled'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Appointments;
