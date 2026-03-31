import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity, Scan, Mic, FileText, MessageSquare, Shield, Zap,
  ChevronDown, ArrowRight, Bot, Brain, Lock, Waves, ClipboardList,
  Bell, Download, Star
} from 'lucide-react';

// --- Sub-components ---

const GlowOrb = ({ color, size, position }) => (
  <div
    className="absolute rounded-full blur-3xl opacity-20 pointer-events-none"
    style={{ background: color, width: size, height: size, ...position }}
  />
);

const FeatureCard = ({ icon: Icon, title, description, gradient, delay }) => (
  <div
    className="group relative bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm
                hover:bg-white/10 hover:border-white/20 hover:shadow-2xl transition-all duration-500
                hover:-translate-y-2 cursor-default"
    style={{ animationDelay: delay }}
  >
    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-5 shadow-lg`}>
      <Icon size={26} className="text-white" />
    </div>
    <h3 className="text-white font-bold text-lg mb-3">{title}</h3>
    <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
    <div className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
  </div>
);

const TimelineStep = ({ number, title, description, isLast }) => (
  <div className="flex gap-6">
    <div className="flex flex-col items-center">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-cyan-500/30 shrink-0">
        {number}
      </div>
      {!isLast && <div className="w-0.5 flex-1 bg-gradient-to-b from-cyan-500/50 to-transparent mt-2" />}
    </div>
    <div className="pb-8">
      <h4 className="text-white font-semibold mb-1">{title}</h4>
      <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
    </div>
  </div>
);

const StatBadge = ({ value, label, color }) => (
  <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-center backdrop-blur-sm">
    <div className={`text-3xl font-extrabold bg-gradient-to-r ${color} bg-clip-text text-transparent mb-1`}>{value}</div>
    <div className="text-slate-400 text-sm">{label}</div>
  </div>
);

// --- Main Page ---

const RayaPage = () => {
  const [activeTab, setActiveTab] = useState('security');

  const tabs = [
    { id: 'security', label: 'Security Gate', icon: Shield },
    { id: 'triage', label: 'AI Triage', icon: Brain },
    { id: 'token', label: 'Token & PDF', icon: FileText },
    { id: 'whatsapp', label: 'WhatsApp', icon: Bell },
  ];

  const tabContent = {
    security: {
      title: 'RAYA Security Gate',
      points: [
        'Automatic face scan using face-api.js via live webcam feed',
        'Returning patients are greeted by name with Hindi text-to-speech',
        'New faces trigger Hindi voice-based self-registration — no forms needed',
        'Face descriptor (128-float vector) and photo stored securely in MongoDB',
        'Euclidean distance matching with a 0.55 threshold for accuracy',
      ],
    },
    triage: {
      title: 'AI Voice Triage (Sarvam AI)',
      points: [
        'Patient verbally describes their problem in Hindi after identity check',
        'Sarvam AI (sarvam-m) generates 5 personalised clinical follow-up questions',
        'RAYA speaks each question and captures the spoken answer via Web Speech API',
        'All answers compiled and sent to Sarvam AI for a professional clinical summary',
        'Department & priority triage: GENERAL / CARDIOLOGY / ORTHOPEDICS / DENTAL',
      ],
    },
    token: {
      title: 'Smart Triage Token & PDF Receipt',
      points: [
        'Token format: DEPT-NNN (e.g., CARD-001, GENE-003)',
        'Daily sequential counter resets at midnight per department',
        'PDF receipt includes triage bar, patient details, and clinical summary',
        'Colour-coded priority: GREEN (stable) / YELLOW (urgent) / RED (critical)',
        'Generated server-side via pdfkit — available for instant download',
      ],
    },
    whatsapp: {
      title: 'WhatsApp Notification (Twilio)',
      points: [
        'Automatic WhatsApp message sent to the patient\'s emergency contact',
        'Message includes token number, assigned department, and priority level',
        'Powered by Twilio WhatsApp API for reliable delivery',
        'No action needed from staff — fully automated on token generation',
        'Works alongside PDF receipt for a complete notification system',
      ],
    },
  };

  const features = [
    {
      icon: Scan,
      title: 'Facial Recognition',
      description: 'Browser-based face detection using TinyFaceDetector, FaceLandmark68Net, and FaceRecognitionNet models from face-api.js.',
      gradient: 'from-violet-500 to-purple-600',
      delay: '0ms',
    },
    {
      icon: Mic,
      title: 'Hindi Voice Interface',
      description: 'Full voice interaction in Hindi — RAYA speaks questions and listens to answers. No keyboard required at any step.',
      gradient: 'from-cyan-500 to-blue-600',
      delay: '50ms',
    },
    {
      icon: Brain,
      title: 'Sarvam AI Engine',
      description: 'Intelligent clinical question generation and professional medical summary production via the sarvam-m language model.',
      gradient: 'from-rose-500 to-pink-600',
      delay: '100ms',
    },
    {
      icon: ClipboardList,
      title: 'Smart Triage Token',
      description: 'Department sub-tokens (GENE-001, CARD-001) with daily counters and colour-coded priority levels.',
      gradient: 'from-amber-500 to-orange-600',
      delay: '150ms',
    },
    {
      icon: Download,
      title: 'Instant PDF Receipts',
      description: 'Server-side PDF generation with full clinical summary, triage bar, and patient details via pdfkit.',
      gradient: 'from-emerald-500 to-teal-600',
      delay: '200ms',
    },
    {
      icon: Bell,
      title: 'WhatsApp Alerts',
      description: 'Emergency contact notified automatically via Twilio WhatsApp with token and priority info.',
      gradient: 'from-indigo-500 to-blue-700',
      delay: '250ms',
    },
  ];

  const steps = [
    { title: 'Navigate to Security Page', description: 'Go to http://localhost:5173 and click "Security / Face Recognition" from the main menu.' },
    { title: 'Camera Permission', description: 'Allow webcam access. RAYA loads the AI models in the background.' },
    { title: 'Face Recognition', description: 'Returning patients are greeted by name. New patients are prompted to speak their name for real-time registration.' },
    { title: 'Voice Triage', description: 'Answer RAYA\'s 5 AI-generated clinical follow-up questions verbally in Hindi.' },
    { title: 'Token Generation', description: 'RAYA produces a clinical summary and assigns you a triage token with department and priority classification.' },
    { title: 'Download Receipt', description: 'You are redirected to the Receipt page. Download your PDF or view your token instantly.', isLast: true },
  ];

  const active = tabContent[activeTab];

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans overflow-x-hidden">
      {/* Ambient background orbs */}
      <GlowOrb color="radial-gradient(circle, #6366f1, transparent)" size="700px" position={{ top: '-200px', left: '-200px' }} />
      <GlowOrb color="radial-gradient(circle, #06b6d4, transparent)" size="600px" position={{ top: '40%', right: '-150px' }} />
      <GlowOrb color="radial-gradient(circle, #ec4899, transparent)" size="500px" position={{ bottom: '10%', left: '20%' }} />

      {/* --- NAV --- */}
      <nav className="fixed w-full z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center cursor-pointer group">
              <div className="bg-blue-600 p-2 rounded-lg text-white mr-3 group-hover:bg-blue-500 transition-colors">
                <Activity size={22} />
              </div>
              <span className="font-bold text-2xl tracking-tight text-white">O<span className="text-red-500">X</span>WAY</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-slate-400 hover:text-white text-sm font-medium transition-colors">← Back to Home</Link>
              <Link to="/login" className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-2 rounded-full font-medium transition-colors">
                Staff Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* --- HERO --- */}
      <section className="relative pt-40 pb-24 px-4">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-semibold mb-8">
            <Bot size={16} />
            AI Robots — OXWAY Smart Receptionist
          </div>
          <h1 className="text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
            Meet{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-600 bg-clip-text text-transparent">
              RAYA
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed mb-4">
            Your hospital's AI-powered Smart Receptionist. RAYA combines <strong className="text-white">facial recognition</strong>,{' '}
            <strong className="text-white">Hindi voice triage</strong>, and <strong className="text-white">Sarvam AI</strong> to create a fully
            touchless, intelligent patient intake experience.
          </p>
          <p className="text-slate-500 text-sm mb-12">
            Powered by face-api.js · Web Speech API · Sarvam AI · Node.js · MongoDB · Twilio
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/security"
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-8 py-4 rounded-full font-semibold shadow-xl shadow-cyan-500/30 transition-all hover:-translate-y-0.5"
            >
              Launch RAYA <ArrowRight size={18} />
            </Link>
            <a
              href="#features"
              className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-4 rounded-full font-semibold transition-all"
            >
              Explore Features <ChevronDown size={18} />
            </a>
          </div>
        </div>

        {/* Animated RAYA Badge */}
        <div className="relative z-10 mt-20 flex justify-center">
          <div className="relative w-40 h-40">
            {/* Ping rings */}
            <span className="absolute inset-0 rounded-full bg-cyan-500/20 animate-ping" />
            <span className="absolute inset-4 rounded-full bg-cyan-500/15 animate-ping" style={{ animationDelay: '0.3s' }} />
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center shadow-2xl shadow-cyan-500/50">
              <div className="text-center">
                <Bot size={40} className="text-white mx-auto mb-1" />
                <span className="text-white font-black text-lg tracking-wider">RAYA</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- STATS --- */}
      <section className="relative z-10 py-12 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatBadge value="0s" label="Registration Time (returning)" color="from-cyan-400 to-blue-500" />
          <StatBadge value="5" label="AI Clinical Questions" color="from-violet-400 to-purple-500" />
          <StatBadge value="4" label="Triage Departments" color="from-rose-400 to-pink-500" />
          <StatBadge value="100%" label="Voice-based (no keyboard)" color="from-emerald-400 to-teal-500" />
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section id="features" className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-extrabold mb-4">Core Capabilities</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Every component of RAYA is engineered for speed, accuracy, and accessibility in a real hospital environment.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* --- DEEP DIVE TABS --- */}
      <section className="relative z-10 py-20 px-4 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-extrabold mb-4">How RAYA Works</h2>
            <p className="text-slate-400">Deep dive into each part of the RAYA system.</p>
          </div>
          {/* Tab Bar */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activeTab === id
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30'
                    : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>
          {/* Tab Content */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
            <h3 className="text-2xl font-bold mb-6 text-cyan-400">{active.title}</h3>
            <ul className="space-y-4">
              {active.points.map((point, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-cyan-400" />
                  </div>
                  <span className="text-slate-300 text-sm leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* --- HOW TO USE TIMELINE --- */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-extrabold mb-4">Patient Journey</h2>
            <p className="text-slate-400">From walking in to receiving a triage token — fully automated.</p>
          </div>
          <div>
            {steps.map((step, i) => (
              <TimelineStep key={i} number={i + 1} {...step} isLast={i === steps.length - 1} />
            ))}
          </div>
        </div>
      </section>

      {/* --- TECH STACK --- */}
      <section className="relative z-10 py-20 px-4 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-extrabold mb-4">Tech Stack</h2>
            <p className="text-slate-400">Built with modern, battle-tested technologies.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { layer: 'Frontend', tech: 'React (Vite) + Vanilla CSS (Glassmorphism)', color: 'from-cyan-500 to-blue-600' },
              { layer: 'Face AI', tech: 'face-api.js — TinyFaceDetector / FaceLandmark68Net / FaceRecognitionNet', color: 'from-violet-500 to-purple-600' },
              { layer: 'Voice', tech: 'Web Speech API — SpeechRecognition + SpeechSynthesis', color: 'from-rose-500 to-pink-600' },
              { layer: 'Language AI', tech: 'Sarvam AI sarvam-m model via /api/sarvam-chat proxy', color: 'from-amber-500 to-orange-600' },
              { layer: 'Backend', tech: 'Node.js + Express.js REST API', color: 'from-emerald-500 to-teal-600' },
              { layer: 'Data & PDF', tech: 'MongoDB (Mongoose) + pdfkit + Twilio WhatsApp', color: 'from-indigo-500 to-blue-700' },
            ].map(({ layer, tech, color }) => (
              <div key={layer} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors">
                <div className={`text-xs font-bold uppercase tracking-widest bg-gradient-to-r ${color} bg-clip-text text-transparent mb-2`}>{layer}</div>
                <div className="text-slate-300 text-sm">{tech}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- API REFERENCE --- */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-extrabold mb-4">API Reference</h2>
            <p className="text-slate-400">Backend endpoints powering RAYA.</p>
          </div>
          <div className="space-y-3">
            {[
              { method: 'POST', endpoint: '/api/raya/register',              desc: 'Register a new patient with face descriptor + photo' },
              { method: 'POST', endpoint: '/api/raya/recognize',             desc: 'Match a face descriptor against all stored patients' },
              { method: 'POST', endpoint: '/api/raya/sarvam-chat',           desc: 'Proxy endpoint to Sarvam AI chat completions' },
              { method: 'POST', endpoint: '/api/raya/generate-token',        desc: 'Run triage logic, generate token + PDF receipt' },
              { method: 'POST', endpoint: '/api/raya/generate-profile-pdf',  desc: 'Generate a downloadable patient profile PDF card' },
              { method: 'GET',  endpoint: '/api/raya/download-receipt/:file', desc: 'Download a generated PDF by filename' },
            ].map(({ method, endpoint, desc }) => (
              <div key={endpoint} className="flex flex-col sm:flex-row sm:items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-5 py-4 hover:bg-white/8 transition-colors">
                <span className={`px-3 py-1 rounded-lg text-xs font-bold font-mono shrink-0 ${method === 'POST' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
                  {method}
                </span>
                <code className="text-cyan-300 text-sm font-mono shrink-0">{endpoint}</code>
                <span className="text-slate-400 text-sm sm:ml-auto">{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA --- */}
      <section className="relative z-10 py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 rounded-3xl p-12">
            <Bot size={48} className="text-cyan-400 mx-auto mb-6" />
            <h2 className="text-4xl font-extrabold mb-4">Ready to experience RAYA?</h2>
            <p className="text-slate-400 mb-8">Start the OXWAY system and let RAYA handle your entire patient intake flow — hands-free, voice-first, AI-powered.</p>
            <Link
              to="/security"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-10 py-4 rounded-full font-bold text-lg shadow-2xl shadow-cyan-500/30 transition-all hover:-translate-y-1"
            >
              Launch RAYA Now <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="relative z-10 border-t border-white/10 py-10 px-4 text-center text-slate-500 text-sm">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Activity size={18} className="text-blue-500" />
          <span className="font-bold text-white text-lg">O<span className="text-red-500">X</span>WAY</span>
        </div>
        <p>© {new Date().getFullYear()} OXWAY — Smart Hospital Receptionist System. RAYA AI is powered by Sarvam AI &amp; face-api.js.</p>
      </footer>
    </div>
  );
};

export default RayaPage;
