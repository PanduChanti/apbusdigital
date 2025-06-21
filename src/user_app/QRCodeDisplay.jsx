import React, { useEffect, useRef, useContext, useState } from 'react';
import { AppContext } from '../context/AppContext.jsx';
import { v4 as uuidv4 } from 'uuid';

const QRCodeDisplay = ({ ticketDetails }) => {
  const { userId } = useContext(AppContext);
  const qrCodeRef = useRef(null);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (qrCodeRef.current && ticketDetails) {
      qrCodeRef.current.innerHTML = '';

      const uniqueTicketIdentifier = ticketDetails._id || ticketDetails.id;

      if (!uniqueTicketIdentifier) {
        console.error("[QRCodeDisplay] CRITICAL: Ticket details are missing a unique '_id' or 'id'. QR code may not validate correctly.");
      }

      const qrData = JSON.stringify({
        ticketId: uniqueTicketIdentifier,
        busCode: ticketDetails.busCode,
        destination: ticketDetails.destination,
        passengers: ticketDetails.passengers.length,
        timestamp: new Date().toISOString(),
        userId: userId || 'anonymous',
      });

      console.log("[QRCodeDisplay] Generating QR for data:", qrData);

      if (window.QRCode) {
        new window.QRCode(qrCodeRef.current, {
          text: qrData,
          width: 256,
          height: 256,
          colorDark: "#000000",
          colorLight: "#ffffff",
          correctLevel: window.QRCode.CorrectLevel.H
        });
      } else {
        console.error("[QRCodeDisplay] qrcode.js library not loaded.");
        qrCodeRef.current.innerText = "Error: QR Code library not loaded.";
      }
    }
  }, [ticketDetails, userId]);

  const simulateExpiration = () => {
    setIsExpired(true);
  };

  if (!ticketDetails) {
    return <p className="text-danger text-center">No ticket details provided for QR code generation.</p>;
  }

  return (
    <div className={`card shadow rounded-4 p-4 mx-auto text-center ${isExpired ? 'opacity-50' : ''}`} style={{ maxWidth: '380px' }}>
      <h2 className="h5 fw-bold text-primary mb-4">🎟️ Your E-Ticket QR Code</h2>

      <div className="position-relative d-flex justify-content-center align-items-center mb-4">
        <div ref={qrCodeRef} className="p-2 bg-white border border-2 rounded-3"></div>
        {isExpired && (
          <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-75 rounded-3">
            <span className="text-white fs-1 fw-bold" style={{ transform: 'rotate(-15deg)' }}>
              EXPIRED
            </span>
          </div>
        )}
      </div>

      <div className="text-muted text-start small px-2">
        <p><strong>🚌 Bus Code:</strong> {ticketDetails.busCode}</p>
        <p><strong>🔢 Bus No:</strong> {ticketDetails.busNo}</p>
        <p><strong>📍 Destination:</strong> {ticketDetails.destination}</p>
        <p><strong>💰 Paid:</strong> ₹{ticketDetails.totalFare.toFixed(2)}</p>
        <p className="text-success fw-semibold mt-3">Arriving in ~30 mins at <strong>{ticketDetails.source}</strong></p>
      </div>

      {!isExpired && (
        <button
          onClick={simulateExpiration}
          className="btn btn-warning btn-sm w-100 rounded-pill mt-4 shadow-sm"
        >
          Simulate Manual Expiration
        </button>
      )}
    </div>
  );
};

export default QRCodeDisplay;
