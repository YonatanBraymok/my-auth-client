import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner";
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import VerifyEmail from './pages/VerifyEmail';

function App() {
  return (
    <>
      <Routes>
        {/*Default route*/}
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<VerifyEmail />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>

      <Toaster />
    </>
  );
}

export default App;