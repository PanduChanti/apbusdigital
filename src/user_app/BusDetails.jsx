import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TrackingImage from '../assets/tracking.png';

const BusDetails = ({ bus: propBus }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const busFromState = location.state?.bus;
  const [bus, setBus] = useState(propBus || busFromState);
  const [status, setStatus] = useState(bus?.status || 'unknown');
  const [nextStop, setNextStop] = useState(bus?.nextStop || 'unknown');
  const [arrivedIn, setArrivedIn] = useState(bus?.arrivedInMins || 0);

  useEffect(() => {
    if (propBus && propBus !== bus) {
      setBus(propBus);
      setStatus(propBus.status || 'unknown');
      setNextStop(propBus.nextStop || 'unknown');
      setArrivedIn(propBus.arrivedInMins || 0);
    } else if (!bus && busFromState) {
      setBus(busFromState);
      setStatus(busFromState.status || 'unknown');
      setNextStop(busFromState.nextStop || 'unknown');
      setArrivedIn(busFromState.arrivedInMins || 0);
    }
    if (!bus && !propBus && !busFromState) {
      navigate('/user/search-buses', { replace: true });
    }
  }, [propBus, busFromState, bus, navigate]);

  useEffect(() => {
    if (!bus) return;
    let statusInterval = setInterval(() => {
      setStatus(prevStatus =>
        prevStatus.includes('running') ? 'stops at Pammaru' : 'running'
      );
      setNextStop(prevStatus =>
        prevStatus.includes('running') ? 'Pammaru' : 'Simulated Next Stop'
      );
      setArrivedIn(prev => Math.max(0, prev - 1));
    }, 10000);

    return () => clearInterval(statusInterval);
  }, [bus]);

  if (!bus) {
    return <div className="text-center text-danger h4 mt-5">Loading bus details or no bus selected.</div>;
  }

  return (
    <div className="container-fluid py-5 bg-light min-vh-100">
      <h1 className="h2 fw-bold text-primary text-center mb-5">🚌 Bus Details & Tracking</h1>

      {/* Tracking Map */}
      <div className="card shadow rounded-4 p-4 mb-4 mx-auto" style={{ maxWidth: '800px' }}>
        <h2 className="h5 fw-bold text-dark mb-3">Live Bus Tracking</h2>
        <div className="text-center">
          <img
            src={TrackingImage}
            alt="Bus Tracking"
            style={{ width: '100%', maxWidth: '600px', height: 'auto', borderRadius: '12px' }}
          />
        </div>
      </div>

      {/* Bus Info */}
      <div className="card shadow rounded-4 p-4 mb-5 mx-auto" style={{ maxWidth: '800px' }}>
        <h2 className="h5 fw-bold text-dark mb-3">Bus Information</h2>
        <div className="row text-muted fs-6">
          <div className="col-md-6 mb-2"><strong>Bus No:</strong> {bus.busNo}</div>
          <div className="col-md-6 mb-2"><strong>Bus Code:</strong> {bus.busCode}</div>
          <div className="col-md-6 mb-2"><strong>Status:</strong> <span className={`fw-semibold ${status.includes('running') ? 'text-success' : 'text-warning'}`}>{status}</span></div>
          <div className="col-md-6 mb-2"><strong>Next Stop:</strong> {nextStop}</div>
          <div className="col-md-6 mb-2"><strong>Arrived in:</strong> {arrivedIn} Mins</div>
          <div className="col-md-6 mb-2"><strong>Type:</strong> {bus.busType}</div>
          <div className="col-md-6 mb-2"><strong>Route:</strong> {bus.source} ➝ {bus.destination}</div>
          <div className="col-md-6 mb-2"><strong>Distance:</strong> {bus.distanceKm} km</div>
        </div>
      </div>

      {/* Book Ticket */}
      <div className="text-center mx-auto" style={{ maxWidth: '800px' }}>
        <button
          onClick={() => {
            navigate('/user/book-ticket', { state: { bus: bus } });
          }}
          className="btn btn-success btn-lg w-100 rounded-pill shadow"
        >
          Book Bus Ticket
        </button>
      </div>
    </div>
  );
};

export default BusDetails;
