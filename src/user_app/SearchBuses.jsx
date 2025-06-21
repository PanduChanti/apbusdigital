import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { API_BASE_URL, dummyBuses } from '../App.jsx';

const SearchBuses = () => {
  const navigate = useNavigate();
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchAttempted, setSearchAttempted] = useState(false);

  const handleSearch = async () => {
    setError(null);
    setBuses([]);
    setSearchAttempted(true);

    if (!source && !destination) {
      setError('Please enter a Source and/or Destination to search for buses.');
      return;
    }

    setLoading(true);
    try {
      const filteredBuses = dummyBuses.filter(bus => {
        const matchesSource = source ? bus.source.toLowerCase().includes(source.toLowerCase()) : true;
        const matchesDestination = destination ? bus.destination.toLowerCase().includes(destination.toLowerCase()) : true;
        return matchesSource && matchesDestination;
      });
      setBuses(filteredBuses);
    } catch (err) {
      setError(`Failed to fetch buses: ${err.message}. Please try again.`);
      console.error(err);
      setBuses([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-5 bg-light min-vh-100">
      <h1 className="h2 fw-bold text-primary text-center mb-5">Find Your Bus</h1>

      <div className="card shadow-lg rounded-4 p-4 mx-auto mb-5" style={{ maxWidth: '600px' }}>
        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <input
              type="text"
              placeholder="Enter Source"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="form-control form-control-lg rounded-4"
            />
          </div>
          <div className="col-md-6">
            <input
              type="text"
              placeholder="Enter Destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="form-control form-control-lg rounded-4"
            />
          </div>
        </div>
        <button
          onClick={handleSearch}
          className="btn btn-primary btn-lg w-100 rounded-4"
        >
          Search Buses
        </button>
      </div>

      {loading && <LoadingSpinner />}
      {error && <p className="text-danger text-center">{error}</p>}
      {!loading && searchAttempted && buses.length === 0 && !error && (
        <p className="text-center text-muted fs-5">No buses found for your search criteria. Try different locations.</p>
      )}
      {!loading && !searchAttempted && (
        <p className="text-center text-muted fs-5">Enter Source or Destination to find buses.</p>
      )}

      <div className="row g-4 justify-content-center">
        {buses.map((bus) => (
          <div key={bus.id} className="col-12 col-md-10 col-lg-8">
            <div className="card shadow-sm border-0 rounded-4 p-4 d-flex flex-column flex-md-row justify-content-between align-items-center">
              <div className="text-dark text-center text-md-start mb-3 mb-md-0">
                <h5 className="fw-bold">🚌 Bus No: {bus.busNo}</h5>
                <p className="mb-1"><strong>Bus Code:</strong> {bus.busCode}</p>
                <p className="mb-1 text-muted">{bus.source} → {bus.destination} • {bus.distanceKm} km</p>
                <p className="mb-1 text-muted">Type: {bus.busType}</p>
                <p className="text-success fw-semibold">Arriving in {bus.arrivedInMins} mins</p>
              </div>
              <button
                onClick={() => navigate('/user/bus-details', { state: { bus } })}
                className="btn btn-success btn-lg rounded-pill px-4"
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchBuses;
