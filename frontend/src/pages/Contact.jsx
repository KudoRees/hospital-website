import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Phone, Mail, MapPin, User, Stethoscope } from 'lucide-react';
import { Link } from 'react-router-dom';

const Contact = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/doctors');
        setDoctors(data);
      } catch (error) {
        console.error('Failed to fetch doctors', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 relative">
      {/* Decorative Header */}
      <div className="bg-slate-900 text-white pt-20 pb-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-20 translate-x-1/2 -translate-y-1/2"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Contact Us</h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Get in touch with O<span className="text-red-500">X</span>WAY Hospital. Find contact details for our medical professionals and administration below.
          </p>
          <div className="mt-8 flex justify-center items-center space-x-6">
            <Link to="/" className="text-blue-400 hover:text-blue-300 font-medium">← Back to Home</Link>
            <Link to="/appointments" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full font-medium shadow-lg transition-all transform hover:-translate-y-0.5 border border-blue-500">
              Book Appointment
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20 pb-20">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 grid md:grid-cols-3 gap-8 mb-16">
          <div className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-xl">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
              <Phone size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Emergency Hub</h3>
            <p className="text-slate-600 mb-1">24/7 Helpline</p>
            <p className="text-blue-600 font-bold text-xl">(555) 911-0000</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-xl">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
              <Mail size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">General inquiries</h3>
            <p className="text-slate-600 mb-1">Email us anytime</p>
            <p className="text-blue-600 font-bold">info@medicore.com</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-xl">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4">
              <MapPin size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Main Campus</h3>
            <p className="text-slate-600 mb-1">123 Medical Center Blvd.</p>
            <p className="text-slate-600">Healthcare City, HC 12345</p>
          </div>
        </div>

        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900">Our Medical Specialists</h2>
          <p className="text-slate-500 mt-2">Direct contact information for our certified doctors.</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 bg-slate-200 rounded-full mb-4"></div>
              <div className="text-slate-400">Loading Doctor Directory...</div>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map(doc => (
              <div key={doc._id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mr-4">
                      <User size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900">Dr. {doc.firstName} {doc.lastName}</h3>
                      <div className="flex items-center text-sm font-medium text-blue-600">
                        <Stethoscope size={14} className="mr-1" />
                        {doc.specialization}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-slate-100 pt-4 mt-4 space-y-3">
                  <div className="flex items-center text-slate-600 text-sm">
                    <Phone size={16} className="mr-3 text-slate-400" />
                    <a href={`tel:${doc.contactNumber}`} className="hover:text-blue-600 transition-colors">
                      {doc.contactNumber}
                    </a>
                  </div>
                  <div className="flex items-center text-slate-600 text-sm">
                    <Mail size={16} className="mr-3 text-slate-400" />
                    <span className="truncate">{doc.user?.email || 'N/A'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Contact;
