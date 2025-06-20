import React, { useState, useEffect, useContext } from 'react';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ScanQRCode from './ScanQRCode.jsx'; // Using the new scanner component
import { API_BASE_URL } from '../App.jsx';
import { AppContext } from '../context/AppContext.jsx';

// A simple component for displaying non-blocking notifications
const Notification = ({ message, type, onDismiss }) => {
  if (!message) return null;

  const baseStyle = {
    position: 'fixed',
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '12px 20px',
    borderRadius: '8px',
    color: 'white',
    zIndex: 1055, // Higher than Bootstrap modal z-index
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
    fontWeight: '500',
    cursor: 'pointer',
  };

  const typeStyle = {
    success: { backgroundColor: '#28a745' },
    error: { backgroundColor: '#dc3545' },
    info: { backgroundColor: '#17a2b8' },
  };

  return (
    <div style={{ ...baseStyle, ...typeStyle[type] }} onClick={onDismiss}>
      {message}
    </div>
  );
};

const BusBookedMembers = () => {
  const { userId } = useContext(AppContext);
  const [busCode, setBusCode] = useState('0286452'); // Default bus code for example
  const [bookedTickets, setBookedTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // State for the notification system
  const [notification, setNotification] = useState({ message: '', type: 'info' });

  // State to control the scanner modal visibility
  const [showScannerModal, setShowScannerModal] = useState(false);

  // Effect to automatically dismiss the notification after 4 seconds
  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({ message: '', type: 'info' });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const fetchBookedTickets = async () => {
    if (!busCode) {
      setBookedTickets([]);
      setError("Please enter a Bus Code.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/tickets/${busCode}`);
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
      const data = await response.json();
      setBookedTickets(data);
    } catch (err) {
      setError(`Failed to fetch booked tickets: ${err.message}`);
      setBookedTickets([]);
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch tickets when busCode changes and then poll every 15 seconds
  useEffect(() => {
    fetchBookedTickets(); // Initial fetch

    const interval = setInterval(() => {
      fetchBookedTickets();
    }, 15000); // Poll every 15 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount or busCode change
  }, [busCode]);

  const handleDestinationArrived = async (destinationToClear) => {
    setLoading(true);
    try {
      await fetch(`${API_BASE_URL}/tickets/expire`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ busCode, destination: destinationToClear }),
      });
      setNotification({ message: `Tickets for destination ${destinationToClear} marked expired.`, type: 'info' });
      fetchBookedTickets(); // Refresh the list
    } catch (err) {
      setNotification({ message: `Failed to mark expired: ${err.message}`, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleScanQR = (qrData) => {
    try {
      const parsedQR = JSON.parse(qrData);
      if (parsedQR.busCode !== busCode) {
        setNotification({ message: 'QR Code Not Valid! (Wrong Bus) ❌', type: 'error' });
        return;
      }
      const matchedTicket = bookedTickets.find(ticket =>
        ticket._id === parsedQR.ticketId || ticket.id === parsedQR.ticketId
      );

      if (matchedTicket) {
        setNotification({ message: `Welcome, ${matchedTicket.name || matchedTicket.passengers?.[0]?.fullName}! ✅`, type: 'success' });
        fetchBookedTickets();
      } else {
        setNotification({ message: 'QR Code Not Valid! (Not found/expired) ❌', type: 'error' });
      }
    } catch {
      setNotification({ message: 'QR Code Not Valid! (Bad format) ❌', type: 'error' });
    }
  };

  const uniqueDestinations = [...new Set(bookedTickets.map(t => t.destination))];

  return (
    <div className="container-fluid py-5 bg-gradient-light-purple min-vh-100">
      <Notification 
        message={notification.message} 
        type={notification.type}
        onDismiss={() => setNotification({ message: '', type: 'info' })}
      />

      <h1 className="h2 fw-bold text-purple mb-4 text-center">Bus Booked Members</h1>

      <div className="card shadow-sm rounded-4 p-4 mb-5 mx-auto" style={{ maxWidth: '700px' }}>
        <div className="d-flex align-items-center justify-content-center mb-3">
          <label htmlFor="conductorBusCode" className="form-label fw-bold mb-0 me-3">Your Bus Code:</label>
          <input
            type="text"
            id="conductorBusCode"
            value={busCode}
            onChange={(e) => setBusCode(e.target.value)}
            className="form-control rounded-pill text-center fw-bold"
            style={{ maxWidth: '150px' }}
            placeholder="Enter Bus Code"
          />
        </div>

        <div className="text-center my-3">
          <button onClick={() => setShowScannerModal(true)} className="btn btn-primary rounded-pill px-4 shadow-sm">
            <i className="bi bi-qr-code-scan me-2"></i>Scan QR Code
          </button>
        </div>

        {uniqueDestinations.length > 0 && (
          <div className="mt-4 border-top pt-4">
            <p className="text-dark fw-semibold mb-3 text-center">Mark Tickets Expired for Destination:</p>
            <div className="row g-2">
              {uniqueDestinations.map(dest => (
                <div key={dest} className="col-sm-6">
                  <button
                    onClick={() => handleDestinationArrived(dest)}
                    className="btn btn-danger btn-sm w-100 rounded-pill shadow-sm"
                  >
                    Arrived at {dest}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {loading && <LoadingSpinner />}
      {error && <p className="text-danger text-center fw-bold">{error}</p>}
      {!loading && bookedTickets.length === 0 && (
        <p className="text-center text-muted mt-5 fs-5">{busCode ? "No bookings found for this bus." : "Enter a bus code to see bookings."}</p>
      )}

      <div className="row g-4 mx-auto" style={{ maxWidth: '900px' }}>
        {bookedTickets.map((ticket, index) => (
          <div key={ticket._id || ticket.id || index} className="col-12">
            <div className="card shadow-sm rounded-4 p-4">
              <div className="text-dark text-center text-md-start">
                <h3 className="h5 fw-semibold mb-1">Name: {ticket.name || ticket.passengers?.[0]?.fullName || 'N/A'}</h3>
                <p className="fs-5 mb-0">Destination: {ticket.destination || 'N/A'}</p>
                <p className="text-muted mb-0">Persons: {ticket.totalPersons || ticket.passengers?.length || 0}</p>
                <p className="text-muted small mb-0">Ticket ID: {ticket._id || ticket.id}</p>
                <p className="fw-bold mb-0 text-success">Status: Booked</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showScannerModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content rounded-4">
              <div className="modal-header">
                <h5 className="modal-title">Scan QR Code</h5>
                <button type="button" className="btn-close" onClick={() => setShowScannerModal(false)}></button>
              </div>
              <div className="modal-body p-0">
                <ScanQRCode
                  onScan={handleScanQR}
                  onClose={() => setShowScannerModal(false)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusBookedMembers;