import { useState, useEffect } from "react";
import { IoLogoWhatsapp } from "react-icons/io5";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Card from "../components/Card";
import Footer from "../components/Footer";
import Arrendamiento from "../pages/Arrendamiento";
import Determinado from "../pages/Determinado";
import Indeterminado from "../pages/Indeterminado";
import Comodato from "../pages/Comodato";
import CompraVenta from "../pages/CompraVenta";
import Suministro from "../pages/Suministro";
import Trabajo from "../pages/suplementos/Trabajo";
import PrestacionServicios from "./PrestaciónServicios";
import ContractManagementSettings from "../pages/Settings";
import TerminosUso from "./TerminosyCondiciones";

interface DashboardProps {
  initialSection?: string;
}

function Dashboard({ initialSection }: DashboardProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState(
    initialSection || "dashboard"
  );
  const [isDarkMode, setIsDarkMode] = useState(false); // Estado para modo oscuro

  // Cargar preferencia de modo oscuro desde localStorage al montar el componente
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode === "true") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Actualizar clase dark y localStorage cuando cambia isDarkMode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }, [isDarkMode]);

  // Actualizar activeSection si initialSection cambia
  useEffect(() => {
    if (initialSection) {
      setActiveSection(initialSection);
    }
  }, [initialSection]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Configuración de WhatsApp
  const whatsappNumber = "+5353335723";
  const whatsappMessage = "¡Hola! Necesito asistencia.";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  const handleWhatsAppClick = () => {
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <Navbar
        toggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
        toggleDarkMode={toggleDarkMode} // Pasamos la función al Navbar
        isDarkMode={isDarkMode} // Pasamos el estado al Navbar
      />
      <div className="flex flex-1 relative">
        <div
          className={`${
            isSidebarOpen ? "w-64" : "w-0"
          } bg-gray-800 dark:bg-gray-800 text-white transition-all duration-300 overflow-hidden`}
        >
          <Sidebar setActiveSection={setActiveSection} />
        </div>
        <main className="flex-1 p-6 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-200 overflow-auto">
          {activeSection === "dashboard" && (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold">Bienvenido al Dashboard</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card title="Contratos Vigentes" value="1,245" />
                <Card title="Próximos a Expirar" value="$12,300" />
                <Card title="Contratos Vencidos" value="15" />
              </div>
            </>
          )}
          {activeSection === "arrendamientos" && <Arrendamiento />}
          {activeSection === "configuracion" && <ContractManagementSettings />}
          {activeSection === "determinado" && <Determinado />}
          {activeSection === "indeterminado" && <Indeterminado />}
          {activeSection === "comodato" && <Comodato />}
          {activeSection === "compraventa" && <CompraVenta />}
          {activeSection === "suministro" && <Suministro />}
          {activeSection === "suplemento" && <Trabajo />}
          {activeSection === "prestacionesservicios" && <PrestacionServicios />}
          {activeSection === "terminos" && <TerminosUso />}
        </main>

        {/* Ícono flotante de WhatsApp */}
        <button
          onClick={handleWhatsAppClick}
          className="fixed bottom-20 right-6 bg-gray-800 dark:bg-gray-700 text-white p-3 rounded-full shadow-lg hover:bg-gray-900 dark:hover:bg-gray-600 transition-all duration-200 flex items-center justify-center z-50"
          aria-label="Contactar por WhatsApp"
        >
          <IoLogoWhatsapp className="h-6 w-6" />
        </button>
      </div>
      <Footer setActiveSection={setActiveSection} />
    </div>
  );
}

export default Dashboard;
