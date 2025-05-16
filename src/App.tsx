import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import RecoverPassword from "./pages/RecoverPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";

// import ContractManagementSettings from "./pages/Settings"; // Importamos el componente

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/forgot-password" element={<RecoverPassword />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />
        <Route
          path="/settings"
          element={<Dashboard initialSection="configuracion" />}
        />
        {/* Ruta por defecto: redirige a login */}
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
