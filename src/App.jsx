import React, { useState, useContext, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { AppContext } from './context/AppContext.jsx';

// --- API Endpoints ---
export const API_BASE_URL = 'https://api-4cvp.onrender.com/api';

// --- Data Utilities ---
// Helper function to generate a simple linear path between two points
const generateSimulatedPath = (startLat, startLng, endLat, endLng, steps = 50) => {
  const path = [];
  for (let i = 0; i <= steps; i++) {
    const frac = i / steps;
    const lat = startLat + (endLat - startLat) * frac;
    const lng = startLng + (endLng - startLng) * frac;
    path.push({ lat, lng });
  }
  return path;
};

export const generateDummyBuses = () => {
  const busTypes = ['Deluxe', 'Ultra Deluxe', 'Express', 'Pallevelugu'];
  const busRoutes = [
    { source: 'Visakhapatnam', destination: 'Vijayawada', distance: 350, id: uuidv4(),
      startLoc: { lat: 17.7868, lng: 83.3185 }, endLoc: { lat: 16.5062, lng: 80.6480 } }, // VSP to VJW
    { source: 'Hyderabad', destination: 'Guntur', distance: 280, id: uuidv4(),
      startLoc: { lat: 17.3850, lng: 78.4867 }, endLoc: { lat: 16.3000, lng: 80.4500 } }, // HYD to GNT
    { source: 'Tirupati', destination: 'Nellore', distance: 130, id: uuidv4(),
      startLoc: { lat: 13.6288, lng: 79.4192 }, endLoc: { lat: 14.4440, lng: 79.9922 } }, // TPT to NLR
    { source: 'Kurnool', destination: 'Anantapur', distance: 120, id: uuidv4(),
      startLoc: { lat: 15.8281, lng: 78.0374 }, endLoc: { lat: 14.6819, lng: 77.6057 } }, // KRNL to ANTP
    { source: 'Rajahmundry', destination: 'Kakinada', distance: 60, id: uuidv4(),
      startLoc: { lat: 17.0000, lng: 81.7800 }, endLoc: { lat: 16.9400, lng: 82.2300 } }, // RJY to KAK
    { source: 'Vijayawada', destination: 'Visakhapatnam', distance: 350, id: uuidv4(),
      startLoc: { lat: 16.5062, lng: 80.6480 }, endLoc: { lat: 17.7868, lng: 83.3185 } }, // VJW to VSP (reverse)
    { source: 'Guntur', destination: 'Kurnool', distance: 200, id: uuidv4(),
      startLoc: { lat: 16.3000, lng: 80.4500 }, endLoc: { lat: 15.8281, lng: 78.0374 } }, // GNT to KRNL
    { source: 'Eluru', destination: 'Rajahmundry', distance: 100, id: uuidv4(),
      startLoc: { lat: 16.7100, lng: 81.1000 }, endLoc: { lat: 17.0000, lng: 81.7800 } }, // ELU to RJY
    { source: 'Nellore', destination: 'Chittoor', distance: 150, id: uuidv4(),
      startLoc: { lat: 14.4440, lng: 79.9922 }, endLoc: { lat: 13.2167, lng: 79.1167 } }, // NLR to CTR
    { source: 'Kakinada', destination: 'Vizianagaram', distance: 180, id: uuidv4(),
      startLoc: { lat: 16.9400, lng: 82.2300 }, endLoc: { lat: 18.1167, lng: 83.4167 } }, // KAK to VZM
  ];

  return Array.from({ length: 20 }).map((_, i) => {
    const route = busRoutes[Math.floor(Math.random() * busRoutes.length)];
    const busNo = `AP${Math.floor(Math.random() * 90) + 10}E${Math.floor(Math.random() * 9000) + 1000}`;
    const busCode = `0${Math.floor(Math.random() * 900000) + 100000}`;
    const arrivalTime = Math.floor(Math.random() * 45) + 5; // 5 to 50 minutes

    const simulatedPath = generateSimulatedPath(
      route.startLoc.lat, route.startLoc.lng,
      route.endLoc.lat, route.endLoc.lng,
      50
    );

    return {
      id: uuidv4(),
      busNo,
      busCode,
      source: route.source,
      destination: route.destination,
      busType: busTypes[Math.floor(Math.random() * busTypes.length)],
      arrivedInMins: arrivalTime,
      distanceKm: route.distance,
      farePerKm: Math.random() * 1.5 + 0.5,
      status: 'running',
      nextStop: 'Simulated Stop',
      currentLocation: simulatedPath[0],
      path: simulatedPath,
      seatsAvailable: Math.floor(Math.random() * 40) + 10,
      driverName: `Driver ${i + 1}`,
      contact: `987654321${i}`,
    };
  });
};

export const dummyBuses = generateDummyBuses();

import UserApp from './user_app/UserApp.jsx';
import ConductorApp from './conductor_app/ConductorApp.jsx';
import LoadingSpinner from './components/LoadingSpinner.jsx';

const AppTypeSelection = () => {
  const navigate = useNavigate();
  const { userId } = useContext(AppContext);

  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light font-inter text-dark">
      <div className="card shadow-lg border-0 rounded-4 p-4 p-md-5 text-center" style={{ maxWidth: '400px', width: '100%' }}>
        <h1 className="card-title h3 fw-bold text-primary mb-4">Choose Application Type</h1>
        <p className="text-muted small mb-4">Your User ID: <span className="badge bg-light text-dark font-monospace">{userId}</span></p>
        <div className="d-grid gap-3">
          <button
            onClick={() => navigate('/user')}
            className="btn btn-primary btn-lg rounded-pill shadow-sm"
          >
            AP Bus Digital Smart Local (User)
          </button>
          <button
            onClick={() => navigate('/conductor')}
            className="btn btn-success btn-lg rounded-pill shadow-sm"
          >
            AP Smart Digital Conductor App (Admin)
          </button>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const { appInitialized } = useContext(AppContext);

  if (!appInitialized) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <LoadingSpinner />
        <p className="text-muted ms-2">Initializing app...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<AppTypeSelection />} />
      <Route path="/user/*" element={<UserApp />} />
      <Route path="/conductor/*" element={<ConductorApp />} />
    </Routes>
  );
};

export default App;