import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Home from './Home.jsx';
import SearchBuses from './SearchBuses.jsx';
import BusDetails from './BusDetails.jsx';
import BookTicket from './BookTicket.jsx';
import Payment from './Payment.jsx';
import QRCodeDisplay from './QRCodeDisplay.jsx';
import TrackBus from './TrackBus.jsx';
import StudentPass from './StudentPass.jsx';
import MissingProducts from './MissingProducts.jsx';

const UserApp = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    if (location.pathname === '/user/search-buses' || location.pathname === '/user/track-bus' ||
        location.pathname === '/user/student-pass' || location.pathname === '/user/missing-products') {
      navigate('/user');
    } else if (location.pathname === '/user/bus-details') {
      navigate('/user/search-buses');
    } else if (location.pathname === '/user/book-ticket') {
      // For BookTicket, ensure we pass the bus details back if available
      navigate('/user/bus-details', { state: { bus: location.state?.bus } });
    } else if (location.pathname === '/user/payment') {
      // For Payment, ensure we pass ticket details back if available
      navigate('/user/book-ticket', { state: { bus: location.state?.busForBooking, bookedTicketDetails: location.state?.bookedTicketDetails } });
    } else if (location.pathname === '/user/qrcode-display') {
      navigate('/user/payment', { state: { bookedTicketDetails: location.state?.bookedTicketDetails } });
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="container-fluid p-0 d-flex flex-column min-vh-100 bg-light position-relative">
      {location.pathname !== '/user' && (
        <div className="position-absolute top-0 start-0 p-3" style={{ zIndex: 1000 }}>
          <button
            onClick={handleBack}
            className="btn btn-secondary rounded-pill shadow-sm"
          >
            &larr; Back
          </button>
        </div>
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="search-buses" element={<SearchBuses />} />
        <Route path="track-bus" element={<TrackBus />} />
        <Route path="student-pass" element={<StudentPass />} />
        <Route path="missing-products" element={<MissingProducts />} />
        <Route path="bus-details" element={<BusDetails />} />
        <Route path="book-ticket" element={<BookTicket />} />
        <Route path="payment" element={<Payment />} />
        <Route path="qrcode-display" element={<QRCodeDisplay />} />
      </Routes>
    </div>
  );
};

export default UserApp;