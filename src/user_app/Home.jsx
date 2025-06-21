import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const OptionCard = ({ icon, title, path }) => (
    <div className="col d-flex justify-content-center">
      <button
        onClick={() => navigate(path)}
        className="card text-center shadow-sm border-0 rounded-4 p-4 d-flex flex-column justify-content-center align-items-center
                   text-decoration-none text-dark bg-white hover-shadow-lg transition-transform"
        style={{
          width: '100%',
          maxWidth: '250px',
          transform: 'scale(1)',
          transition: 'transform 0.2s ease-in-out'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <div className="fs-1 mb-3">{icon}</div>
        <h2 className="fs-5 fw-semibold mb-0">{title}</h2>
      </button>
    </div>
  );

  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-gradient-light-blue p-3 w-100">
      <h1 className="display-4 fw-bolder text-primary mb-2 text-center" style={{ fontSize: '25px' }}>
        Prototype: AP Bus Digital Smart Local
      </h1>
      <p className="text-muted text-center mb-4" style={{ fontSize: '14px' }}>
        Powered by Apk Innovations
      </p>

      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-2 g-4 w-100 justify-content-center" style={{ maxWidth: '900px' }}>
        <OptionCard icon="🚌" title="Search Buses" path="/user/search-buses" />
        <OptionCard icon="📍" title="Tracking Bus" path="/user/track-bus" />
        <OptionCard icon="🎓" title="Student Pass" path="/user/student-pass" />
        <OptionCard icon="🎒" title="Missing Products" path="/user/missing-products" />
        <OptionCard icon="👩‍🦺" title="Women & Safety Companion Mode" path="/user/safety-companion" />
        <OptionCard icon="🎫" title="Smart Pass (Unlimited Rides)" path="/user/smart-pass" />
      </div>
    </div>
  );
};

export default Home;
