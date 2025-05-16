/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

interface AuthContextType {
  token: string | null;
  email: string | null;
  setToken: (token: string | null, email?: string | null) => void;
  refreshProfile: () => void;
  profileRefreshTrigger: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [profileRefreshTrigger, setProfileRefreshTrigger] = useState(0);

  // Inicializar token y email desde localStorage en el cliente
  useEffect(() => {
    const validateToken = async () => {
      const storedToken = localStorage.getItem("token");
      const storedEmail = localStorage.getItem("userEmail");
      if (!storedToken) return;

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/auth/profile`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );
        if (!response.ok) {
          // Intentar renovar el token
          const refreshResponse = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${storedToken}`,
              },
            }
          );
          if (refreshResponse.ok) {
            const { access_token } = await refreshResponse.json();
            localStorage.setItem("token", access_token);
            setTokenState(access_token);
            setEmail(storedEmail);
          } else {
            throw new Error("No se pudo renovar el token");
          }
        } else {
          setTokenState(storedToken);
          setEmail(storedEmail);
        }
      } catch (err) {
        console.error("Error al validar el token:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("userEmail");
        setTokenState(null);
        setEmail(null);
      }
    };

    validateToken();
  }, []);

  const handleSetToken = (
    newToken: string | null,
    newEmail: string | null = null
  ) => {
    if (newToken) {
      localStorage.setItem("token", newToken);
      if (newEmail) {
        localStorage.setItem("userEmail", newEmail);
        setEmail(newEmail);
      } else {
        localStorage.removeItem("userEmail");
        setEmail(null);
      }
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("userEmail");
      setEmail(null);
    }
    setTokenState(newToken);
  };

  const refreshProfile = useCallback(() => {
    setProfileRefreshTrigger((prev) => prev + 1);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        email,
        setToken: handleSetToken,
        refreshProfile,
        profileRefreshTrigger,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
