import React, { useEffect, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

const ScanQRCode = ({ onScan, onClose }) => {
  const [cameraError, setCameraError] = useState(null);

  useEffect(() => {
    const readerElementId = 'reader';

    if (!document.getElementById(readerElementId)) {
      return;
    }

    const html5QrCode = new Html5Qrcode(readerElementId);

    const onScanSuccess = (decodedText, decodedResult) => {
      html5QrCode.stop().then(() => {
        onScan(decodedText);
        onClose();
      }).catch(err => {
        console.error("Failed to stop the QR scanner after success.", err);
        onScan(decodedText);
        onClose();
      });
    };

    const onScanFailure = (error) => {
      // Ignore "QR code not found" errors.
    };
    
    // **FIX APPLIED HERE (2 of 2)**
    // The viewfinder box is made slightly smaller to fit nicely inside the new rectangular view.
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
      let errorMessage = 'An unexpected error occurred. Please try again.';
      if (err.name === 'NotAllowedError') {
        errorMessage = 'Camera permission denied. Please enable camera access for this site in your browser settings.';
      } else if (err.name === 'NotFoundError') {
        errorMessage = 'No camera found on this device. Please ensure a camera is connected.';
      } else if (err.name === 'NotReadableError') {
        errorMessage = 'The camera is already in use by another application. Please close it and try again.';
      }
      setCameraError(errorMessage);
    });

    return () => {
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().catch(err => {
          console.error("Failed to cleanly stop the QR Code scanner on cleanup.", err);
        });
      }
    };
  }, [onScan, onClose]);

  return (
    <div style={{ position: 'relative', borderRadius: '0 0 12px 12px', overflow: 'hidden', background: '#000' }}>
      
      {/* **FIX APPLIED HERE (1 of 2)**
        'aspectRatio: '5 / 2'' makes the height 40% of the width (100 / 40 = 5 / 2).
        This creates the shorter, rectangular scanner you requested.
      */}
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
        </div>
      )}
    </div>
  );
};

export default ScanQRCode;