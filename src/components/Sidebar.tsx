import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  BookCheck,
  Settings,
  LayoutDashboard,
} from "lucide-react";

interface SidebarProps {
  setActiveSection: (section: string) => void;
}

function Sidebar({ setActiveSection }: SidebarProps) {
  const [isContractsOpen, setIsContractsOpen] = useState(false);
  const [isEconomicOpen, setIsEconomicOpen] = useState(false);
  const [isWorkOpen, setIsWorkOpen] = useState(false);
  const [isOthersOpen, setIsOthersOpen] = useState(false);
  const [isSuplementosOpen, setIsSuplementosOpen] = useState(false);

  return (
    <div className="bg-gray-800 text-white p-4">
      <ul className="space-y-2">
        <li>
          <button
            onClick={() => setActiveSection("dashboard")}
            className="w-full flex items-center justify-between p-2 hover:bg-gray-700 rounded"
          >
            <div className="flex items-center">
              <LayoutDashboard size={16} className="mr-2" />
              <span>Dashboard</span>
            </div>
          </button>
        </li>

        <li>
          <button
            onClick={() => setIsContractsOpen(!isContractsOpen)}
            className="w-full flex items-center justify-between p-2 hover:bg-gray-700 rounded focus:outline-none"
          >
            <div className="flex items-center">
              <BookCheck size={16} className="mr-2" />
              <span>Contratos</span>
            </div>
            {isContractsOpen ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
          </button>

          {isContractsOpen && (
            <ul className="ml-4 mt-2 space-y-2">
              <li>
                <button
                  onClick={() => setIsEconomicOpen(!isEconomicOpen)}
                  className="w-full flex items-center justify-between p-2 hover:bg-gray-700 rounded focus:outline-none"
                >
                  <div className="flex items-center">
                    <span>Contratos Económicos</span>
                  </div>
                  {isEconomicOpen ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </button>

                {isEconomicOpen && (
                  <ul className="ml-4 mt-2 space-y-2">
                    <li>
                      <button
                        onClick={() => setActiveSection("arrendamientos")}
                        className="block p-2 hover:bg-gray-700 rounded w-full text-left"
                      >
                        Arrendamientos
                      </button>
                      <button
                        onClick={() =>
                          setActiveSection("prestacionesservicios")
                        }
                        className="block p-2 hover:bg-gray-700 rounded w-full text-left"
                      >
                        Prestaciones de Servicios
                      </button>
                      <button
                        onClick={() => setActiveSection("comodato")}
                        className="block p-2 hover:bg-gray-700 rounded w-full text-left"
                      >
                        COMODATO
                      </button>
                      <button
                        onClick={() => setActiveSection("compraventa")}
                        className="block p-2 hover:bg-gray-700 rounded w-full text-left"
                      >
                        Compra Venta
                      </button>
                      <button
                        onClick={() => setActiveSection("suministro")}
                        className="block p-2 hover:bg-gray-700 rounded w-full text-left"
                      >
                        Suministro
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => setIsOthersOpen(!isOthersOpen)}
                        className="w-full flex items-center justify-between p-2 hover:bg-gray-700 rounded focus:outline-none"
                      >
                        <div className="flex items-center">
                          <span>Otros</span>
                        </div>
                        {isOthersOpen ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronRight size={16} />
                        )}
                      </button>

                      {isOthersOpen && (
                        <ul className="ml-4 mt-2 space-y-2">
                          <li>
                            <button
                              onClick={() =>
                                setIsSuplementosOpen(!isSuplementosOpen)
                              }
                              className="w-full flex items-center justify-between p-2 hover:bg-gray-700 rounded focus:outline-none"
                            >
                              <div className="flex items-center">
                                <span>Suplementos</span>
                              </div>
                              {isSuplementosOpen ? (
                                <ChevronDown size={16} />
                              ) : (
                                <ChevronRight size={16} />
                              )}
                            </button>

                            {isSuplementosOpen && (
                              <ul className="ml-4 mt-2 space-y-2">
                                <li>
                                  <button
                                    onClick={() =>
                                      setActiveSection("suplemento")
                                    }
                                    className="block p-2 hover:bg-gray-700 rounded w-full text-left"
                                  >
                                    Suplemento al Trabajo
                                  </button>
                                </li>
                              </ul>
                            )}
                          </li>
                        </ul>
                      )}
                    </li>
                  </ul>
                )}
              </li>

              <li>
                <button
                  onClick={() => setIsWorkOpen(!isWorkOpen)}
                  className="w-full flex items-center justify-between p-2 hover:bg-gray-700 rounded focus:outline-none"
                >
                  <div className="flex items-center">
                    <span>Contratos de Trabajo</span>
                  </div>
                  {isWorkOpen ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </button>

                {isWorkOpen && (
                  <ul className="ml-4 mt-2 space-y-2">
                    <li>
                      <button
                        onClick={() => setActiveSection("indeterminado")}
                        className="block p-2 hover:bg-gray-700 rounded w-full text-left"
                      >
                        Tiempo Indefinido
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => setActiveSection("determinado")}
                        className="block p-2 hover:bg-gray-700 rounded w-full text-left"
                      >
                        Tiempo Definido
                      </button>
                    </li>
                  </ul>
                )}
              </li>
            </ul>
          )}
        </li>

        <li>
          <button
            onClick={() => setActiveSection("configuracion")}
            className="w-full flex items-center justify-between p-2 hover:bg-gray-700 rounded"
          >
            <div className="flex items-center">
              <Settings size={16} className="mr-2" />
              <span>Configuración</span>
            </div>
          </button>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
