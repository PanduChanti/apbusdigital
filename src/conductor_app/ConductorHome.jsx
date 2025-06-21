import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext.jsx';

const ConductorHome = () => {
  const navigate = useNavigate();
  const { userId } = useContext(AppContext);

  const OptionCard = ({ icon, title, path }) => (
    <div className="col">
      <button
        onClick={() => navigate(path)}
        className="card h-100 shadow-sm border-0 rounded-4 p-4 text-center bg-white text-dark 
                   d-flex flex-column justify-content-center align-items-center transition"
        style={{ transition: 'transform 0.2s ease-in-out' }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
        <div className="fs-1 mb-3">{icon}</div>
        <h2 className="fs-5 fw-semibold">{title}</h2>
      </button>
    </div>
  );

  return (
    <div className="container-fluid d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light p-4">
      <h1 className="display-5 fw-bold text-primary text-center mb-3">🚍 AP Smart Digital Conductor</h1>
      <p className="text-muted text-center mb-4">
        Your Conductor ID:&nbsp;
        <span className="badge bg-secondary text-white fw-normal">{userId}</span>
      </p>

      <div className="row row-cols-1 row-cols-md-2 g-4 w-100" style={{ maxWidth: '800px' }}>
        <OptionCard icon="👨‍👩‍👧‍👦" title="Bus Booked Members" path="/conductor/booked-members" />
        <OptionCard icon="📦❌" title="Report Missing Product" path="/conductor/report-missing" />
      </div>
    </div>
  );
};

export default ConductorHome;
