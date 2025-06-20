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
    if (method === 'wallet' || method === 'upi') { // Show QR for both for demo
      setShowQRModal(true);
    }
    // In a real app, UPI would trigger external app/flow
    if (method === 'upi') {
      alert('Simulating UPI Payment. In a real app, this would open UPI app or show QR for UPI.');
    }
  };

  const closeQRModal = () => {
    setShowQRModal(false);
    navigate('/user'); // Go back to user home after showing QR
  };

  if (!bookedTicketDetails) {
    return <div className="text-center text-danger h4 mt-5">Loading payment details or no ticket found.</div>;
  }

  return (
    <div className="container-fluid py-5 bg-gradient-light-blue min-vh-100 d-flex flex-column align-items-center">
      <h1 className="h2 fw-bold text-primary mb-5 text-center">Select Payment Method</h1>

      <div className="card shadow-sm rounded-4 p-4 mb-5 mx-auto" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="d-grid gap-3">
          <button
            onClick={() => handlePaymentMethodSelect('upi')}
            className={`btn btn-lg rounded-pill fw-semibold shadow-sm
                        ${selectedMethod === 'upi' ? 'btn-primary' : 'btn-outline-primary'}`}
          >
            UPI
          </button>
          <button
            onClick={() => handlePaymentMethodSelect('wallet')}
            className={`btn btn-lg rounded-pill fw-semibold shadow-sm
                        ${selectedMethod === 'wallet' ? 'btn-primary' : 'btn-outline-primary'}`}
          >
            Wallet
          </button>
        </div>
      </div>

      <CustomModal isOpen={showQRModal} onClose={closeQRModal} title="Payment Successful! Here's Your Ticket QR">
        {bookedTicketDetails ? (
            <QRCodeDisplay ticketDetails={bookedTicketDetails} />
        ) : (
            <p className="text-center text-danger">No ticket details to display QR.</p>
        )}
        <p className="text-center text-muted small mt-4">
          (For demonstration: A real app would provide a clearer path to view the QR later.)
        </p>
      </CustomModal>
    </div>
  );
};

export default Payment;