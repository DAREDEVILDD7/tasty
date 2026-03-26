import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Customer from "./Customer";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <Routes>
      <Route path="/customer" element={<Customer />} />
      <Route
        path="/"
        element={
          loggedIn
            ? <Dashboard onLogout={() => setLoggedIn(false)} />
            : <Login onLogin={() => setLoggedIn(true)} />
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}