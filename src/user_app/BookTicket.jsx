import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { API_BASE_URL } from '../App.jsx'; // API_BASE_URL from App.jsx
import { AppContext } from '../context/AppContext.jsx'; // CORRECTED IMPORT: AppContext from context folder
import { v4 as uuidv4 } from 'uuid';

const BookTicket = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const bus = location.state?.bus;

  const { userId } = useContext(AppContext);
  const [passengers, setPassengers] = useState([{ fullName: '', age: '' }]);
  const [source, setSource] = useState(bus?.source || '');
  const [destination, setDestination] = useState(bus?.destination || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!bus) {
      navigate('/user/search-buses', { replace: true });
      return;
    }
    setSource(bus.source);
    setDestination(bus.destination);
  }, [bus, navigate]);

  const addPassenger = () => {
    setPassengers([...passengers, { fullName: '', age: '' }]);
  };

  const handlePassengerChange = (index, field, value) => {
    const newPassengers = [...passengers];
    newPassengers[index][field] = value;
    setPassengers(newPassengers);
  };

  const calculateFare = () => {
    if (!bus) return 0;
    const baseFare = bus.distanceKm * bus.farePerKm;
    const totalFare = baseFare * passengers.length;
    return totalFare.toFixed(2);
  };

  const handlePayNow = async () => {
    setError(null);
    if (!bus) {
      setError("No bus selected for booking.");
      return;
    }
    if (passengers.some(p => !p.fullName || !p.age)) {
      setError("Please fill in all passenger details.");
      return;
    }
    if (!source || !destination) {
      setError("Source and Destination cannot be empty.");
      return;
    }

    setLoading(true);

    const ticketData = {
      busNo: bus.busNo,
      busCode: bus.busCode,
      busType: bus.busType,
      passengers: passengers.map(p => ({
        fullName: p.fullName,
        age: parseInt(p.age),
      })),
      source,
      destination,
      kms: bus.distanceKm,
      totalFare: parseFloat(calculateFare()),
      bookedAt: new Date().toISOString(),
      status: 'booked',
      userId: userId || 'anonymous',
    };

    console.log("Sending booking data:", ticketData);

    try {
      const response = await fetch(`${API_BASE_URL}/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticketData),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorBody.message || JSON.stringify(errorBody)}`);
      }

      const result = await response.json();
      console.log('Booking successful:', result);
      // Pass the original bus object for booking back to payment route if needed for QR code context
      navigate('/user/payment', { state: { bookedTicketDetails: ticketData, busForBooking: bus } });
    } catch (err) {
      setError(`Booking failed: ${err.message}. Please check console for details.`);
      console.error('Booking error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!bus) {
    return <div className="text-center text-danger h4 mt-5">Loading bus details or no bus selected.</div>;
  }

  return (
    <div className="container-fluid py-5 bg-gradient-light-blue min-vh-100">
      <h1 className="h2 fw-bold text-primary mb-4 text-center">Book Bus Ticket</h1>

      <div className="card shadow-sm rounded-4 p-4 mb-5 mx-auto" style={{ maxWidth: '500px' }}>
        <h2 className="h4 fw-bold text-dark mb-3">Ticket Details</h2>
        <div className="text-muted fs-5 mb-4">
          <p><strong>Bus Code:</strong> {bus.busCode}</p>
          <p><strong>Bus Type:</strong> {bus.busType}</p>
          <p><strong>KMs:</strong> {bus.distanceKm} km</p>
        </div>

        <div className="mb-3">
          <label htmlFor="source" className="form-label fw-bold">Source:</label>
          <input
            type="text"
            id="source"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="form-control rounded-pill"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="destination" className="form-label fw-bold">Destination:</label>
          <input
            type="text"
            id="destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="form-control rounded-pill"
            required
          />
        </div>

        <h3 className="h5 fw-bold text-dark mb-3">Passenger Details</h3>
        {passengers.map((passenger, index) => (
          <div key={index} className="row g-2 mb-3 p-3 border rounded-3 bg-light">
            <div className="col-8">
              <input
                type="text"
                placeholder={`Full Name (Passenger ${index + 1})`}
                value={passenger.fullName}
                onChange={(e) => handlePassengerChange(index, 'fullName', e.target.value)}
                className="form-control rounded-pill"
                required
              />
            </div>
            <div className="col-4">
              <input
                type="number"
                placeholder={`Age`}
                value={passenger.age}
                onChange={(e) => handlePassengerChange(index, 'age', e.target.value)}
                className="form-control rounded-pill"
                required
                min="1"
              />
            </div>
          </div>
        ))}
        <button
          onClick={addPassenger}
          className="btn btn-info btn-sm rounded-pill shadow-sm d-flex align-items-center justify-content-center mb-4"
        >
          <span className="fs-4 me-2">+</span> Add More Members
        </button>

        <div className="d-flex justify-content-between align-items-center bg-light border rounded-3 p-3 mb-4">
          <span className="h5 fw-bold text-dark mb-0">Total Bus Fare:</span>
          <span className="h4 fw-bolder text-success mb-0">₹{calculateFare()}</span>
        </div>

        {error && <p className="text-danger text-center mb-3">{error}</p>}
        {loading && <LoadingSpinner />}

        <button
          onClick={handlePayNow}
          className="btn btn-primary btn-lg w-100 rounded-pill shadow"
          disabled={loading}
        >
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default BookTicket;