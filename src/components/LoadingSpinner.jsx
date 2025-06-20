import React from 'react';

const LoadingSpinner = () => (
  <div className="d-flex justify-content-center align-items-center py-3">
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
    <p className="ms-2 text-muted">Loading...</p>
  </div>
);

export default LoadingSpinner;