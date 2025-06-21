import React, { useState, useEffect, useRef } from 'react';
import Profile from '/src/assets/Player.png'; // Dummy profile image

const StudentPass = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [passCode, setPassCode] = useState('');
  const [studentDetails, setStudentDetails] = useState(null);
  const [renewalFare, setRenewalFare] = useState(0);
  const qrCodeRef = useRef(null);

  const dummyStudentPass = {
    name: 'Anjali Sharma',
    studentId: 'SP-2023-001',
    college: 'Andhra University',
    validUntil: '2025-06-30',
    passType: 'Annual',
    qrData: JSON.stringify({
      studentId: 'SP-2023-001',
      name: 'Anjali Sharma',
      valid: '2025-06-30'
    }),
    destination: 'Visakhapatnam',

  };

  const handleRenewPass = () => {
    if (passCode === dummyStudentPass.studentId) {
      setStudentDetails(dummyStudentPass);
      setRenewalFare(500);
    } else {
      alert('Invalid Pass Code. Please try again.');
    }
  };

  useEffect(() => {
    if (selectedOption === 'virtualPass' && qrCodeRef.current && window.QRCode) {
      qrCodeRef.current.innerHTML = '';
      new window.QRCode(qrCodeRef.current, {
        text: dummyStudentPass.qrData,
        width: 256,
        height: 256,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: window.QRCode.CorrectLevel.H
      });
    }
  }, [selectedOption]); // ✅ Fixed: removed dummyStudentPass.qrData from dependency array

  return (
    <div className="container-fluid py-5 bg-gradient-light-blue min-vh-100">
      <h1 className="h2 fw-bold text-primary mb-5 text-center">Student Pass Services</h1>

      <div className="card shadow-sm rounded-4 p-4 mb-5 mx-auto" style={{ maxWidth: '500px' }}>
        <div className="d-grid gap-3">
          <button
            onClick={() => setSelectedOption('newPass')}
            className={`btn btn-lg rounded-pill fw-semibold shadow-sm
                        ${selectedOption === 'newPass' ? 'btn-primary' : 'btn-outline-primary'}`}
          >
            New Pass
          </button>
          <button
            onClick={() => setSelectedOption('renewPass')}
            className={`btn btn-lg rounded-pill fw-semibold shadow-sm
                        ${selectedOption === 'renewPass' ? 'btn-primary' : 'btn-outline-primary'}`}
          >
            Renew Pass
          </button>
          <button
            onClick={() => setSelectedOption('virtualPass')}
            className={`btn btn-lg rounded-pill fw-semibold shadow-sm
                        ${selectedOption === 'virtualPass' ? 'btn-primary' : 'btn-outline-primary'}`}
          >
            Virtual Pass
          </button>
        </div>
      </div>

      {selectedOption === 'newPass' && (
        <div className="card shadow-sm rounded-4 p-4 mx-auto" style={{ maxWidth: '500px' }}>
          <h2 className="h4 fw-bold text-dark mb-3">Apply for New Pass (Dummy)</h2>
          <p className="text-muted mb-4">
            This section would guide you through applying for a new student pass.
            <br />
            (e.g., Upload documents, fill forms, etc.)
          </p>
          <button
            onClick={() => alert('Simulating new pass application submission.')}
            className="btn btn-primary btn-lg w-100 rounded-pill shadow"
          >
            Apply Now
          </button>
        </div>
      )}

      {selectedOption === 'renewPass' && (
        <div className="card shadow-sm rounded-4 p-4 mx-auto" style={{ maxWidth: '500px' }}>
          <h2 className="h4 fw-bold text-dark mb-3">Renew Student Pass (Dummy)</h2>
          <input
            type="text"
            placeholder="Enter Student Pass Code"
            value={passCode}
            onChange={(e) => setPassCode(e.target.value)}
            className="form-control rounded-pill mb-3"
          />
          <button
            onClick={handleRenewPass}
            className="btn btn-primary btn-lg w-100 rounded-pill shadow mb-4"
          >
            Check Details
          </button>
          {studentDetails && (
            <div className="text-muted fs-5 mt-4">
              <p><strong>Name:</strong> {studentDetails.name}</p>
              <p><strong>Student ID:</strong> {studentDetails.studentId}</p>
              <p><strong>College:</strong> {studentDetails.college}</p>
              <p><strong>Valid Until:</strong> {studentDetails.validUntil}</p>
              <p><strong>Renewal Fare:</strong> ₹{renewalFare}</p>
              <button
                onClick={() => alert('Simulating payment for renewal.')}
                className="btn btn-success btn-lg w-100 rounded-pill shadow mt-4"
              >
                Pay Renewal Fare
              </button>
            </div>
          )}
        </div>
      )}

      {selectedOption === 'virtualPass' && (
        <div className="card shadow-sm rounded-4 p-4 mx-auto text-center" style={{ maxWidth: '500px' }}>
          <h2 className="h4 fw-bold text-dark mb-3">Your Virtual Pass (Dummy)</h2>
          <div className="mb-4">
            <img
              src={Profile}
              alt="Student"
              className="rounded-circle border border-primary"
              style={{ width: '150px', height: '150px', objectFit: 'cover' }}
            />
          </div>
          <div className="d-flex justify-content-center mb-4">
            <div ref={qrCodeRef} className="p-2 border border-secondary rounded-3 bg-white"></div>
          </div>
          <div className="text-muted fs-5">
            <p><strong>Name:</strong> {dummyStudentPass.name}</p>
            <p><strong>Student ID:</strong> {dummyStudentPass.studentId}</p>
            <p><strong>Valid Until:</strong> {dummyStudentPass.validUntil}</p>
            <p><strong>Destination:</strong> {dummyStudentPass.destination}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentPass;
