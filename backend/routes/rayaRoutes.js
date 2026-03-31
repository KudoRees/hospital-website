const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const RayaPatient = require('../models/RayaPatient');
const RayaVisit = require('../models/RayaVisit');

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
const RECEIPTS_DIR = path.join(__dirname, '..', 'receipts');
if (!fs.existsSync(RECEIPTS_DIR)) fs.mkdirSync(RECEIPTS_DIR, { recursive: true });

function euclidean(a, b) {
  let sum = 0;
  for (let i = 0; i < a.length; i++) sum += (a[i] - b[i]) ** 2;
  return Math.sqrt(sum);
}

function todayStr() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
}

const DEPT_CONFIG = {
  GENERAL:     { code: 'GENE', color: '#2563eb' },
  CARDIOLOGY:  { code: 'CARD', color: '#dc2626' },
  ORTHOPEDICS: { code: 'ORTH', color: '#7c3aed' },
  DENTAL:      { code: 'DENT', color: '#059669' },
};

const cleanForPDF = (text) => {
  if (!text) return 'N/A';
  return String(text)
    .replace(/[^\x00-\x7F]/g, '')
    .replace(/[*#]/g, '')
    .replace(/\s+/g, ' ')
    .trim() || 'N/A';
};

function getTriageInfo(report) {
  const rep = String(report).toLowerCase();
  const cardiology = ["heart", "chest", "cardiac", "breath", "seene", "dil", "saans"];
  const dental = ["tooth", "dental", "gum", "dant", "daant", "masud"];
  const orthopedics = ["bone", "fracture", "joint", "neck", "back", "haddi", "jod", "toot"];

  let dept = 'GENERAL MEDICINE', colorHex = '#16a34a', level = 'NORMAL (GREEN)', deptKey = 'GENERAL';

  if (cardiology.some(k => rep.includes(k))) {
    dept = 'CARDIOLOGY'; colorHex = '#dc2626'; level = 'EMERGENCY (RED)'; deptKey = 'CARDIOLOGY';
  } else if (dental.some(k => rep.includes(k))) {
    dept = 'DENTAL DEPT'; colorHex = '#16a34a'; level = 'NORMAL (GREEN)'; deptKey = 'DENTAL';
  } else if (orthopedics.some(k => rep.includes(k))) {
    dept = 'ORTHOPEDICS'; colorHex = '#ca8a04'; level = 'URGENT (YELLOW)'; deptKey = 'ORTHOPEDICS';
  }

  return { dept, colorHex, level, deptKey };
}

function getSymptomQuestions(text) {
  const t = text.toLowerCase();
  
  if (t.includes('fever') || t.includes('bukhar') || t.includes('bukhaar') || t.includes('tap') || t.includes('बुखार') || t.includes('ताप')) {
    return '1. Bukhaar kitne dino se hai?\n2. Shareer ka tapmaan kitna hai?\n3. Kya sardi ya khansi hai?\n4. Shareer mein dard ya kamzori hai?\n5. Kya koi medicine li hai?';
  }
  if (t.includes('chest') || t.includes('heart') || t.includes('dil') || t.includes('sine') || t.includes('seene') || t.includes('सीने')) {
    return '1. Seene mein dard kab se hai?\n2. Kya dard baayein haath tak jata hai?\n3. Saans lene mein takleef hai?\n4. Paseena ya chakkar aa raha hai?\n5. Purani heart problem hai?';
  }
  if (t.includes('bone') || t.includes('fracture') || t.includes('haddi') || t.includes('jod') || t.includes('fractur') || t.includes('हड्डी')) {
    return '1. Chot kab lagi?\n2. Kya haddi mein soojan hai?\n3. Hilane par dard badhta hai?\n4. Kya aap chal-phir pa rahe hain?\n5. Kabhi pehle fracture hua tha?';
  }
  if (t.includes('stomach') || t.includes('pet') || t.includes('ulti') || t.includes('पेट') || t.includes('dast')) {
    return '1. Pet dard kab se hai?\n2. Ulti ya dast hai?\n3. Last time kya khaya tha?\n4. Pet mein soojan hai?\n5. Kabhi pehle aisa hua?';
  }
  if (t.includes('cough') || t.includes('khansi') || t.includes('saans') || t.includes('खांसी')) {
    return '1. Khansi kab se hai?\n2. Balgam aata hai?\n3. Saans lene mein takleef hai?\n4. Raat mein badhti hai?\n5. Bukhaar ya kamzori hai?';
  }

  return '1. Samasya kitne samay se hai?\n2. Pain 1-10 mein kitna hai?\n3. Kya pain badhta/kam hota hai?\n4. Bukhaar ya kamzori hai?\n5. Koi medicine le rahe hain?';
}

// ─────────────────────────────────────────────────────────────
// Routes
// ─────────────────────────────────────────────────────────────

router.post('/register', async (req, res) => {
  try {
    const { name, age, phone, emergencyContact, faceDescriptor, photo } = req.body;
    const patient = await RayaPatient.create({ name, age, phone, emergencyContact, faceDescriptor, photo });
    res.status(201).json({ success: true, patient });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/recognize', async (req, res) => {
  try {
    const { faceDescriptor } = req.body;
    const patients = await RayaPatient.find({});
    let best = null, bestDist = Infinity;
    for (const p of patients) {
      const dist = euclidean(faceDescriptor, p.faceDescriptor);
      if (dist < bestDist) { bestDist = dist; best = p; }
    }
    if (best && bestDist < 0.55) return res.json({ matched: true, patient: best });
    res.json({ matched: false });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/sarvam-chat', async (req, res) => {
  try {
    const { messages } = req.body;
    const apiKey = process.env.SARVAM_API_KEY;
    const lastMsg = messages[messages.length - 1]?.content || '';
    const combined = messages.map(m => m.content).join(' ').toLowerCase();

    // Mock logic if no API key
    if (!apiKey || apiKey === 'your_sarvam_api_key_here') {
      // 1. Triage Question Generation
      if (combined.includes('ask 5') || combined.includes('question') || combined.includes('nurse')) {
        return res.json({ choices: [{ message: { content: getSymptomQuestions(combined) } }] });
      }

      // 2. Translation Mock
      if (combined.includes('translate') || combined.includes('in english')) {
        let translation = "Patient undergoing clinical evaluation for respiratory symptoms.";
        if (combined.includes('bukhaar') || combined.includes('fever')) {
          translation = "Patient reports persistent high-grade fever and fatigue.";
        } else if (combined.includes('pain') || combined.includes('dard')) {
          translation = "Acute discomfort and localized pain reported.";
        }
        return res.json({ choices: [{ message: { content: translation } }] });
      }

      // 3. Clinical Summary Mock
      if (combined.includes('summarize') || combined.includes('clinical findings')) {
        const t = getTriageInfo(combined);
        return res.json({ choices: [{ message: { content: `Chief Complaint: General Evaluation. Recommendation: Requires ${t.dept.toLowerCase()} consultation. Priority: ${t.level}.` } }] });
      }

      // 4. Name Extractor Mock
      if (combined.includes('name')) {
        const words = lastMsg.split(' ');
        return res.json({ choices: [{ message: { content: words[words.length - 1] || 'Patient' } }] });
      }

      return res.json({ choices: [{ message: { content: lastMsg } }] });
    }

    // Actual API Call
    const response = await fetch('https://api.sarvam.ai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({ model: 'sarvam-m', messages }),
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('SARVAM API error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/generate-token', async (req, res) => {
  try {
    const { patientId, patientName, patientAge, patientMobile, summary, originalProblem, triageAnswers } = req.body;
    const triage = getTriageInfo(summary || originalProblem);
    const today = todayStr();
    
    // Counter for tokens
    const count = await RayaVisit.countDocuments({ date: today });
    const subToken = `${DEPT_CONFIG[triage.deptKey]?.code || 'GENE'}-${String(count + 1).padStart(3, '0')}`;
    
    const pdfFilename = `${subToken}_${Date.now()}.pdf`;
    const pdfPath = path.join(RECEIPTS_DIR, pdfFilename);

    const doc = new PDFDocument({ size: 'A4', margin: 40 });
    doc.pipe(fs.createWriteStream(pdfPath));
    const pageW = doc.page.width;
    
    // 1. Header (Premium Style)
    doc.fillColor('#003366').fontSize(22).font('Helvetica-Bold').text('OXWAY SMART HEALTHCARE', 40, 44);
    doc.fontSize(10).font('Helvetica').fillColor('#64748b').text('Powered by RAYA AI - Intelligent Reception Systems', 40, 74);
    
    // 2. Token Banner & Priority (Correctly positioned)
    doc.moveDown(2);
    doc.fillColor(triage.colorHex).rect(40, doc.y, pageW - 80, 30).fill();
    doc.fillColor('#ffffff').fontSize(12).font('Helvetica-Bold').text(`TOKEN: ${subToken} | DEPT: ${triage.dept} | PRIORITY: ${triage.level}`, 50, doc.y + 8, { width: pageW - 100, align: 'center' });
    
    // 3. Patient Info
    doc.moveDown(3);
    doc.fillColor('#000000').fontSize(14).font('Helvetica-Bold').text(`Patient: ${cleanForPDF(patientName).toUpperCase()}`);
    doc.fontSize(10).font('Helvetica').fillColor('#334155').text(`Age: ${patientAge || 'N/A'}  |  Phone: ${patientMobile || 'N/A'}  |  Date: ${today}`);
    
    doc.moveDown(0.5);
    doc.strokeColor('#e2e8f0').lineWidth(1).moveTo(40, doc.y).lineTo(pageW - 40, doc.y).stroke();
    doc.moveDown(1);
    
    // 4. Clinical Details (Handling multi-line strings correctly)
    doc.fillColor('#003366').fontSize(12).font('Helvetica-Bold').text('Chief Complaint (Professional English):');
    doc.moveDown(0.3);
    doc.font('Helvetica').fontSize(10).fillColor('#1e293b').text(cleanForPDF(originalProblem), { width: pageW - 80, lineGap: 2 });
    
    doc.moveDown(1.5);
    if (triageAnswers && triageAnswers.length > 0) {
      doc.fillColor('#003366').fontSize(12).font('Helvetica-Bold').text('Triage Checklist / Question Answers:');
      doc.moveDown(0.5);
      triageAnswers.forEach(ans => {
        if (!ans) return;
        const cleanAns = cleanForPDF(ans);
        doc.font('Helvetica').fontSize(10).fillColor('#334155').text(`\u2022 ${cleanAns}`, { width: pageW - 100, lineGap: 3 });
        doc.moveDown(0.2);
      });
    }

    doc.moveDown(1.5);
    if (summary) {
       doc.fillColor('#003366').fontSize(12).font('Helvetica-Bold').text('Clinical Summary & Recommendation:');
       doc.moveDown(0.3);
       doc.font('Helvetica').fontSize(10).fillColor('#1e293b').text(cleanForPDF(summary), { width: pageW - 80, lineGap: 2 });
    }

    // 5. Footer
    doc.fillColor('#94a3b8').fontSize(8).font('Helvetica-Oblique').text('Certified Clinical Summary generated automatically by RAYA AI.', 40, doc.page.height - 40, { align: 'center' });

    doc.end();

    await RayaVisit.create({
      patientId, patientName, token: subToken, department: triage.deptKey,
      priority: triage.level, summary, pdfPath: pdfFilename, date: today
    });

    res.json({ success: true, token: subToken, pdfFilename });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/download-receipt/:filename', (req, res) => {
  const filePath = path.join(RECEIPTS_DIR, path.basename(req.params.filename));
  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).send('File not found');
  }
});

module.exports = router;
