import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';

const ScanQRCode = ({ onScan, scannedTicket, ticketStatusMessage }) => {
  // State to hold and display any camera initialization errors
  const [cameraError, setCameraError] = useState(null);

  /**
   * This function now robustly handles errors from the library
   * and sets a user-friendly message in the state.
   */
  const handleResult = (result, error) => {
    if (result) {
      if (cameraError) setCameraError(null); // Clear previous errors on success
      onScan(result.getText());
    }

    if (error) {
      let errorMessage = `An unexpected error occurred: ${error.message}`;
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Camera permission is denied. Please enable camera access for this site in your browser settings.';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No camera found on this device. Please ensure a camera is connected and enabled.';
      } else if (error.name === 'NotReadableError') {
        errorMessage = 'The camera is already in use by another application or browser tab. Please close the other application and try again.';
      }
      setCameraError(errorMessage);
    }
  };

  return (
    <div className="text-center">
      <div
        style={{
          width: '300px',
          height: '300px',
          margin: '0 auto 1rem auto',
          borderRadius: '12px',
          border: '3px solid #0d6efd',
          overflow: 'hidden',
          position: 'relative',
          backgroundColor: '#000', // A background so the box is visible
        }}
      >
        {/*
          IMPORTANT CHANGE: If there's a cameraError, we display it to the user.
          Otherwise, we render the QrReader.
        */}
        {cameraError ? (
          <div className="d-flex align-items-center justify-content-center text-white h-100 p-3">
            <div>
              <p className="fw-bold text-danger mb-2">Camera Error</p>
              <p className="small">{cameraError}</p>
              <p className="small mt-3 fst-italic">
                Note: Camera access requires a secure connection (https://) or localhost.
              </p>
            </div>
          </div>
        ) : (
          <QrReader
            onResult={handleResult}
            constraints={{ facingMode: 'environment' }}
            containerStyle={{ width: '100%', height: '100%' }}
            videoStyle={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}
      </div>

      {/* The rest of your UI remains unchanged */}
      {ticketStatusMessage && (
        <p className={`h5 fw-bold ${ticketStatusMessage.includes('Valid') ? 'text-success' : 'text-danger'}`}>
          {ticketStatusMessage}
        </p>
      )}

      {scannedTicket && (
        <div className="card bg-light rounded-3 p-3 w-100 text-dark mt-3">
          <h3 className="h5 fw-bold mb-2">Validated Ticket</h3>
          <p className="fs-5 mb-1">
            <strong>Name:</strong> {scannedTicket.name || scannedTicket.passengers?.[0]?.fullName}
          </p>
          <p className="fs-5 mb-0">
            <strong>Destination:</strong> {scannedTicket.destination}
          </p>
        </div>
      )}
    </div>
  );
};

export default ScanQRCode;