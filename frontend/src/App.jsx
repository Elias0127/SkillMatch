import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import EmployerProfile from "./pages/EmployerProfile";
import WorkerProfile from "./pages/WorkerProfile";
import ProfileCompletion from "./pages/ProfileCompletion";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/profile-complete/:role/:username" element={
          <ProtectedRoute>
            <ProfileCompletion />
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
