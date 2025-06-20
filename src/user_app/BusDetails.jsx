import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TrackingImage from '../assets/tracking.png'; // Import the tracking image

const BusDetails = ({ bus: propBus }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const busFromState = location.state?.bus;

  // Use a single source of truth for the bus object
  const [bus, setBus] = useState(propBus || busFromState);

  // States for bus information display
  const [status, setStatus] = useState(bus?.status || 'unknown');
  const [nextStop, setNextStop] = useState(bus?.nextStop || 'unknown');
  const [arrivedIn, setArrivedIn] = useState(bus?.arrivedInMins || 0);

  // Effect to update the main 'bus' state if a new bus prop or state is provided
  useEffect(() => {
    // Only update if propBus is different from current state, or if state is empty but busFromState exists
    if (propBus && propBus !== bus) {
      setBus(propBus);
      // Re-initialize status/nextStop/arrivedIn when the bus object changes
      setStatus(propBus.status || 'unknown');
      setNextStop(propBus.nextStop || 'unknown');
      setArrivedIn(propBus.arrivedInMins || 0);
    } else if (!bus && busFromState) {
      setBus(busFromState);
      // Re-initialize status/nextStop/arrivedIn when the bus object changes
      setStatus(busFromState.status || 'unknown');
      setNextStop(busFromState.nextStop || 'unknown');
      setArrivedIn(busFromState.arrivedInMins || 0);
    }
    // If no bus data is available at all, navigate away
    if (!bus && !propBus && !busFromState) {
        navigate('/user/search-buses', { replace: true });
    }
  }, [propBus, busFromState, bus, navigate]);

  // Effect for Bus Status, Next Stop, and Arrived In updates (runs independently)
  useEffect(() => {
    // Only set up interval if bus is available
    if (!bus) return;

    let statusInterval = setInterval(() => {
      setStatus(prevStatus => {
        // Toggle status: "running" -> "stops at Pammaru" -> "running"
        if (prevStatus.includes('running')) {
          setNextStop('Pammaru'); // Hardcoded for simplicity
          return `stops at Pammaru`;
        } else {
          setNextStop('Simulated Next Stop'); // Hardcoded for simplicity
          return 'running';
        }
      });
      setArrivedIn(prev => Math.max(0, prev - 1)); // Decrement arrivedIn
    }, 10000); // Update every 10 seconds

    // Cleanup for status interval
    return () => {
      clearInterval(statusInterval);
    };
  }, [bus]); // This effect only depends on the 'bus' object.


  if (!bus) {
    return <div className="text-center text-danger h4 mt-5">Loading bus details or no bus selected.</div>;
  }

  return (
    <div className="container-fluid py-5 bg-gradient-light-blue min-vh-100">
      <h1 className="h2 fw-bold text-primary mb-4 text-center">Bus Details & Tracking</h1>

      <div className="card shadow-sm rounded-4 p-4 mb-4 mx-auto" style={{ maxWidth: '700px' }}>
        <h2 className="h4 fw-bold text-dark mb-3">Bus Tracking</h2>
        <div className="map-image-container" style={{ textAlign: 'center', borderRadius: '8px', overflow: 'hidden' }}>
          {/*
            Replaced the problematic Googleusercontent URL with a placeholder image from placehold.co
            that clearly indicates a bus tracking map with start and next stop.
            The onerror handler remains for robust error handling.
          */}
          <img
            src={TrackingImage}
            alt="Bus Tracking Map"
            style={{ maxWidth: '50%', maxheight: '45%', borderRadius: '8px' }}
         
          />
        </div>
       
      </div>

      <div className="card shadow-sm rounded-4 p-4 mb-5 mx-auto" style={{ maxWidth: '700px' }}>
        <h2 className="h4 fw-bold text-dark mb-3">Bus Information</h2>
        <div className="text-muted fs-5">
          <p><strong>Bus No:</strong> {bus.busNo}</p>
          <p><strong>Bus Code:</strong> {bus.busCode}</p>
          <p><strong>Status:</strong> <span className={`fw-semibold ${status.includes('running') ? 'text-success' : 'text-warning'}`}>{status}</span></p>
          <p><strong>Next Stop:</strong> {nextStop}</p>
          <p><strong>Arrived in:</strong> {arrivedIn} Mins</p>
          <p><strong>Type:</strong> {bus.busType}</p>
          <p><strong>Route:</strong> {bus.source} to {bus.destination}</p>
          <p><strong>Distance:</strong> {bus.distanceKm} km</p>
        </div>
      </div>

      <div className="text-center mx-auto" style={{ maxWidth: '700px' }}>
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
