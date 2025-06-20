import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext.jsx'; // CORRECTED IMPORT: AppContext from context folder

const ConductorHome = () => {
  const navigate = useNavigate();
  const { userId } = useContext(AppContext);

  const OptionCard = ({ icon, title, path }) => (
    <div className="col">
      <button
        onClick={() => navigate(path)}
        className="card h-100 text-center shadow-sm border-0 rounded-4 p-4 d-flex flex-column justify-content-center align-items-center
                   text-decoration-none text-dark bg-white hover-shadow-lg transition-transform"
        style={{ transform: 'scale(1)', transition: 'transform 0.2s ease-in-out' }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <div className="fs-1 mb-3">{icon}</div>
        <h2 className="fs-4 fw-semibold">{title}</h2>
      </button>
    </div>
  );

  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-gradient-light-purple p-3 w-100">
      <h1 className="display-4 fw-bolder text-purple mb-5 text-center">AP Smart Digital Conductor App</h1>
      <p className="text-muted mb-4">Your Conductor ID: <span className="badge bg-light text-dark font-monospace">{userId}</span></p>
      <div className="row row-cols-1 row-cols-md-2 g-4 w-100" style={{ maxWidth: '800px' }}>
        <OptionCard icon="👨‍👩‍👧‍👦" title="Bus Booked Members" path="/conductor/booked-members" />
        <OptionCard icon="📝" title="Report Product Missing" path="/conductor/report-missing" />
      </div>
    </div>
  );
};

export default ConductorHome;