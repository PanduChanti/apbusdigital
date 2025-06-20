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

      // Prioritize backend's _id or id for ticketId if available, else use a new UUID
      const uniqueTicketIdentifier = ticketDetails._id || ticketDetails.id || uuidv4();

      const qrData = JSON.stringify({
        busNo: ticketDetails.busNo,
        busCode: ticketDetails.busCode,
        source: ticketDetails.source,
        destination: ticketDetails.destination,
        totalFare: ticketDetails.totalFare,
        passengers: ticketDetails.passengers.length, // Number of passengers
        ticketId: uniqueTicketIdentifier, // IMPORTANT: Use backend's ID if present
        userId: userId || 'anonymous',
        timestamp: new Date().toISOString()
      });

      console.log("[QRCodeDisplay] Generating QR for data:", qrData);

      if (window.QRCode) {
        new window.QRCode(qrCodeRef.current, {
          text: qrData,
          width: 256,
          height: 256,
          colorDark : "#000000",
          colorLight : "#ffffff",
          correctLevel : window.QRCode.CorrectLevel.H
        });
      } else {
        console.error("qrcode.js library not loaded.");
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
    <div className={`card shadow-sm rounded-4 p-4 mx-auto text-center ${isExpired ? 'opacity-50 grayscale' : ''}`} style={{ maxWidth: '350px' }}>
      <h2 className="h4 fw-bold text-dark mb-4">Your E-Ticket QR Code</h2>

      <div className="d-flex justify-content-center mb-4 position-relative">
        <div ref={qrCodeRef} className="p-2 border border-secondary rounded-3 bg-white"></div>
        {isExpired && (
          <div className="position-absolute top-0 start-0 w-100 h-100 bg-danger bg-opacity-75 rounded-3 d-flex align-items-center justify-content-center">
            <span className="text-white display-5 fw-bold rotate-n-45">EXPIRED</span>
          </div>
        )}
      </div>

      <div className="text-muted fs-5">
        <p><strong>Bus Code:</strong> {ticketDetails.busCode}</p>
        <p><strong>Bus No:</strong> {ticketDetails.busNo}</p>
        <p><strong>Destination:</strong> {ticketDetails.destination}</p>
        <p><strong>Bus Type:</strong> {ticketDetails.busType}</p>
        <p><strong>Amount Paid:</strong> ₹{ticketDetails.totalFare.toFixed(2)}</p>
        <p className="text-success fw-medium mt-3">Arrived in ~30 Mins at {ticketDetails.source} stop</p>
      </div>

      {!isExpired && (
        <button
          onClick={simulateExpiration}
          className="btn btn-danger btn-sm w-100 rounded-pill shadow mt-4"
        >
          Simulate Ticket Expiration
        </button>
      )}
    </div>
  );
};

export default QRCodeDisplay;