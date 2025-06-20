import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import ConductorHome from './ConductorHome.jsx';
import BusBookedMembers from './BusBookedMembers.jsx';
import ReportMissingProduct from './ReportMissingProduct.jsx';

const ConductorApp = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    if (location.pathname === '/conductor/booked-members' || location.pathname === '/conductor/report-missing') {
      navigate('/conductor');
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="container-fluid p-0 d-flex flex-column min-vh-100 bg-light position-relative">
      {location.pathname !== '/conductor' && (
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
        <Route path="/" element={<ConductorHome />} />
        <Route path="booked-members" element={<BusBookedMembers />} />
        <Route path="report-missing" element={<ReportMissingProduct />} />
      </Routes>
    </div>
  );
};

export default ConductorApp;