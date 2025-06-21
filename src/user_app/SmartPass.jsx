import React, { useState, useRef, useEffect } from 'react';

const SmartPass = () => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [showTicket, setShowTicket] = useState(false);
  const qrRef = useRef(null);
  const [validUntil, setValidUntil] = useState('');

  const fare = 100;

  const handlePayment = () => {
    if (!source || !destination) {
      alert('Please enter both source and destination.');
      return;
    }

    const validTime = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    const formatted = validTime.toLocaleString();
    setValidUntil(formatted);
    setShowTicket(true);

    setTimeout(() => {
      if (qrRef.current && window.QRCode) {
        qrRef.current.innerHTML = ''; // clear old QR
        const qrData = JSON.stringify({
          source,
          destination,
          validUntil: formatted,
        });

        new window.QRCode(qrRef.current, {
          text: qrData,
          width: 200,
          height: 200,
          colorDark: '#000',
          colorLight: '#fff',
          correctLevel: window.QRCode.CorrectLevel.H,
        });
      }
    }, 100);
  };

  return (
    <div className="container py-5 min-vh-100 bg-light text-center">
      <h2 className="mb-4 text-primary fw-bold">🎫 Smart Pass (Unlimited Rides for 24 Hours)</h2>
      <p className="text-muted mb-4">
        Buy one ticket — it's valid for <strong>24 hours only</strong>. You can travel from source to destination <strong>multiple times</strong> within this period.
      </p>

      <div className="row justify-content-center mb-4">
        <div className="col-md-4 mb-3">
          <input
            type="text"
            placeholder="Enter Source"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="form-control rounded-pill shadow-sm"
          />
        </div>
        <div className="col-md-4 mb-3">
          <input
            type="text"
            placeholder="Enter Destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="form-control rounded-pill shadow-sm"
          />
        </div>
      </div>

      <p className="fs-5 mb-3"><strong>Fare:</strong> ₹{fare}</p>
      <button onClick={handlePayment} className="btn btn-success rounded-pill px-5 py-2 shadow">
        Pay ₹{fare}
      </button>

      {showTicket && (
        <div className="card shadow-sm rounded-4 p-4 mt-5 mx-auto" style={{ maxWidth: '400px' }}>
          <h4 className="fw-bold mb-3 text-success">🎟️ Your Smart Pass Ticket</h4>

          <p className="text-danger small mb-3">
            🔁 This ticket will automatically expire after 24 hours from the time of purchase.
          </p>

          <div className="mb-3">
            <div ref={qrRef} className="d-inline-block p-2 border rounded bg-white"></div>
          </div>

          <p className="mb-1"><strong>Source:</strong> {source}</p>
          <p className="mb-1"><strong>Destination:</strong> {destination}</p>
          <p className="mb-0"><strong>Valid Until:</strong> {validUntil}</p>
        </div>
      )}
    </div>
  );
};

export default SmartPass;
