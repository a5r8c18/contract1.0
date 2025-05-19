import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { LogOut, User } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

// Define the shape of userData
interface UserData {
  name: string;
  email: string;
  role: string;
  avatar: string;
  memberSince: string;
  phone: string;
  language: string;
}

export default function UserProfile() {
  const { token, email, profileRefreshTrigger } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !email) {
      setIsLoggedIn(false);
      setIsLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        console.log("Solicitando perfil con token:", token);
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/auth/profile`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Respuesta:", response.status, response.statusText);
        if (!response.ok) {
          const data = await response.json();

          throw new Error(data.message || "Error al obtener el perfil");
        }

        const data: UserData = await response.json();
        console.log("Datos recibidos:", data);
        console.log("Avatar URL:", data.avatar);
        // Validar que el email coincide con el del usuario autenticado
        if (data.email !== email) {
          throw new Error(
            "Los datos del perfil no corresponden al usuario autenticado"
          );
        }
        setUserData(data);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Error en el servidor";
        setError(errorMessage);
        setIsLoggedIn(false);
        localStorage.removeItem("token");
        localStorage.removeItem("userEmail");
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [token, email, navigate, profileRefreshTrigger]);

  const handleLogout = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/logout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error al cerrar sesión");
      }

      localStorage.removeItem("token");
      localStorage.removeItem("userEmail");
      setIsLoggedIn(false);
      setUserData(null);
      navigate("/login");
    } catch (err: unknown) {
      console.error("Error al cerrar sesión:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Error al cerrar sesión";
      setError(errorMessage);
      localStorage.removeItem("token");
      localStorage.removeItem("userEmail");
      setIsLoggedIn(false);
      setUserData(null);
      navigate("/login");
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center p-6 bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        <Card className="w-full max-w-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 shadow-lg">
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              Sesión cerrada
            </h2>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Has cerrado sesión correctamente.
            </p>
            <Button
              className="w-full bg-gray-800 dark:bg-gray-700 text-white hover:bg-gray-900 dark:hover:bg-gray-600"
              onClick={() => navigate("/login")}
            >
              Volver a iniciar sesión
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6 bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-6 bg-gray-100 dark:bg-gray-900">
        <Card className="w-full max-w-md bg-white dark:bg-gray-800 text- gray-900 dark:text-gray-200 shadow-lg">
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              Error
            </h2>
          </CardHeader>
          <CardContent>
            <p className="text-red-500 mb-4">{error}</p>
            <Button
              className="w-full bg-gray-800 dark:bg-gray-700 text-white hover:bg-gray-900 dark:hover:bg-gray-600"
              onClick={() => navigate("/login")}
            >
              Ir al inicio de sesión
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm text-gray-900 dark:text-gray-200">
      <CardContent className="p-6">
        <div className="flex flex-col items-center mb-6">
          <Avatar className="h-20 w-20 mb-4 border-2 border-gray-300 dark:border-gray-700">
            <AvatarImage
              src={
                userData!.avatar
                  ? `${import.meta.env.VITE_API_BASE_URL}${userData!.avatar}`
                  : import.meta.env.VITE_DEFAULT_AVATAR_URL ||
                    "https://via.placeholder.com/150"
              }
              alt="User avatar"
            />
            <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
              {userData!.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
            {userData!.name}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">{userData!.email}</p>
          <span className="mt-2 px-3 py-1 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 text-sm rounded-full">
            {userData!.role}
          </span>
        </div>

        <div className="space-y-4">
          <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <User className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-3" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Miembro desde
              </p>
              <p className="text-gray-800 dark:text-gray-200">
                {new Date(userData!.memberSince).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                })}
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-400" />
            Cerrar sesión
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
