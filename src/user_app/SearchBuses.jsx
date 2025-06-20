import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { API_BASE_URL, dummyBuses } from '../App.jsx'; // Imports dummyBuses from App.jsx

const SearchBuses = () => {
  const navigate = useNavigate();
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchAttempted, setSearchAttempted] = useState(false); // Renamed from initialSearchDone for clarity

  const handleSearch = async () => {
    setError(null);
    setBuses([]); // Clear previous results
    setSearchAttempted(true); // Mark that a search was attempted

    // If both fields are empty, show an error and stop
    if (!source && !destination) {
      setError('Please enter a Source and/or Destination to search for buses.');
      return;
    }

    setLoading(true);
    try {
      // In a real application, you would make an API call like this:
      // const response = await fetch(`${API_BASE_URL}/buses?source=${source}&destination=${destination}`);
      // if (!response.ok) {
      //   const errorBody = await response.json();
      //   throw new Error(`HTTP error! status: ${response.status}, message: ${errorBody.message || JSON.stringify(errorBody)}`);
      // }
      // const data = await response.json();
      // setBuses(data);

      // Using the comprehensive dummyBuses from App.jsx for filtering
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
    <div className="container-fluid py-5 bg-gradient-light-blue min-vh-100">
      <h1 className="h2 fw-bold text-primary mb-4 text-center">Search Buses</h1>

      <div className="card shadow-sm rounded-4 p-4 mb-5 mx-auto" style={{ maxWidth: '500px' }}>
        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <input
              type="text"
              placeholder="Source"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="form-control form-control-lg rounded-pill"
            />
          </div>
          <div className="col-md-6">
            <input
              type="text"
              placeholder="Destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="form-control form-control-lg rounded-pill"
            />
          </div>
        </div>
        <button
          onClick={handleSearch}
          className="btn btn-primary btn-lg w-100 rounded-pill shadow"
        >
          Search Buses
        </button>
      </div>

      {loading && <LoadingSpinner />}
      {error && <p className="text-danger text-center mb-4">{error}</p>}

      {!loading && searchAttempted && buses.length === 0 && !error && (
        <p className="text-center text-muted mt-5">No buses found for your search criteria. Please try different locations.</p>
      )}
      {!loading && !searchAttempted && (
         <p className="text-center text-muted mt-5">Enter Source and/or Destination to find buses.</p>
      )}

      <div className="row g-4 mx-auto" style={{ maxWidth: '900px' }}>
        {buses.map((bus) => (
          <div key={bus.id} className="col-12">
            <div className="card shadow-sm rounded-4 p-4 d-flex flex-column flex-md-row align-items-center justify-content-between border-0">
              <div className="text-dark mb-3 mb-md-0 me-md-3 text-center text-md-start">
                <h3 className="h5 fw-semibold mb-1">Bus No: {bus.busNo}</h3>
                <p className="mb-0 fs-5">Bus Code: {bus.busCode}</p>
                <p className="text-muted mb-0">{bus.source} to {bus.destination} ({bus.distanceKm} km)</p>
                <p className="text-muted mb-0">Type: {bus.busType}</p>
                <p className="text-success fw-medium mb-0">Arrived in {bus.arrivedInMins} Mins</p>
              </div>
              <button
                onClick={() => {
                  navigate('/user/bus-details', { state: { bus: bus } });
                }}
                className="btn btn-success btn-lg rounded-pill shadow-sm flex-shrink-0"
              >
                Book Bus
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchBuses;