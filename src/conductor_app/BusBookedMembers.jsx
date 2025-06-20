import React, { useState, useEffect, useContext } from 'react';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import CustomModal from '../components/CustomModal.jsx';
import ScanQRCode from './ScanQRCode.jsx';
import { API_BASE_URL } from '../App.jsx';
import { AppContext } from '../context/AppContext.jsx';
import { v4 as uuidv4 } from 'uuid';

const BusBookedMembers = () => {
  const { userId } = useContext(AppContext);
  const [busCode, setBusCode] = useState('0286452'); // Set default to user's specified bus code
  const [bookedTickets, setBookedTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [scannedTicket, setScannedTicket] = useState(null);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [ticketStatusMessage, setTicketStatusMessage] = useState('');

  const fetchBookedTickets = async () => {
    setLoading(true);
    setError(null);
    console.log(`[BusBookedMembers] Attempting to fetch tickets for busCode: ${busCode} from ${API_BASE_URL}/tickets/${busCode}`);
    try {
      const response = await fetch(`${API_BASE_URL}/tickets/${busCode}`);

      if (!response.ok) {
        let errorBody = {};
        try {
          errorBody = await response.json();
        } catch (e) {
          errorBody = { message: await response.text() };
        }
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorBody.message || 'Unknown error'}`);
      }

      const data = await response.json();
      console.log('[BusBookedMembers] Fetched raw data:', data);

      // Assuming `data` is an array of ticket objects.
      // If backend provides a 'status' field, you can filter here:
      // const activeBookedTickets = data.filter(ticket => ticket.status === 'booked');
      // setBookedTickets(activeBookedTickets);
      // For now, display all data received.
      setBookedTickets(data);
      console.log('[BusBookedMembers] Displaying all fetched tickets:', data);

      if (data.length === 0) {
          console.warn("[BusBookedMembers] No tickets found for this bus code.");
      }

    } catch (err) {
      setError(`Failed to fetch booked tickets: ${err.message}. Please check your backend service and bus code.`);
      console.error('[BusBookedMembers] Fetch error:', err);
      setBookedTickets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (busCode) {
      fetchBookedTickets();
    } else {
      setBookedTickets([]);
      setError("Please enter a Bus Code.");
    }
    const interval = setInterval(() => {
      if (busCode) {
        fetchBookedTickets();
      }
    }, 15000);
    return () => clearInterval(interval);
  }, [busCode]);


  const handleDestinationArrived = async (destinationToClear) => {
    setLoading(true);
    setError(null);
    console.log(`[BusBookedMembers] Marking tickets as expired for busCode: ${busCode}, destination: ${destinationToClear}`);
    try {
      const response = await fetch(`${API_BASE_URL}/tickets/expire`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ busCode, destination: destinationToClear }),
      });

      if (!response.ok) {
        let errorBody = {};
        try {
          errorBody = await response.json();
        } catch (e) {
          errorBody = { message: await response.text() };
        }
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorBody.message || 'Unknown error'}`);
      }
      const result = await response.json();
      console.log('[BusBookedMembers] Tickets expired response:', result);
      alert(`Tickets for destination ${destinationToClear} have been marked as expired.`);
      fetchBookedTickets();
    } catch (err) {
      setError(`Failed to mark tickets as expired: ${err.message}`);
      console.error('[BusBookedMembers] Expire tickets error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleScanQR = (qrData) => {
    console.log("[BusBookedMembers] Scanning QR data:", qrData);
    try {
      const parsedQR = JSON.parse(qrData);
      console.log("[BusBookedMembers] Parsed QR Data for Scan:", parsedQR);

      // Match logic:
      // Try to match using 'ticketId' if present in QR data (from our QRCodeDisplay)
      // Otherwise, match using combination of busCode and destination from QR and API data.
      // Note: Backend's GET /tickets/:busCode might not provide all fields from POST /book
      const matchedTicket = bookedTickets.find(ticket => {
        // If the backend ticket has an _id or id AND QR has a ticketId, match by that
        if (parsedQR.ticketId && (ticket._id === parsedQR.ticketId || ticket.id === parsedQR.ticketId)) {
            return true;
        }
        // Fallback: Match by busCode and destination and passenger count if available
        const qrPassengersCount = parsedQR.passengers || (parsedQR.passengers && parsedQR.passengers.length);
        const backendPassengersCount = ticket.passengers ? ticket.passengers.length : (ticket.totalPersons || 0);

        return (
          ticket.busCode === parsedQR.busCode &&
          ticket.destination === parsedQR.destination &&
          (qrPassengersCount === backendPassengersCount) // Match passenger count
        );
      });


      if (matchedTicket) {
        setScannedTicket(matchedTicket);
        setTicketStatusMessage('Ticket Valid! ✅');
      } else {
        setTicketStatusMessage('QR Code Not Valid! (No matching booking found or invalid QR) ❌');
        setScannedTicket(null);
      }
    } catch (e) {
      setTicketStatusMessage('QR Code Not Valid! (Corrupt Data or Bad Format) ❌');
      setScannedTicket(null);
      console.error("[BusBookedMembers] Error parsing QR data:", e);
    }
    setIsScanModalOpen(true);
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
        <button
          onClick={() => setIsScanModalOpen(true)}
          className="btn btn-primary btn-lg w-100 rounded-pill shadow mb-4"
        >
          Scan QR Code
        </button>
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
      {error && <p className="text-danger text-center mb-4">{error}</p>}

      {!loading && bookedTickets.length === 0 && !error && (
        <p className="text-center text-muted mt-5">No booked members found for this bus code. Try booking a ticket first.</p>
      )}

      <div className="row g-4 mx-auto" style={{ maxWidth: '900px' }}>
        {bookedTickets.length > 0 && bookedTickets.map((ticket) => (
          <div key={ticket._id || ticket.id || uuidv4()} className="col-12">
            <div className="card shadow-sm rounded-4 p-4 d-flex flex-column flex-md-row align-items-center justify-content-between border-0">
              <div className="text-dark mb-3 mb-md-0 me-md-3 text-center text-md-start">
                <h3 className="h5 fw-semibold mb-1">Name: {ticket.name || (ticket.passengers && ticket.passengers.length > 0 ? ticket.passengers[0].fullName : 'N/A')}</h3>
                <p className="fs-5 mb-0">Destination: {ticket.destination || 'N/A'}</p>
                <p className="text-muted mb-0">Source: {ticket.source || 'Present Stop'}</p>
                <p className="text-muted mb-0">Total Persons: {ticket.passengers ? ticket.passengers.length : (ticket.totalPersons || 0)}</p>
                <p className="text-muted small mb-0">Bus Code: {busCode || 'N/A'}</p>
                <p className={`fw-bold mb-0 ${ticket.status === 'booked' ? 'text-success' : 'text-danger'}`}>Status: {ticket.status || 'Booked (Assumed)'}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <CustomModal isOpen={isScanModalOpen} onClose={() => { setIsScanModalOpen(false); setScannedTicket(null); setTicketStatusMessage(''); }} title="Scan QR Code">
        <ScanQRCode onScan={handleScanQR} scannedTicket={scannedTicket} ticketStatusMessage={ticketStatusMessage} />
      </CustomModal>
    </div>
  );
};

export default BusBookedMembers;