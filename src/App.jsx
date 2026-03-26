import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Customer from "./Customer";

export default function App() {
  const [user, setUser] = useState(null);

  return (
    <Routes>
      <Route path="/customer" element={<Customer />} />
      <Route
        path="/"
        element={
          user
            ? <Dashboard user={user} onLogout={() => setUser(null)} />
            : <Login onLogin={(userData) => setUser(userData)} />
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}