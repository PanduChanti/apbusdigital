import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CustomModal from '../components/CustomModal.jsx';
import QRCodeDisplay from './QRCodeDisplay.jsx';

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const bookedTicketDetails = location.state?.bookedTicketDetails;

  const [selectedMethod, setSelectedMethod] = useState('');
  const [showQRModal, setShowQRModal] = useState(false);

  useEffect(() => {
    if (!bookedTicketDetails) {
      navigate('/user/search-buses', { replace: true });
    }
  }, [bookedTicketDetails, navigate]);

  const handlePaymentMethodSelect = (method) => {
    setSelectedMethod(method);
    if (method === 'wallet' || method === 'upi') {
      setShowQRModal(true);
    }
    if (method === 'upi') {
      alert('Simulating UPI Payment. In a real app, this would open UPI app or show QR for UPI.');
    }
  };

  const closeQRModal = () => {
    setShowQRModal(false);
    navigate('/user');
  };

  if (!bookedTicketDetails) {
    return <div className="text-center text-danger h4 mt-5">Loading payment details or no ticket found.</div>;
  }

  return (
    <div className="container-fluid bg-light min-vh-100 d-flex justify-content-center align-items-center py-5">
      <div className="text-center">
        <h1 className="h2 fw-bold text-primary mb-5">💳 Select Payment Method</h1>

        <div className="card shadow rounded-4 p-4 mx-auto" style={{ maxWidth: '400px', width: '100%' }}>
          <div className="d-grid gap-3">
            <button
              onClick={() => handlePaymentMethodSelect('upi')}
              className={`btn btn-lg rounded-pill fw-semibold shadow-sm 
                          ${selectedMethod === 'upi' ? 'btn-primary' : 'btn-outline-primary'}`}
            >
              Pay via UPI
            </button>
            <button
              onClick={() => handlePaymentMethodSelect('upi')}
              className={`btn btn-lg rounded-pill fw-semibold shadow-sm 
                          ${selectedMethod === 'upi' ? 'btn-primary' : 'btn-outline-primary'}`}
            >
              Cards
            </button>
            <button
              onClick={() => handlePaymentMethodSelect('wallet')}
              className={`btn btn-lg rounded-pill fw-semibold shadow-sm 
                          ${selectedMethod === 'wallet' ? 'btn-primary' : 'btn-outline-primary'}`}
            >
              Pay via Wallet
            </button>
          </div>
        </div>
      </div>

      <CustomModal isOpen={showQRModal} onClose={closeQRModal} title="Payment Successful! Here's Your Ticket QR">
        {bookedTicketDetails ? (
          <QRCodeDisplay ticketDetails={bookedTicketDetails} />
        ) : (
          <p className="text-center text-danger">No ticket details to display QR.</p>
        )}
        <p className="text-center text-muted small mt-4">
          (For demo: In real app, you can download or revisit this ticket.)
        </p>
      </CustomModal>
    </div>
  );
};

export default Payment;
