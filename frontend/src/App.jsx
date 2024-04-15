import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import EmployerProfile from "./pages/EmployerProfile";
import WorkerProfile from "./pages/WorkerProfile";
import WorkerProfileCompletion from "./pages/WorkerProfileCompletion";
import EmployerProfileCompletion from "./pages/EmployerProfileCompletion";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/worker-profile/:username/complete" element={
          <ProtectedRoute>
            <WorkerProfileCompletion />
          </ProtectedRoute>
        } />
        <Route path="/employer-profile/:username/complete" element={
          <ProtectedRoute>
            <EmployerProfileCompletion />
          </ProtectedRoute>
        } />
        <Route path="/profile/worker/:username" element={
          <ProtectedRoute>
            <WorkerProfile />
          </ProtectedRoute>
        } />
        <Route path="/profile/employer/:username" element={
          <ProtectedRoute>
            <EmployerProfile />
          </ProtectedRoute>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
