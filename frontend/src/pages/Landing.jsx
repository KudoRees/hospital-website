import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Shield, Clock, Users, ArrowRight, Phone, Mail, MapPin, Bot, ChevronDown } from 'lucide-react';

const Landing = () => {
  const [aiDropdownOpen, setAiDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setAiDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-800">
      {/* Navigation Bar */}
      <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center cursor-pointer">
              <div className="bg-blue-600 p-2 rounded-lg text-white mr-3">
                <Activity size={24} />
              </div>
              <span className="font-bold text-2xl tracking-tight text-slate-900">O<span className="text-red-500">X</span>WAY</span>
            </div>
            <div className="hidden md:flex space-x-8 items-center">
              <a href="#home" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Home</a>
              <a href="#services" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Services</a>
              <Link to="/contact" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">About & Contact</Link>

              {/* AI Robots Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setAiDropdownOpen((v) => !v)}
                  className="flex items-center gap-1.5 text-slate-600 hover:text-blue-600 font-medium transition-colors focus:outline-none"
                >
                  <Bot size={17} className="text-cyan-500" />
                  AI Robots
                  <ChevronDown
                    size={15}
                    className={`transition-transform duration-200 ${aiDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Dropdown panel */}
                {aiDropdownOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-52 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-fadeIn">
                    <Link
                      to="/raya"
                      onClick={() => setAiDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shrink-0 shadow-sm">
                        <Bot size={16} className="text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">RAYA</div>
                        <div className="text-xs text-slate-400">Smart Receptionist AI</div>
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-blue-600 font-medium hover:text-blue-700 transition-colors">Staff Login</Link>
              <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full font-medium shadow-md shadow-blue-200 transition-all transform hover:-translate-y-0.5">
                Patient Portal
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden relative">
        <div className="absolute top-0 right-0 -z-10 w-[800px] h-[800px] bg-blue-50 rounded-full blur-3xl opacity-50 translate-x-1/3 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 -z-10 w-[600px] h-[600px] bg-blue-50 rounded-full blur-3xl opacity-50 -translate-x-1/3 translate-y-1/3"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 lg:pr-12 text-center lg:text-left mb-16 lg:mb-0">
            <div className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm mb-6 shadow-sm border border-blue-200">
              Modern Healthcare Management
            </div>
            <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight mb-6">
              Advanced Care,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Simplified.</span>
            </h1>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto lg:mx-0">
              Our comprehensive Hospital Management System digitizes patient records, streamlines doctor appointments, and automates billing—bringing healthcare into the future.
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-semibold shadow-lg shadow-blue-200 transition-all flex items-center justify-center group">
                Book Appointment
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/login" className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-8 py-4 rounded-full font-semibold shadow-sm transition-all flex items-center justify-center">
                System Login
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white transform lg:rotate-2 hover:rotate-0 transition-transform duration-500">
              <img src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1453&q=80" alt="Hospital Reception" className="w-full object-cover h-[500px]" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-white/50 flex items-center">
                  <div className="bg-emerald-100 text-emerald-600 p-2 rounded-lg mr-4">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">24/7 Support</h4>
                    <p className="text-sm text-slate-600">Always here when you need us.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services/Features Section */}
      <section id="services" className="py-20 bg-white border-y border-slate-100 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose O<span className="text-red-500">X</span>WAY?</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">An all-in-one platform built for speed, security, and exceptional patient care.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Shield size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Secure Records</h3>
              <p className="text-slate-600">Enterprise-grade security for patient history, lab reports, and medical billing.</p>
            </div>
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Expert Doctors</h3>
              <p className="text-slate-600">Effortlessly manage doctor schedules and patient queues in real-time.</p>
            </div>
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                <Activity size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">AI Receptionist</h3>
              <p className="text-slate-600 mb-4">Experience RAYA, our AI-powered receptionist with facial recognition and voice triage.</p>
              <Link to="/security" className="text-blue-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                Security / Face Recognition <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-slate-900 text-slate-300 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <div className="bg-blue-600 p-1.5 rounded-lg text-white mr-2">
                  <Activity size={20} />
                </div>
                <span className="font-bold text-xl text-white">O<span className="text-red-500">X</span>WAY</span>
              </div>
              <p className="text-slate-400 mb-6 max-w-md">
                Pioneering the future of hospital management. Trusted by over 500 healthcare professionals nationwide to deliver better patient outcomes.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/security" className="hover:text-blue-400 transition-colors">Security / Face Recognition</Link></li>
                <li><Link to="/raya" className="hover:text-blue-400 transition-colors">About RAYA AI</Link></li>
                <li><Link to="/register" className="hover:text-blue-400 transition-colors">Patient Portal</Link></li>
                <li><Link to="/login" className="hover:text-blue-400 transition-colors">Staff Login</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Contact Us</h4>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <MapPin size={20} className="mr-3 text-slate-400 shrink-0" />
                  <span>123 Medical Center Blvd.<br />Healthcare City, HC 12345</span>
                </li>
                <li className="flex items-center">
                  <Phone size={20} className="mr-3 text-slate-400 shrink-0" />
                  <span>(555) 123-4567</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-12 pt-8 text-sm text-center text-slate-500">
            &copy; {new Date().getFullYear()} O<span className="text-red-500">X</span>WAY. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
