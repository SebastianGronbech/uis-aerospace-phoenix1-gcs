import "./App.css";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router";
import { AuthProvider } from "@/features/auth/AuthContext";

import LoginPage from "@/features/auth/pages/loginPage";
import TelemetryDashboard from "../features/telemetry/pages/TelemetryPage";
import FlightEstimator from '@/features/flight_estimator/pages/FlightEstimator';
import EngineControl from '../features/engine_control/pages/EngineControl';
import NavBar from "../features/navbar/pages/NavBar";


// ✅ Wrapper component to allow useLocation
function AppContent() {
  const location = useLocation();
  const hideNavOn = ['/', '/login'];

  return (
    <>
      {!hideNavOn.includes(location.pathname) && <NavBar />}
      <Routes>
        <Route index element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/flight-estimator" element={<FlightEstimator />} />
        <Route path="/telemetry" element={<TelemetryDashboard />} />
        <Route path="/engine-control" element={<EngineControl />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
