import React, { useState } from 'react';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { API_BASE_URL } from '../App.jsx';

const ReportMissingProduct = () => {
  const [category, setCategory] = useState('');
  const [busCode, setBusCode] = useState('');
  const [destination, setDestination] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    setError(null);
    setSuccess(false);

    if (!category || !busCode || !destination || !imageFile) {
      setError('Please fill all fields and upload an image.');
      return;
    }

    setLoading(true);

    const missingItemData = {
      category,
      busCode,
      destination,
      imageName: imageFile.name,
      reportedAt: new Date().toISOString(),
      status: 'pending',
    };

    console.log("Sending missing item report:", missingItemData);

    try {
      const response = await fetch(`${API_BASE_URL}/missing-items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(missingItemData),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorBody.message || JSON.stringify(errorBody)}`);
      }

      const result = await response.json();
      console.log('Missing product reported:', result);
      setSuccess(true);
      setCategory('');
      setBusCode('');
      setDestination('');
      setImageFile(null);
    } catch (err) {
      setError(`Failed to report missing product: ${err.message}. Please try again.`);
      console.error('Report missing product error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-5 bg-gradient-light-purple min-vh-100">
      <h1 className="h2 fw-bold text-purple mb-4 text-center">Report Missing Product</h1>

      <div className="card shadow-sm rounded-4 p-4 mx-auto" style={{ maxWidth: '500px' }}>
        <div className="mb-3">
          <label htmlFor="itemCategory" className="form-label fw-bold">Missing Product Category:</label>
          <input
            type="text"
            id="itemCategory"
            placeholder="e.g., Bag, Phone, Wallet"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="form-control rounded-pill"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="busCode" className="form-label fw-bold">Bus Code:</label>
          <input
            type="text"
            id="busCode"
            placeholder="e.g., 038038"
            value={busCode}
            onChange={(e) => setBusCode(e.target.value)}
            className="form-control rounded-pill"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="destination" className="form-label fw-bold">Approximate Destination of Loss:</label>
          <input
            type="text"
            id="destination"
            placeholder="e.g., Vijayawada"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="form-control rounded-pill"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="imageUpload" className="form-label fw-bold">Upload Image of Product:</label>
          <div className="input-group">
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              onChange={handleImageChange}
              className="form-control rounded-start-pill"
            />
            {imageFile && <span className="input-group-text rounded-end-pill text-muted small">{imageFile.name}</span>}
          </div>
          <small className="form-text text-muted">On mobile, this may allow you to use your device's camera or select from gallery.</small>
        </div>

        {error && <p className="text-danger text-center mb-3">{error}</p>}
        {success && <p className="text-success text-center mb-3 fw-semibold">Missing product reported successfully!</p>}
        {loading && <LoadingSpinner />}

        <button
          onClick={handleSubmit}
          className="btn btn-primary btn-lg w-100 rounded-pill shadow"
          disabled={loading}
        >
          Submit Report
        </button>
      </div>
    </div>
  );
};

export default ReportMissingProduct;