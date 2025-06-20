import React, { useEffect, useState, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

const ScanQRCode = ({ onScan, onClose }) => {
  const [cameraError, setCameraError] = useState(null);
  const html5QrCodeRef = useRef(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    const readerElementId = 'reader';

    if (!document.getElementById(readerElementId)) {
      return;
    }

    const html5QrCode = new Html5Qrcode(readerElementId);
    html5QrCodeRef.current = html5QrCode;

    const onScanSuccess = (decodedText) => {
      if (!isMountedRef.current) return;
      
      // Stop scanning but don't close yet
      html5QrCode.stop().then(() => {
        if (isMountedRef.current) {
          onScan(decodedText);
          onClose();
        }
      }).catch(err => {
        if (isMountedRef.current) {
          onScan(decodedText);
          onClose();
        }
      });
    };

    const onScanFailure = (error) => {
      // Ignore "QR code not found" errors
      if (!isMountedRef.current) return;
    };
    
    const config = {
      fps: 10,
      qrbox: { width: 200, height: 200 }, 
      supportedScanTypes: [0],
    };
    
    html5QrCode.start(
      { facingMode: 'environment' },
      config,
      onScanSuccess,
      onScanFailure
    ).catch(err => {
      if (!isMountedRef.current) return;
      
      let errorMessage = 'An unexpected error occurred. Please try again.';
      if (err.name === 'NotAllowedError') {
        errorMessage = 'Camera permission denied. Please enable camera access.';
      } else if (err.name === 'NotFoundError') {
        errorMessage = 'No camera found on this device.';
      } else if (err.name === 'NotReadableError') {
        errorMessage = 'Camera is already in use by another application.';
      }
      setCameraError(errorMessage);
    });

    return () => {
      isMountedRef.current = false;
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        html5QrCodeRef.current.stop().catch(err => {
          // Ignore common cleanup errors
          if (err.message.includes('Scanner is not running') || 
              err.name === 'NotFoundError' ||
              err.name === 'AbortError') {
            return;
          }
        });
      }
    };
  }, [onScan, onClose]);

  return (
    <div style={{ position: 'relative', borderRadius: '0 0 12px 12px', overflow: 'hidden', background: '#000' }}>
      <div id="reader" style={{ width: '100%', aspectRatio: '5 / 2' }} />

      {cameraError && (
        <div style={{ 
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
            backgroundColor: 'rgba(0,0,0,0.9)', color: 'white', 
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '20px', textAlign: 'center'
        }}>
          <p style={{ fontWeight: 'bold', color: '#ff6b6b', marginBottom: '15px', fontSize: '1.1rem' }}>Camera Error</p>
          <p>{cameraError}</p>
          <button 
            onClick={onClose}
            className="btn btn-light mt-3 rounded-pill"
          >
            Close Scanner
          </button>
        </div>
      )}
    </div>
  );
};

export default ScanQRCode;