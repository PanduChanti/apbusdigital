import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { API_BASE_URL } from '../App.jsx';
import { v4 as uuidv4 } from 'uuid';

const MissingProducts = () => {
  const [busCode, setBusCode] = useState('');
  const [missingItems, setMissingItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dummyMissingItems = [
    {
      id: uuidv4(),
      busCode: '038038',
      item: 'Red Backpack',
      description: 'Please collect from the Destination Bus stand Store',
      found: false,
      reportedBy: 'Passenger A',
      date: '2024-06-15'
    },
    {
      id: uuidv4(),
      busCode: '038038',
      item: 'Black Phone',
      description: 'Please collect from the Destination Bus stand Store',
      found: false,
      reportedBy: 'Conductor',
      date: '2024-06-16'
    },
    {
      id: uuidv4(),
      busCode: '038038',
      item: 'Lunch Box',
      description: 'Please collect from the Destination Bus stand Store',
      found: true,
      foundBy: 'Conductor B',
      date: '2024-06-16'
    },
    {
      id: uuidv4(),
      busCode: '123456',
      item: 'Umbrella',
      description: 'Please collect from the Destination Bus stand Store',
      found: false,
      reportedBy: 'Passenger C',
      date: '2024-06-14'
    },
  ];

  const handleSearchMissingItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const filteredItems = dummyMissingItems.filter(item =>
        (busCode ? item.busCode === busCode : true)
      );
      setMissingItems(filteredItems);
    } catch (err) {
      setError('Failed to fetch missing items. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMissingItems(dummyMissingItems);
  }, []);

  return (
    <div className="container-fluid py-5 bg-gradient-light-blue min-vh-100">
      <h1 className="h2 fw-bold text-primary mb-4 text-center">Missing Products</h1>

      <div className="card shadow-sm rounded-4 p-4 mb-5 mx-auto" style={{ maxWidth: '500px' }}>
        <div className="row g-3">
          <div className="col-12">
            <input
              type="text"
              placeholder="Bus Code (Optional)"
              value={busCode}
              onChange={(e) => setBusCode(e.target.value)}
              className="form-control rounded-pill"
            />
          </div>
          <div className="col-12">
            <button
              onClick={handleSearchMissingItems}
              className="btn btn-primary btn-lg w-100 rounded-pill shadow"
            >
              Search Missing Items
            </button>
          </div>
        </div>
      </div>

      {loading && <LoadingSpinner />}
      {error && <p className="text-danger text-center mb-4">{error}</p>}

      {!loading && missingItems.length === 0 && (
        <p className="text-center text-muted mt-5">No missing products found for this criteria.</p>
      )}

      <div className="row g-4 mx-auto" style={{ maxWidth: '900px' }}>
        {missingItems.map((item) => (
          <div key={item.id} className="col-12">
            <div className="card shadow-sm rounded-4 p-4 d-flex flex-column flex-md-row align-items-center justify-content-between border-0">
              <div className="d-flex align-items-center mb-3 mb-md-0 me-md-3">
                <img
                  src={`https://via.placeholder.com/80?text=${encodeURIComponent(item.item)}`}
                  alt={item.item}
                  className="rounded-circle me-3"
                  style={{ width: '80px', height: '80px', objectFit: 'cover', border: '2px solid #ccc' }}
                />
                <div className="text-dark text-center text-md-start">
                  <h3 className="h5 fw-semibold mb-1">Item: {item.item}</h3>
                  <p className="fs-5 mb-0">Bus Code: {item.busCode}</p>
                  <p className="text-muted mb-0">Description: {item.description}</p>
                  <p className={`fw-medium mb-0 ${item.found ? 'text-success' : 'text-danger'}`}>
                    Status: {item.found ? 'Found' : 'Missing'}
                  </p>
                  {item.reportedBy && (
                    <p className="text-muted small mb-0">
                      Reported By: {item.reportedBy} on {item.date}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MissingProducts;
