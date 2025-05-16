import { Menu, X, User, Calendar, Bell, Sun, Moon } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import UserProfile from "./UserProfile"; // Adjust path as needed
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Default styles

type NavbarProps = {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
  toggleDarkMode: () => void; // Prop para alternar modo oscuro
  isDarkMode: boolean; // Prop para estado del modo oscuro
};

function Navbar({
  toggleSidebar,
  isSidebarOpen,
  toggleDarkMode,
  isDarkMode,
}: NavbarProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  const toggleProfile = () => {
    setIsProfileOpen((prev) => !prev);
    setIsCalendarOpen(false); // Close calendar when opening profile
  };

  const toggleCalendar = () => {
    setIsCalendarOpen((prev) => !prev);
    setIsProfileOpen(false); // Close profile when opening calendar
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setIsCalendarOpen(false);
      }
    };

    if (isProfileOpen || isCalendarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileOpen, isCalendarOpen]);

  return (
    <nav className="bg-gray-800 dark:bg-gray-800 p-4 text-white dark:text-gray-200 flex justify-between items-center relative">
      {/* Ícono a la izquierda */}
      <button
        onClick={toggleSidebar}
        className="text-white dark:text-gray-200 hover:text-gray-400 dark:hover:text-gray-400 focus:outline-none"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Íconos a la derecha */}
      <div className="flex items-center space-x-4">
        {/* Ícono de calendario */}
        <div className="relative">
          <button
            onClick={toggleCalendar}
            className="text-white dark:text-gray-200 hover:text-gray-400 dark:hover:text-gray-400 focus:outline-none"
          >
            <Calendar size={24} />
          </button>
          {isCalendarOpen && (
            <div
              ref={calendarRef}
              className="absolute top-10 right-0 z-50 bg-white dark:bg-gray-900 shadow-lg rounded-md p-2"
            >
              <DatePicker
                selected={selectedDate}
                onChange={(date: Date | null) => setSelectedDate(date)}
                inline
                calendarClassName="text-gray-900 dark:text-gray-200 dark:bg-gray-900"
              />
            </div>
          )}
        </div>

        {/* Ícono de notificaciones */}
        <button className="text-white dark:text-gray-200 hover:text-gray-400 dark:hover:text-gray-400 focus:outline-none">
          <Bell size={24} />
        </button>

        {/* Ícono de tema */}
        <button
          onClick={toggleDarkMode}
          className="text-white dark:text-gray-200 hover:text-gray-400 dark:hover:text-gray-400 focus:outline-none"
        >
          {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
        </button>

        {/* Ícono de usuario */}
        <div className="relative">
          <button
            onClick={toggleProfile}
            className="text-white dark:text-gray-200 hover:text-gray-400 dark:hover:text-gray-400 focus:outline-none"
          >
            <User size={24} />
          </button>
          {isProfileOpen && (
            <div ref={profileRef} className="absolute top-10 right-0 z-50">
              <UserProfile />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
