import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as faceapi from 'face-api.js';

const MODEL_URL = 'https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@master/weights';
const BACKEND   = 'http://localhost:5000';

/**
 * RayaSecurity (Simplified Sensor)
 * Props:
 *   onRecognized(patient, isNew, descriptor, photo)
 */
const RayaSecurity = ({ onRecognized }) => {
  const videoRef  = useRef(null);
  const canvasRef = useRef(null);

  const [statusMsg, setStatusMsg] = useState('Initializing AI models...');
  const [error, setError]         = useState('');
  
  const detectionLoopRef = useRef(null);
  const recognizingRef   = useRef(false);
  const completedRef     = useRef(false);

  const captureSnapshot = useCallback(() => {
    const v = videoRef.current;
    if (!v) return '';
    const tmp = document.createElement('canvas');
    tmp.width = v.videoWidth;
    tmp.height = v.videoHeight;
    tmp.getContext('2d').drawImage(v, 0, 0);
    return tmp.toDataURL('image/jpeg', 0.6);
  }, []);

  const recognize = useCallback(async (descriptor) => {
    if (recognizingRef.current || completedRef.current) return;
    recognizingRef.current = true;
    try {
      const res = await fetch(`${BACKEND}/api/raya/recognize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ faceDescriptor: Array.from(descriptor) }),
      });
      const data = await res.json();
      
      if (data.matched) {
        completedRef.current = true;
        clearInterval(detectionLoopRef.current);
        onRecognized(data.patient, false, null, null);
      } else {
        // Unknown person - trigger registration flow in parent
        completedRef.current = true;
        clearInterval(detectionLoopRef.current);
        const photo = captureSnapshot();
        onRecognized(null, true, Array.from(descriptor), photo);
      }
    } catch (err) {
      console.warn('Recognize error:', err);
      recognizingRef.current = false;
    }
  }, [onRecognized, captureSnapshot]);

  useEffect(() => {
    let stream = null;
    (async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);

        setStatusMsg('Starting camera...');
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        detectionLoopRef.current = setInterval(async () => {
          if (!videoRef.current || recognizingRef.current || completedRef.current) return;
          const v = videoRef.current;
          if (v.videoWidth === 0 || v.videoHeight === 0) return; // Prevent 0-dim resize error

          const detection = await faceapi.detectSingleFace(v, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();
          if (detection && canvasRef.current) {
            const dims = faceapi.matchDimensions(canvasRef.current, v, true);
            faceapi.draw.drawDetections(canvasRef.current, faceapi.resizeResults(detection, dims));
            recognize(detection.descriptor);
          }
        }, 800);
      } catch (err) {
        setError(err.message);
      }
    })();

    return () => {
      clearInterval(detectionLoopRef.current);
      stream?.getTracks().forEach(t => t.stop());
    };
  }, [recognize]);

  return (
    <div style={{ position: 'relative', width: '100%', borderRadius: 16, overflow: 'hidden', background: '#000' }}>
      <video ref={videoRef} autoPlay muted playsInline style={{ width: '100%', display: 'block' }} />
      <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', bottom: 12, left: 0, right: 0, textAlign: 'center', color: '#fff', fontSize: 12, background: 'rgba(0,0,0,0.5)', padding: '4px' }}>
        {error ? <span style={{ color: '#ff4444' }}>{error}</span> : statusMsg}
      </div>
    </div>
  );
};

export default RayaSecurity;
