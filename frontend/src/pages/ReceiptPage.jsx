import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Download, Home, CheckCircle, Activity, Hash, Building2 } from 'lucide-react';

const BACKEND = 'http://localhost:5000';

const DEPT_COLORS = {
  GENERAL:     '#2563eb',
  CARDIOLOGY:  '#dc2626',
  ORTHOPEDICS: '#7c3aed',
  DENTAL:      '#059669',
};

const PRIORITY_CONFIG = {
  GREEN:  { color: '#16a34a', bg: 'rgba(22,163,74,0.12)',  label: 'NORMAL (GREEN) — स्थिर' },
  YELLOW: { color: '#ca8a04', bg: 'rgba(202,138,4,0.12)',  label: 'URGENT (YELLOW) — तत्काल' },
  RED:    { color: '#dc2626', bg: 'rgba(220,38,38,0.12)',  label: 'EMERGENCY (RED) — गंभीर' },
};

const ReceiptPage = () => {
  const [params] = useSearchParams();
  const token       = params.get('token')       || 'N/A';
  const majorId     = params.get('majorId')      || '';
  const dept        = params.get('dept')         || 'GENERAL';
  const deptName    = params.get('deptName')      || dept;
  const priority    = params.get('priority')     || 'YELLOW';
  const triageLevel = params.get('triageLevel')  || '';
  const pdf         = params.get('pdf')          || '';
  const name        = params.get('name')         || 'Patient';

  const deptColor = DEPT_COLORS[dept]     || '#2563eb';
  const prioConf  = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.YELLOW;

  const downloadUrl = pdf ? `${BACKEND}/api/raya/download-receipt/${pdf}` : null;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      color: '#e2e8f0',
      fontFamily: "'Inter', Roboto, sans-serif",
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '24px 16px',
    }}>
      {/* Success check */}
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{
          width: 70, height: 70, borderRadius: '50%',
          background: `linear-gradient(135deg, ${deptColor}, #06b6d4)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px',
          boxShadow: `0 0 40px ${deptColor}55`,
        }}>
          <CheckCircle size={36} color="#fff" />
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0, color: '#fff' }}>Triage Complete!</h1>
        <p style={{ color: '#94a3b8', margin: '6px 0 0', fontSize: 14 }}>नमस्ते, {decodeURIComponent(name)} 🙏</p>
      </div>

      {/* Receipt card */}
      <div style={{
        width: '100%', maxWidth: 460,
        background: 'rgba(255,255,255,0.04)',
        border: `1px solid ${deptColor}55`,
        borderRadius: 24, overflow: 'hidden',
        boxShadow: `0 0 60px ${deptColor}22`,
      }}>
        {/* Header bar */}
        <div style={{
          background: deptColor, padding: '16px 28px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Activity size={20} color="#fff" />
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 18 }}>
              O<span style={{ color: '#fca5a5' }}>X</span>WAY SMART HEALTHCARE
            </span>
          </div>
          <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
            {new Date().toLocaleDateString('en-IN')}
          </span>
        </div>

        {/* Dual Token Display — MAJOR ID + SUB TOKEN */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, padding: '24px 28px 16px' }}>
          {/* Major ID */}
          {majorId && (
            <div style={{
              flex: 1, textAlign: 'center',
              border: `2px solid ${deptColor}`, borderRadius: 14,
              padding: '12px 8px',
            }}>
              <p style={{ color: '#64748b', fontSize: 11, margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: 2 }}>
                <Hash size={12} style={{ verticalAlign: 'middle' }} /> MAJOR ID
              </p>
              <div style={{ fontSize: 32, fontWeight: 900, color: '#e2e8f0' }}>
                {majorId}
              </div>
            </div>
          )}
          {/* Sub Token */}
          <div style={{
            flex: 1, textAlign: 'center',
            border: `2px solid ${deptColor}`, borderRadius: 14,
            padding: '12px 8px',
          }}>
            <p style={{ color: '#64748b', fontSize: 11, margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: 2 }}>
              SUB TOKEN
            </p>
            <div style={{
              fontSize: 32, fontWeight: 900, color: deptColor,
              textShadow: `0 0 30px ${deptColor}66`,
            }}>
              {token}
            </div>
          </div>
        </div>

        {/* Triage color bar */}
        <div style={{
          margin: '0 20px 16px',
          background: prioConf.color, borderRadius: 10,
          padding: '10px 16px', textAlign: 'center',
        }}>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 13 }}>
            <Building2 size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
            DEPT: {decodeURIComponent(deptName)}  |  PRIORITY: {triageLevel ? decodeURIComponent(triageLevel) : prioConf.label}
          </span>
        </div>

        {/* Details */}
        <div style={{ padding: '0 28px 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { label: 'विभाग (Department)', value: decodeURIComponent(deptName) },
            { label: 'रोगी (Patient)',      value: decodeURIComponent(name) },
            { label: 'प्राथमिकता (Priority)', value: triageLevel ? decodeURIComponent(triageLevel) : prioConf.label },
            { label: 'समय (Time)',          value: new Date().toLocaleTimeString('en-IN') },
            { label: 'दिनांक (Date)',        value: new Date().toLocaleDateString('en-IN') },
          ].map(({ label, value }) => (
            <div key={label} style={{
              display: 'flex', justifyContent: 'space-between',
              padding: '10px 14px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 10,
            }}>
              <span style={{ color: '#64748b', fontSize: 12 }}>{label}</span>
              <span style={{ color: '#e2e8f0', fontWeight: 600, fontSize: 12 }}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
        {downloadUrl && (
          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: `linear-gradient(135deg, ${deptColor}, #06b6d4)`,
              color: '#fff', textDecoration: 'none',
              borderRadius: 30, padding: '12px 28px',
              fontWeight: 700, fontSize: 14,
              boxShadow: `0 8px 24px ${deptColor}44`,
            }}
          >
            <Download size={16} /> PDF डाउनलोड करें
          </a>
        )}
        <Link
          to="/"
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#94a3b8', textDecoration: 'none',
            borderRadius: 30, padding: '12px 24px',
            fontWeight: 600, fontSize: 14,
          }}
        >
          <Home size={15} /> Home
        </Link>
      </div>

      <p style={{ color: '#334155', fontSize: 11, marginTop: 24 }}>
        Generated by RAYA AI — Oxway Smart Healthcare Systems
      </p>
    </div>
  );
};

export default ReceiptPage;
