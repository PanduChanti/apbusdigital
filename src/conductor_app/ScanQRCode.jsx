import React, { useState, useEffect, useRef } from 'react';

const ScanQRCode = ({ onScan, scannedTicket, ticketStatusMessage }) => {
  const qrCodeScannerRef = useRef(null); // Ref to ensure the div is mounted
  const html5QrcodeScannerInstance = useRef(null); // Ref to hold the scanner instance
  const [scannerActive, setScannerActive] = useState(false);
  const [scanError, setScanError] = useState(null);

  useEffect(() => {
    const initializeScanner = () => {
      // Check if the HTML element is available and the library is loaded
      if (qrCodeScannerRef.current && window.Html5QrcodeScanner) {
        // Clear any existing scanner to prevent multiple instances
        if (html5QrcodeScannerInstance.current) {
          html5QrcodeScannerInstance.current.clear().catch(e => console.error("Error clearing existing scanner:", e));
        }

        const scanner = new window.Html5QrcodeScanner(
          "qr-reader", // ID of the HTML element
          {
            fps: 10,
            qrbox: { width: 250, height: 250 }, // Increased QR box size for better readability
            rememberLastUsedCamera: true,
            supportedScanTypes: [window.Html5QrcodeScanType.SCAN_TYPE_CAMERA],
            disableFlip: false // Allow camera flip
          },
          /* verbose= */ false
        );

        html5QrcodeScannerInstance.current = scanner; // Store instance

        const onScanSuccess = (decodedText, decodedResult) => {
          console.log(`[ScanQRCode] QR Code detected: ${decodedText}`, decodedResult);
          setScanError(null);
          onScan(decodedText); // Pass the decoded text to the parent component
          // Optionally stop scanner after successful scan
          // scanner.clear().catch(e => console.error("Error stopping scanner after success:", e));
          // setScannerActive(false);
        };

        const onScanFailure = (error) => {
          // console.warn(`[ScanQRCode] QR Code scan error: ${error}`); // Log less aggressively
          setScanError(`Scan Error: ${error.message || error}`);
        };

        scanner.render(onScanSuccess, onScanFailure)
          .then(() => {
            setScannerActive(true);
            setScanError(null); // Clear error once started
            console.log("[ScanQRCode] Scanner started successfully.");
          })
          .catch(err => {
            setScannerActive(false);
            setScanError(`Failed to start scanner: ${err.message || 'Unknown error'}. Please ensure camera access is granted.`);
            console.error("[ScanQRCode] Failed to start scanner:", err);
          });
      } else {
        // If library not loaded, try again after a short delay
        if (!window.Html5QrcodeScanner && qrCodeScannerRef.current) {
            console.warn("[ScanQRCode] Html5QrcodeScanner not yet available, retrying...");
            setTimeout(initializeScanner, 200); // Retry after 200ms
        } else {
            console.error("[ScanQRCode] QR reader element not found or Html5QrcodeScanner not available.");
            setScanError("QR Scanner library not loaded. Please check browser console.");
        }
      }
    };

    // Initial call to start scanner, potentially with a delay
    // Using a timeout to ensure the DOM is ready and CDN script parsed
    const loadTimeout = setTimeout(initializeScanner, 100);

    return () => {
      clearTimeout(loadTimeout);
      if (html5QrcodeScannerInstance.current) {
        console.log("[ScanQRCode] Cleaning up scanner on unmount...");
        html5QrcodeScannerInstance.current.clear()
          .then(() => console.log("[ScanQRCode] Scanner stopped successfully during cleanup."))
          .catch(error => console.error("[ScanQRCode] Failed to stop scanner cleanly during cleanup:", error))
          .finally(() => setScannerActive(false));
      }
    };
  }, []); // Empty dependency array: runs once on mount, cleans up on unmount

  return (
    <div className="p-3 d-flex flex-column align-items-center">
      <h3 className="h5 fw-bold text-dark mb-3">Live QR Scanner</h3>
      {scanError && <p className="text-danger text-center">{scanError}</p>}
      {!scannerActive && !scanError && <p className="text-muted text-center">Starting camera, please grant access...</p>}

      {/* This is the div where the QR scanner will be rendered by the library */}
      <div id="qr-reader" ref={qrCodeScannerRef}></div>

      {ticketStatusMessage && (
        <p className={`h5 fw-bold my-4 ${ticketStatusMessage.includes('Valid') ? 'text-success' : 'text-danger'}`}>
          {ticketStatusMessage}
        </p>
      )}

      {scannedTicket && (
        <div className="card bg-info bg-opacity-10 border border-info rounded-3 p-3 w-100 text-dark">
          <h3 className="h5 fw-bold mb-2">Ticket Information:</h3>
          {/* Robustly display info, checking if properties exist */}
          <p className="fs-5 mb-1"><strong>Name:</strong> {scannedTicket.name || (scannedTicket.passengers && scannedTicket.passengers.length > 0 ? scannedTicket.passengers[0].fullName : 'N/A')}</p>
          <p className="fs-5 mb-1"><strong>Total Persons:</strong> {scannedTicket.totalPersons || (scannedTicket.passengers ? scannedTicket.passengers.length : 0)}</p>
          <p className="fs-5 mb-1"><strong>Source:</strong> {scannedTicket.source || 'N/A'}</p>
          <p className="fs-5 mb-1"><strong>Destination:</strong> {scannedTicket.destination || 'N/A'}</p>
          <p className="fs-5 mb-1"><strong>Fare:</strong> ₹{scannedTicket.totalFare ? scannedTicket.totalFare.toFixed(2) : '0.00'}</p>
          <p className="fs-5 mb-0"><strong>Bus Code:</strong> {scannedTicket.busCode || 'N/A'}</p>
        </div>
      )}
    </div>
  );
};

export default ScanQRCode;