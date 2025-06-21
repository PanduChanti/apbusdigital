import React, { useState } from 'react';

const SafetyCompanion = () => {
  const [busCode, setBusCode] = useState('');
  const [sosMessage, setSosMessage] = useState('');
  const [file, setFile] = useState(null);

  const handleSOS = () => {
    alert("🚨 SOS triggered! Police will be alerted and reach within the next stops.");
  };

  const handleUpload = () => {
    if (!busCode || !sosMessage || !file) {
      alert('Please fill all details and upload a file.');
      return;
    }
    alert('🛡️ Your report has been submitted for review.');
    // Reset
    setBusCode('');
    setSosMessage('');
    setFile(null);
  };

  return (
    <div className="container py-5 min-vh-100 bg-light text-center">
      <h2 className="mb-4 text-danger fw-bold">👩‍🦺 Women & Safety Companion Mode</h2>
      <p className="text-muted mb-5">
        If you feel unsafe, press the SOS button. Nearby police units will be notified and arrive within the next stops.
        <br />
        If you witness any unsafe activity or issue on the bus, please upload an image or video and submit the bus code.
      </p>

      <button
        className="btn btn-danger btn-lg rounded-pill px-5 py-2 shadow mb-5"
        onClick={handleSOS}
      >
        🚨 SOS
      </button>

      <div className="card p-4 rounded-4 shadow-sm mx-auto" style={{ maxWidth: '500px' }}>
        <div className="mb-3 text-start">
          <label className="form-label fw-semibold">Bus Code</label>
          <input
            type="text"
            className="form-control rounded-pill"
            value={busCode}
            onChange={(e) => setBusCode(e.target.value)}
            placeholder="Enter Bus Code"
          />
        </div>

        <div className="mb-3 text-start">
          <label className="form-label fw-semibold">Describe the Issue (SOS)</label>
          <textarea
            className="form-control rounded-3"
            rows="3"
            value={sosMessage}
            onChange={(e) => setSosMessage(e.target.value)}
            placeholder="Describe the incident briefly..."
          ></textarea>
        </div>

        <div className="mb-4 text-start">
          <label className="form-label fw-semibold">Upload Image/Video</label>
          <input
            type="file"
            className="form-control"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>

        <button
          className="btn btn-primary rounded-pill px-4 py-2 w-100"
          onClick={handleUpload}
        >
          📤 Upload Report
        </button>
      </div>
    </div>
  );
};

export default SafetyCompanion;
