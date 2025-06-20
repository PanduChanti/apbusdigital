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

      // IMPORTANT: Use the backend's unique ID for the ticket. This is critical for validation.
      const uniqueTicketIdentifier = ticketDetails._id || ticketDetails.id;

      if (!uniqueTicketIdentifier) {
        console.error("[QRCodeDisplay] CRITICAL: Ticket details are missing a unique '_id' or 'id'. QR code may not validate correctly.");
      }

      const qrData = JSON.stringify({
        ticketId: uniqueTicketIdentifier, // This is the most important field for matching.
        busCode: ticketDetails.busCode,
        destination: ticketDetails.destination,
        passengers: ticketDetails.passengers.length,
        // Add any other data you might want to display on the scanner's screen
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

  // This is a local simulation and does not affect the backend status.
  const simulateExpiration = () => {
    setIsExpired(true);
  };

  if (!ticketDetails) {
    return <p className="text-danger text-center">No ticket details provided for QR code generation.</p>;
  }

  return (
    <div className={`card shadow-sm rounded-4 p-4 mx-auto text-center ${isExpired ? 'opacity-50' : ''}`} style={{ maxWidth: '350px' }}>
      <h2 className="h4 fw-bold text-dark mb-4">Your E-Ticket QR Code</h2>

      <div className="d-flex justify-content-center mb-4 position-relative">
        <div ref={qrCodeRef} className="p-2 border border-secondary rounded-3 bg-white"></div>
        {isExpired && (
          <div className="position-absolute top-0 start-0 w-100 h-100 bg-secondary bg-opacity-75 rounded-3 d-flex align-items-center justify-content-center">
            <span className="text-white display-5 fw-bold" style={{ transform: 'rotate(-15deg)' }}>EXPIRED</span>
          </div>
        )}
      </div>

      <div className="text-muted fs-5">
        <p><strong>Bus Code:</strong> {ticketDetails.busCode}</p>
        <p><strong>Bus No:</strong> {ticketDetails.busNo}</p>
        <p><strong>Destination:</strong> {ticketDetails.destination}</p>
        <p><strong>Amount Paid:</strong> ₹{ticketDetails.totalFare.toFixed(2)}</p>
        <p className="text-success fw-medium mt-3">Arriving in ~30 Mins at {ticketDetails.source} stop</p>
      </div>
      
      {!isExpired && (
        <button
          onClick={simulateExpiration}
          className="btn btn-warning btn-sm w-100 rounded-pill shadow mt-4"
        >
          Simulate Manual Expiration
        </button>
      )}
    </div>
  );
};

export default QRCodeDisplay;