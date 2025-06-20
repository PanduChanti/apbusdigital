import React, { useState, useEffect, useContext } from 'react';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ScanQRCode from './ScanQRCode.jsx';
import { API_BASE_URL } from '../App.jsx';
import { AppContext } from '../context/AppContext.jsx';
import { v4 as uuidv4 } from 'uuid';

const BusBookedMembers = () => {
  const { userId } = useContext(AppContext);
  const [busCode, setBusCode] = useState('0286452');
  const [bookedTickets, setBookedTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [scannedTicket, setScannedTicket] = useState(null);
  const [ticketStatusMessage, setTicketStatusMessage] = useState('');
  const [showScannerModal, setShowScannerModal] = useState(false);

  const fetchBookedTickets = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/tickets/${busCode}`);
      const data = await response.json();
      setBookedTickets(data);
    } catch (err) {
      setError(`Failed to fetch booked tickets: ${err.message}`);
      setBookedTickets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (busCode) fetchBookedTickets();
    else {
      setBookedTickets([]);
      setError("Please enter a Bus Code.");
    }
    const interval = setInterval(() => {
      if (busCode) fetchBookedTickets();
    }, 15000);
    return () => clearInterval(interval);
  }, [busCode]);

  const handleDestinationArrived = async (destinationToClear) => {
    setLoading(true);
    try {
      await fetch(`${API_BASE_URL}/tickets/expire`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ busCode, destination: destinationToClear }),
      });
      alert(`Tickets for destination ${destinationToClear} marked expired.`);
      fetchBookedTickets();
    } catch (err) {
      setError(`Failed to mark expired: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleScanQR = (qrData) => {
    // Hide the modal immediately upon successful scan
    setShowScannerModal(false);
    setScannedTicket(null);
    try {
      const parsedQR = JSON.parse(qrData);
      if (parsedQR.busCode !== busCode) {
        setTicketStatusMessage('QR Code Not Valid! (Wrong Bus) ❌');
        return;
      }
      const matchedTicket = bookedTickets.find(ticket =>
        ticket._id === parsedQR.ticketId || ticket.id === parsedQR.ticketId
      );
      if (matchedTicket) {
        setScannedTicket(matchedTicket);
        setTicketStatusMessage('Ticket Valid! ✅');
        setTimeout(() => {
          setScannedTicket(null);
          setTicketStatusMessage('');
          alert(`Welcome, ${matchedTicket.name || matchedTicket.passengers?.[0]?.fullName}`);
          fetchBookedTickets();
        }, 2000);
      } else {
        setTicketStatusMessage('QR Code Not Valid! (Not found/expired) ❌');
      }
    } catch {
      setTicketStatusMessage('QR Code Not Valid! (Bad format) ❌');
    }
  };

  const uniqueDestinations = [...new Set(bookedTickets.map(t => t.destination))];

  return (
    <div className="container-fluid py-5 bg-gradient-light-purple min-vh-100">
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
          />
        </div>

        <div className="text-center my-3">
          <button onClick={() => setShowScannerModal(true)} className="btn btn-primary rounded-pill px-4">
            Scan QR Code
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
      {error && <p className="text-danger text-center">{error}</p>}
      {!loading && bookedTickets.length === 0 && !error && (
        <p className="text-center text-muted mt-5">No bookings found for this bus.</p>
      )}

      <div className="row g-4 mx-auto" style={{ maxWidth: '900px' }}>
        {bookedTickets.map((ticket) => (
          <div key={ticket._id || ticket.id || uuidv4()} className="col-12">
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
        <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content rounded-4">
              <div className="modal-header">
                <h5 className="modal-title">Scan QR Code</h5>
                <button type="button" className="btn-close" onClick={() => setShowScannerModal(false)}></button>
              </div>
              <div className="modal-body">
                <ScanQRCode
                  onScan={handleScanQR}
                  scannedTicket={scannedTicket}
                  ticketStatusMessage={ticketStatusMessage}
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