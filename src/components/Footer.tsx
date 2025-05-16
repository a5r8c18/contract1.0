interface FooterProps {
  setActiveSection: (section: string) => void;
}

function Footer({ setActiveSection }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-blue-600 dark:bg-gray-800 text-white dark:text-gray-200 p-4 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <p className="text-sm">
          © {currentYear} Teneduría García. Todos los derechos reservados.
        </p>
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveSection("privacidad")}
            className="text-sm hover:text-gray-200 dark:hover:text-gray-400 focus:outline-none"
          >
            Política de Privacidad
          </button>
          <button
            onClick={() => setActiveSection("terminos")}
            className="text-sm hover:text-gray-200 dark:hover:text-gray-400 focus:outline-none"
          >
            Términos de Uso
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
