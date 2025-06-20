import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { API_BASE_URL } from '../App.jsx'; // Only API_BASE_URL needed, not dummyBuses
import BusDetails from './BusDetails.jsx';

const TrackBus = () => {
  const navigate = useNavigate();
  const [busCode, setBusCode] = useState('');
  const [trackedBus, setTrackedBus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchAttempted, setSearchAttempted] = useState(false);

  const handleTrack = async () => {
    setLoading(true);
    setError(null);
    setTrackedBus(null);
    setSearchAttempted(true); // Mark that a search has been attempted

    if (!busCode) {
        setError("Please enter a Bus Code to track.");
        setLoading(false);
        return;
    }

    console.log(`[TrackBus] Attempting to track bus with code: ${busCode} from ${API_BASE_URL}/track/${busCode}`);
    try {
      const response = await fetch(`${API_BASE_URL}/track/${busCode}`);

      if (!response.ok) {
        let errorBody = {};
        try {
          errorBody = await response.json(); // Try to parse JSON error message
        } catch (e) {
          // If response is not JSON, just use text
          errorBody = { message: await response.text() };
        }
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorBody.message || 'Unknown error'}`);
      }

      const data = await response.json();
      console.log('[TrackBus] Fetched bus data:', data);

      if (data && Object.keys(data).length > 0) { // Check if data is not empty
        setTrackedBus(data);
      } else {
        setError('Bus not found for the entered code. Please check the bus code.');
        setTrackedBus(null); // Explicitly clear if not found
      }
    } catch (err) {
      setError(`Failed to track bus: ${err.message}. Please ensure backend is running and bus code is valid.`);
      console.error('[TrackBus] Fetch error:', err);
      setTrackedBus(null); // Clear bus on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-5 bg-gradient-light-blue min-vh-100">
      <h1 className="h2 fw-bold text-primary mb-4 text-center">Track Bus by Code</h1>

      <div className="card shadow-sm rounded-4 p-4 mb-5 mx-auto" style={{ maxWidth: '500px' }}>
        <input
          type="text"
          placeholder="Enter Bus Code"
          value={busCode}
          onChange={(e) => setBusCode(e.target.value)}
          className="form-control form-control-lg rounded-pill mb-3"
        />
        <button
          onClick={handleTrack}
          className="btn btn-primary btn-lg w-100 rounded-pill shadow"
        >
          Track Bus
        </button>
      </div>

      {loading && <LoadingSpinner />}
      {error && <p className="text-danger text-center mb-4">{error}</p>}

      {!loading && searchAttempted && !trackedBus && !error && (
          <p className="text-center text-muted mt-5">No bus found for the entered code. Try a different bus code.</p>
      )}
      {!loading && trackedBus && (
        <BusDetails bus={trackedBus} />
      )}
    </div>
  );
};

export default TrackBus;