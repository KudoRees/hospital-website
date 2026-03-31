import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RayaSecurity from '../components/RayaSecurity';
import { Bot, Mic, Brain, ArrowRight, RotateCcw, Languages, UserPlus } from 'lucide-react';

const BACKEND = 'http://localhost:5000';

// ────────────────────────────────────────────────────────────
// Python speak() → JavaScript speakAsync()
// Cleans <think> tags & AI preambles, then uses Web Speech TTS
// ────────────────────────────────────────────────────────────
const cleanTTS = (text) => {
  if (!text) return '';
  let clean = text.replace(/<think>[\s\S]*?<\/think>/g, '');
  [/First, I need to.*?\./gi, /Okay, let's.*?[\.!]/gi, /The user wants.*?[\.!]/gi,
   /I should start by.*?[\.!]/gi, /Based on the problem.*?[\.!]/gi
  ].forEach(p => { clean = clean.replace(p, ''); });
  return clean.replace(/\*/g, '').replace(/[ \t]+/g, ' ').trim();
};

const speakAsync = (text, lang = 'hi-IN') => new Promise((resolve) => {
  if (!window.speechSynthesis) { resolve(); return; }
  const cleaned = cleanTTS(text);
  if (!cleaned || cleaned.length < 2) { resolve(); return; }
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(cleaned);
  utt.lang = lang;
  utt.rate = 0.9;
  utt.pitch = 1.0;
  utt.onend = resolve;
  utt.onerror = resolve;
  window.speechSynthesis.speak(utt);
});

// ────────────────────────────────────────────────────────────
// Python listen_with_retry() → JavaScript listenWithRetry()
// 2 attempts, adjusts for ambient noise, 10s+ recording
// ────────────────────────────────────────────────────────────
const listenOnce = (timeoutMs = 10000, lang = 'hi-IN') => new Promise((resolve) => {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { resolve(''); return; }
  const rec = new SR();
  rec.lang = lang;
  rec.interimResults = false;
  rec.maxAlternatives = 1;
  rec.continuous = false;
  let settled = false;
  const done = (val) => { if (!settled) { settled = true; resolve(val || ''); } };
  const timer = setTimeout(() => { try { rec.abort(); } catch (e) {} done(''); }, timeoutMs);
  rec.onresult = (e) => { clearTimeout(timer); done(e.results[0][0].transcript.trim()); };
  rec.onerror = () => { clearTimeout(timer); done(''); };
  rec.onend = () => { clearTimeout(timer); done(''); };
  try { rec.start(); } catch (e) { done(''); }
});

const listenWithRetry = async (durationMs = 10000, lang = 'hi-IN', maxAttempts = 2) => {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const result = await listenOnce(durationMs, lang);
    if (result && result.trim().length > 0) return result;
    console.log(`Listen attempt ${attempt + 1} failed, ${attempt + 1 < maxAttempts ? 'retrying...' : 'giving up.'}`);
  }
  return '';
};

// ────────────────────────────────────────────────────────────
// Python call_api_with_thinking_sound() → callSarvam()
// Visual thinking indicator replaces pygame thinking sound
// ────────────────────────────────────────────────────────────
const callSarvam = async (messages) => {
  try {
    const res = await fetch(`${BACKEND}/api/raya/sarvam-chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    });
    const data = await res.json();
    return data.choices?.[0]?.message?.content || '';
  } catch (e) {
    console.error('Sarvam API error:', e);
    return '';
  }
};
const wait = (ms) => new Promise(r => setTimeout(r, ms));

// ────────────────────────────────────────────────────────────
// Stage definitions
// ────────────────────────────────────────────────────────────
const STAGES = [
  { key: 'scan',     label: 'चेहरा स्कैन',   icon: Bot },
  { key: 'register', label: 'पंजीकरण',       icon: UserPlus },
  { key: 'problem',  label: 'समस्या',        icon: Mic },
  { key: 'questions',label: 'AI प्रश्न',       icon: Brain },
  { key: 'done',     label: 'टोकन',         icon: ArrowRight },
];

// ────────────────────────────────────────────────────────────
// SecurityPage — Full Python main() flow in React
// ────────────────────────────────────────────────────────────
const SecurityPage = () => {
  const navigate = useNavigate();

  const [stage, setStage] = useState('scan');
  const [statusMsg, setStatusMsg] = useState('');
  const [error, setError] = useState('');
  const [micActive, setMicActive] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [patientName, setPatientName] = useState('');

  // Refs for mutable state (avoids stale closures in async flow)
  const langRef = useRef('hi-IN');
  const hindiRef = useRef(true);
  const lCodeRef = useRef('hi');      // 'hi' or 'en' (for Sarvam)
  const currLangRef = useRef('Hindi'); // 'Hindi' or 'English' (for prompts)
  const patientRef = useRef(null);
  const runningRef = useRef(false);

  // ── English choice removed. Force Hindi. ──────────────────────────

  // ── Face recognized → decide flow ─────────────────────────
  const handleRecognized = async (patient, isNew, descriptor, photo) => {
    if (isNew) {
      await doRegistration(descriptor, photo);
    } else {
      // Python: record = db.find_patient(name) → returning patient
      patientRef.current = patient;
      setPatientName(patient.name);
      await speakAsync(`स्वागत है ${patient.name}।`, 'hi-IN');
      await doTriage(patient);
    }
  };

  // ────────────────────────────────────────────────────────────
  // Python: New patient registration flow
  // name_raw = listen_with_retry("कृपया अपना नाम बताएं।")
  // payload_name = {"model":"sarvam-m","messages":[{"role":"user","content":f"Extract English name: {name_raw}. Output ONLY name."}]}
  // u_age = "".join(re.findall(r'\d+', listen_with_retry("आपकी उम्र क्या है?")))
  // u_mobile = "".join(re.findall(r'\d+', listen_with_retry("अपना mobile number बताएं।")))
  // ────────────────────────────────────────────────────────────
  const doRegistration = async (descriptor, photo) => {
    const lang = langRef.current;
    const hindi = hindiRef.current;
    setStage('register');

    await speakAsync('नए पेशेंट का पंजीकरण।', 'hi-IN');

    // Python: name_raw = listen_with_retry("कृपया अपना नाम बताएं।", l_code)
    setStatusMsg('कृपया अपना नाम बताएं।');
    await speakAsync('कृपया अपना नाम बताएं।', 'hi-IN');
    setMicActive(true);
    const nameRaw = await listenWithRetry(10000, lang, 2) || 'User';
    setMicActive(false);

    // Python: payload_name = {"model":"sarvam-m","messages":[{"role":"user","content":f"Extract English name: {name_raw}. Output ONLY name."}]}
    setThinking(true);
    setStatusMsg('नाम निकाला जा रहा है...');
    const nameRes = await callSarvam([
      { role: 'user', content: `Extract English name: ${nameRaw}. Output ONLY name.` }
    ]);
    setThinking(false);

    // Python: name = name_res["choices"][0]["message"]["content"].strip().split()[-1].replace(".", "")
    let finalName;
    try {
      finalName = nameRes.trim().split(/\s+/).pop().replace(/\./g, '') || 'Patient';
    } catch { finalName = 'Patient'; }

    // Python: u_age = "".join(re.findall(r'\d+', listen_with_retry("आपकी उम्र क्या है?", l_code)))
    setStatusMsg('आपकी उम्र क्या है?');
    await speakAsync('आपकी उम्र क्या है?', 'hi-IN');
    setMicActive(true);
    const rawAge = await listenWithRetry(10000, lang, 2);
    setMicActive(false);
    const age = parseInt(rawAge.replace(/\D/g, '')) || 25;

    // Python: u_mobile = "".join(re.findall(r'\d+', listen_with_retry("अपना mobile number बताएं।", l_code)))
    setStatusMsg('अपना mobile number बताएं।');
    await speakAsync('अपना mobile number बताएं।', 'hi-IN');
    setMicActive(true);
    const rawMob = await listenWithRetry(10000, lang, 2);
    setMicActive(false);
    const phone = rawMob.replace(/\D/g, '') || '0000000000';

    // Python: db.add_patient(name, int(u_age), "Male", u_mobile)
    setThinking(true);
    setStatusMsg('पंजीकरण हो रहा है...');
    try {
      const res = await fetch(`${BACKEND}/api/raya/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: finalName, age, phone, faceDescriptor: descriptor, photo }),
      });
      const data = await res.json();
      const p = { _id: data.patient._id, name: finalName, age, phone };
      patientRef.current = p;
      setPatientName(finalName);
      setThinking(false);
      await doTriage(p);
    } catch (e) {
      setThinking(false);
      setError('Registration failed: ' + e.message);
    }
  };

  // ────────────────────────────────────────────────────────────
  // Python: Triage flow
  // problem = listen_with_retry(None, l_code, duration=15)
  // payload_q = {"model":"sarvam-m","messages":[{"role":"user","content":f"Ask 5 medical questions in {curr_lang} for: {problem}."}]}
  // ...5 Q&A loop...
  // payload_rep = {"model":"sarvam-m","messages":[{"role":"user","content":f"Summarize in professional English: {problem}, {answers}."}]}
  // ────────────────────────────────────────────────────────────
  const doTriage = async (p) => {
    const lang = langRef.current;
    const hindi = hindiRef.current;
    const currLang = currLangRef.current;

    setStage('problem');
    const problemPrompt = 'अपनी परेशानी विस्तार से बताएं।';
    setStatusMsg(problemPrompt);
    await speakAsync(problemPrompt, 'hi-IN');

    // Python: problem = listen_with_retry(None, l_code, duration=15)
    setMicActive(true);
    const problem = await listenWithRetry(15000, lang, 2);
    setMicActive(false);

    if (!problem) {
      await doFinish(p, 'No verbal input received.', problem);
      return;
    }

    // Python: speak("मैं आपसे 5 छोटे सवाल पूछूँगी।")
    setStage('questions');
    setThinking(true);
    setStatusMsg('मैं आपसे 5 छोटे सवाल पूछूँगी।');
    await speakAsync('मैं आपसे 5 छोटे सवाल पूछूँगी।', 'hi-IN');

    // Python: payload_q = {"model":"sarvam-m","messages":[{"role":"user","content":f"Ask 5 medical questions in {curr_lang} for: {problem}."}]}
    const rawQs = await callSarvam([
      { role: 'user', content: `You are a senior triage nurse. Based on the patient's complaint: '${problem}', ask 5 highly specific and diagnostic medical follow-up questions in Hindi that will help a doctor evaluate this specific condition. Output only the questions with numbers.` }
    ]);
    setThinking(false);

    // Python: clean_q = re.sub(r'<think>.*?</think>', '', ...)
    // questions = [l for l in clean_q.split("\n") if "?" in l]
    const cleanQ = cleanTTS(rawQs);
    let questions = cleanQ.split(/\n|(?=\d+\.\s+)/).filter(l => l.includes('?')).map(l => l.replace(/^\d+\.\s*/, '').trim()).slice(0, 5);
    if (questions.length === 0) questions = ['दर्द कितने समय से है?'];

    // Move to English for PDF storage
    const enProblem = await callSarvam([{ role: 'user', content: `Translate this Hindi medical symptom to concise professional English for a clinical report: ${problem}` }]);

    const answers = [];
    for (let i = 0; i < questions.length; i++) {
      setStatusMsg(`(${i + 1}/${questions.length}) ${questions[i]}`);
      await speakAsync(questions[i], 'hi-IN');
      await wait(1000);
      
      setMicActive(true);
      const ans = await listenWithRetry(10000, lang, 2);
      setMicActive(false);
      
      let finalPair = `Q: ${questions[i]}, A: ${ans || '(no answer)'}`;
      // 3. Immediately translate Hindi Q&A pair to professional English for PDF
      if (ans) {
         const enPair = await callSarvam([{ role: 'user', content: `Translate this Hindi medical triage Q&A pair to professional medical English for a doctor's report:
         Question: ${questions[i]}
         Answer: ${ans}
         Return only the translated English text in "Q: ..., A: ..." format.` }]);
         finalPair = enPair.replace(/["']/g, '').trim();
      } else {
         // Even if answer is missing, translate the question
         const enQ = await callSarvam([{ role: 'user', content: `Translate this Hindi medical question to professional English: ${questions[i]}` }]);
         finalPair = `Q: ${enQ.trim()}, A: (no answer)`;
      }

      answers.push(finalPair);
      await wait(1000);
    }

    setThinking(true);
    setStatusMsg('रिपोर्ट तैयार हो रही है।');
    await speakAsync('रिपोर्ट तैयार हो रही है।', 'hi-IN');

    const finalReport = await callSarvam([
      { role: 'user', content: `Summarize the clinical findings in professional medical English based on the Complaint: '${enProblem}' and Triage Answers: ${JSON.stringify(answers)}. Focus on clarity and diagnostic relevance.` }
    ]);
    
    setThinking(false);
    const cleanReport = cleanTTS(finalReport);
    await doFinish(p, cleanReport, enProblem, answers);
  };

  // ────────────────────────────────────────────────────────────
  // Python: token_details, pdf_path = processor.process_user_dynamic(patient_info, final_report, problem)
  // open_file(pdf_path)
  // speak(f"टोकन नंबर {token_details['sub_token']}।")
  // ────────────────────────────────────────────────────────────
  const doFinish = async (p, summary, originalProblem, answers) => {
    const lang = langRef.current;
    const hindi = hindiRef.current;
    setStage('done');
    setStatusMsg('टोकन तैयार हो रहा है...');
    try {
      const res = await fetch(`${BACKEND}/api/raya/generate-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: p._id,
          patientName: p.name,
          patientAge: p.age,
          patientMobile: p.phone,
          summary,
          phone: p.phone,
          originalProblem: originalProblem || 'General Checkup',
          triageAnswers: answers,
        }),
      });
      const data = await res.json();

      await speakAsync(
        `टोकन नंबर ${data.token}।`,
        'hi-IN'
      );

      // Python: open_file(pdf_path) → navigate to receipt page
      navigate(
        `/receipt?token=${data.token}&majorId=${data.majorId}&dept=${data.department}` +
        `&deptName=${encodeURIComponent(data.deptName || '')}` +
        `&priority=${data.priority}` +
        `&triageLevel=${encodeURIComponent(data.triageLevel || '')}` +
        `&pdf=${data.pdfFilename}` +
        `&name=${encodeURIComponent(p.name)}`
      );
    } catch (e) {
      setError('Token generation failed: ' + e.message);
    }
  };

  const handleRestart = () => { window.location.reload(); };

  // ────────────────────────────────────────────────────────────
  // UI
  // ────────────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      color: '#e2e8f0', fontFamily: "'Inter', sans-serif", display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 30, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img src="/logo.png" alt="OXWAY Logo" style={{ height: 80, marginBottom: 15 }} />
        <h1 style={{ fontSize: 32, fontWeight: 900, color: '#fff', letterSpacing: '2px', display: 'flex', alignItems: 'center', gap: 4 }}>
          O<span style={{ color: '#ef4444' }}>X</span>WAY <span style={{ fontWeight: 400, color: '#94a3b8', marginLeft: 10 }}>AI</span>
        </h1>
        <p style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>Powered by Sarvam AI · Smart Healthcare Systems</p>
        {patientName && <p style={{ color: '#06b6d4', marginTop: 10, fontWeight: 600 }}>नमस्ते, {patientName} 🙏</p>}
      </div>

      {/* Stepper */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 30, overflowX: 'auto', maxWidth: '100%' }}>
        {STAGES.map((s, i) => {
          const Icon = s.icon;
          const active = s.key === stage;
          const done = STAGES.findIndex(x => x.key === stage) > i;
          return (
            <div key={s.key} style={{
              padding: '8px 16px', borderRadius: 20, fontSize: 13, fontWeight: 700,
              background: active ? '#06b6d4' : done ? 'rgba(6,182,212,0.15)' : 'rgba(255,255,255,0.05)',
              color: active ? '#fff' : done ? '#06b6d4' : '#64748b',
              border: `1px solid ${active ? '#06b6d4' : 'rgba(255,255,255,0.1)'}`,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <Icon size={14} /> {s.label}
            </div>
          );
        })}
      </div>

      {/* Main Card */}
      <div style={{
        width: '100%', maxWidth: 640, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 24, padding: 32, backdropFilter: 'blur(20px)',
      }}>
        {stage === 'scan' && <RayaSecurity onRecognized={handleRecognized} />}

        {stage !== 'scan' && (
          <div style={{ textAlign: 'center', minHeight: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
            {/* Thinking / Mic Indicator (replaces Python pygame thinking sound) */}
            <div style={{
              width: 100, height: 100, borderRadius: '50%',
              background: thinking ? 'rgba(6,182,212,0.1)' : micActive ? '#06b6d4' : 'rgba(255,255,255,0.05)',
              border: `4px solid ${micActive || thinking ? '#06b6d4' : 'rgba(255,255,255,0.1)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: micActive || thinking ? '0 0 40px rgba(6,182,212,0.4)' : 'none',
              animation: (micActive || thinking) ? 'rayaPulse 1.5s infinite' : 'none',
            }}>
              {thinking
                ? <Brain size={40} color="#06b6d4" style={{ animation: 'rayaSpin 2s linear infinite' }} />
                : <Mic size={40} color={micActive ? '#fff' : '#64748b'} />
              }
            </div>

            <p style={{ fontSize: 18, color: '#f1f5f9', maxWidth: 450, lineHeight: 1.6 }}>{statusMsg}</p>
            {micActive && (
              <p style={{ color: '#06b6d4', fontSize: 12, animation: 'rayaPulse 1.5s infinite' }}>
                🎙️ {'>>> सुन रहा है...'}
              </p>
            )}
            {thinking && (
              <p style={{ color: '#94a3b8', fontSize: 12 }}>
                🧠 RAYA सोच रही है...
              </p>
            )}
            {error && <p style={{ color: '#f87171' }}>{error}</p>}

            <button onClick={handleRestart} style={{
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              padding: '10px 24px', borderRadius: 20, color: '#94a3b8', fontSize: 14, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <RotateCcw size={14} /> पुनः शुरू करें
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes rayaPulse { 0%{transform:scale(1);opacity:1} 50%{transform:scale(1.06);opacity:.8} 100%{transform:scale(1);opacity:1} }
        @keyframes rayaSpin { from{transform:rotate(0)} to{transform:rotate(360deg)} }
      `}</style>
    </div>
  );
};

export default SecurityPage;
