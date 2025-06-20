import React, { useState, useEffect, useContext } from 'react';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ScanQRCode from './ScanQRCode.jsx';
import { API_BASE_URL } from '../App.jsx';
import { AppContext } from '../context/AppContext.jsx';

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
    zIndex: 1055, 
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

const ScanResultDisplay = ({ result, onScanNext, onBackToList }) => {
    if (!result) return null;
    const isSuccess = result.type === 'success';
    const resultStyle = {
        backgroundColor: isSuccess ? '#e9f7ef' : '#fdecea',
        borderColor: isSuccess ? '#28a745' : '#dc3545',
        color: isSuccess ? '#155724' : '#721c24',
    };
    return (
        <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
            <div className="card shadow-lg rounded-4 p-4 p-md-5 text-center" style={{ ...resultStyle, maxWidth: '500px', width: '90%' }}>
                <h2 className="h1 fw-bold mb-3">
                    {isSuccess ? `Ticket Valid ✅` : `Ticket Invalid ❌`}
                </h2>
                <p className="fs-5 mb-4">{result.message}</p>
                <div className="d-grid gap-3">
                    <button onClick={onScanNext} className="btn btn-primary btn-lg rounded-pill">
                        <i className="bi bi-qr-code-scan me-2"></i>Scan Next Ticket
                    </button>
                    <button onClick={onBackToList} className="btn btn-outline-secondary rounded-pill">
                        Back to List
                    </button>
                </div>
            </div>
        </div>
    );
};

const BusBookedMembers = () => {
  const { userId } = useContext(AppContext);
  const [busCode, setBusCode] = useState('0286452');
  const [bookedTickets, setBookedTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ message: '', type: 'info' });
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [lastScanResult, setLastScanResult] = useState(null);
  const [selectedDestination, setSelectedDestination] = useState('');
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => setNotification({ message: '', type: 'info' }), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const fetchBookedTickets = async () => {
    if (!busCode) {
      setBookedTickets([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/tickets/${busCode}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Server responded with ${response.status}`);
      }
      
      const data = await response.json();
      setBookedTickets(data);
      
      // Extract unique destinations
      const uniqueDests = [...new Set(data.map(ticket => ticket.destination))];
      setDestinations(uniqueDests);
      if (uniqueDests.length > 0 && !selectedDestination) {
        setSelectedDestination(uniqueDests[0]);
      }
    } catch (err) {
      setError(`Failed to fetch booked tickets: ${err.message}`);
      setBookedTickets([]);
      setDestinations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookedTickets();
    const interval = setInterval(() => fetchBookedTickets(), 15000);
    return () => clearInterval(interval);
  }, [busCode]);
  
  const handleScanQR = (qrData) => {
    setShowScannerModal(false);
    setLoading(true);
    
    try {
      // Parse QR data to get destination
      let scannedDestination;
      try {
        const ticketData = JSON.parse(qrData);
        scannedDestination = ticketData.destination;
      } catch (parseErr) {
        // If parsing fails, try to extract destination from the string
        if (qrData.includes('destination')) {
          const match = qrData.match(/"destination":"([^"]+)"/);
          scannedDestination = match ? match[1] : qrData;
        } else {
          scannedDestination = qrData;
        }
      }

      if (!scannedDestination) {
        throw new Error('Destination not found in QR data');
      }
      
      // Normalize destination names for comparison
      const normalizedScannedDest = scannedDestination.trim().toLowerCase();
      const normalizedSelectedDest = selectedDestination.trim().toLowerCase();
      
      // Check if scanned destination matches selected destination
      if (normalizedScannedDest !== normalizedSelectedDest) {
        throw new Error(`Ticket is for ${scannedDestination}, not current destination ${selectedDestination}`);
      }
      
      // Find the ticket in our current list by destination
      const ticket = bookedTickets.find(t => {
        const ticketDest = t.destination || '';
        return ticketDest.trim().toLowerCase() === normalizedScannedDest;
      });
      
      if (!ticket) {
        throw new Error(`No ticket found for destination ${scannedDestination}`);
      }
      
      // Perform validation checks
      if (ticket.status === 'Validated') {
        throw new Error('Ticket already validated');
      }
      
      if (ticket.status === 'Expired') {
        throw new Error('Ticket has expired');
      }
      
      // If all checks pass, mark as valid
      setLastScanResult({ 
        type: 'success', 
        message: `Ticket for ${scannedDestination} is valid!`
      });
      
      // Update local state to mark as validated
      setBookedTickets(currentTickets =>
        currentTickets.map(t => 
          t._id === ticket._id 
            ? {...t, status: 'Validated'} 
            : t
        )
      );
      
    } catch (err) {
      setLastScanResult({ 
        type: 'error', 
        message: err.message || 'Ticket validation failed'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleScanNext = () => {
    setLastScanResult(null);
    setShowScannerModal(true);
  }
  
  const handleBackToList = () => {
    setLastScanResult(null);
  }

  const handleDestinationArrived = async () => {
    if (!selectedDestination || !busCode) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/tickets/expire`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          busCode: busCode,
          destination: selectedDestination
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to expire destination tickets');
      }
      
      // Refresh tickets after expiration
      fetchBookedTickets();
      setNotification({ 
        message: `All tickets for ${selectedDestination} have been expired.`, 
        type: 'success' 
      });
      
    } catch (err) {
      setNotification({ 
        message: err.message || 'Failed to expire tickets', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-5 bg-gradient-light-purple min-vh-100">
      <Notification 
        message={notification.message} 
        type={notification.type}
        onDismiss={() => setNotification({ message: '', type: 'info' })}
      />
      <h1 className="h2 fw-bold text-purple mb-4 text-center">Bus Booked Members</h1>

      {lastScanResult ? (
        <ScanResultDisplay
          result={lastScanResult}
          onScanNext={handleScanNext}
          onBackToList={handleBackToList}
        />
      ) : (
        <>
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
              <button 
                onClick={() => setShowScannerModal(true)} 
                className="btn btn-primary rounded-pill px-4 shadow-sm me-2"
              >
                <i className="bi bi-qr-code-scan me-2"></i>Scan QR Code
              </button>
            </div>
            
            {destinations.length > 0 && (
              <div className="mt-4 pt-3 border-top">
                <h3 className="h5 fw-bold text-center mb-3">Mark Destination Arrived</h3>
                
                <div className="d-flex flex-wrap justify-content-center align-items-center gap-2 mb-3">
                  <label className="form-label fw-bold mb-0">Current Destination:</label>
                  <select 
                    value={selectedDestination}
                    onChange={(e) => setSelectedDestination(e.target.value)}
                    className="form-select rounded-pill text-center"
                    style={{ maxWidth: '200px' }}
                  >
                    {destinations.map(dest => (
                      <option key={dest} value={dest}>{dest}</option>
                    ))}
                  </select>
                </div>
                
                <div className="text-center">
                  <button 
                    onClick={handleDestinationArrived}
                    className="btn btn-danger rounded-pill px-4 shadow-sm"
                  >
                    <i className="bi bi-geo-alt-fill me-2"></i>Destination Arrived
                  </button>
                  <p className="text-muted small mt-2 mb-0">
                    This will expire all tickets for {selectedDestination}
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {loading && <LoadingSpinner />}
          
          {error && (
            <div className="alert alert-danger mx-auto text-center" style={{ maxWidth: '700px' }}>
              {error}
            </div>
          )}
          
          <div className="row g-4 mx-auto" style={{ maxWidth: '900px' }}>
            {bookedTickets.length === 0 ? (
              <div className="col-12 text-center">
                <div className="card shadow-sm rounded-4 p-5">
                  <h3 className="text-muted">No tickets found for bus code: {busCode}</h3>
                  <p className="text-muted">Make sure you entered the correct bus code</p>
                </div>
              </div>
            ) : (
              bookedTickets.map((ticket) => (
                <div key={ticket._id} className="col-12">
                  <div className={`card shadow-sm rounded-4 p-4 ${
                    ticket.status === 'Validated' ? 'border-primary border-2' : 
                    ticket.status === 'Expired' ? 'border-danger border-2' : ''
                  }`}>
                    <div className="text-dark text-center text-md-start">
                      <h3 className="h5 fw-semibold mb-1">Name: {ticket.name || 'N/A'}</h3>
                      <p className="fs-5 mb-0">Destination: {ticket.destination || 'N/A'}</p>
                      <p className="text-muted mb-0">Persons: {ticket.totalPersons || 0}</p>
                      <p className="text-muted small mb-0">Ticket ID: {ticket._id}</p>
                      <p className={`fw-bold mb-0 ${
                        ticket.status === 'Validated' ? 'text-primary' : 
                        ticket.status === 'Expired' ? 'text-danger' : 'text-success'
                      }`}>
                        Status: {ticket.status || 'Booked'}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {showScannerModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content rounded-4">
              <div className="modal-header">
                <h5 className="modal-title">Scan QR Code</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowScannerModal(false)}
                ></button>
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