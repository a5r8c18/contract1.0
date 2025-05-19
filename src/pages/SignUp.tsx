/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import api from "../lib/axios";
import { useAuth } from "../components/AuthContext";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    api: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setToken } = useAuth();

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      name: "",
      email: "",
      password: "",
      api: "",
    };

    if (!name.trim()) {
      newErrors.name = "Por favor, ingresa tu nombre";
      valid = false;
    }

    if (!email.includes("@")) {
      newErrors.email = "Por favor, ingresa un correo válido";
      valid = false;
    }

    const minPasswordLength = parseInt(
      import.meta.env.VITE_MIN_PASSWORD_LENGTH || "6",
      10
    );
    if (password.length < minPasswordLength) {
      newErrors.password = `La contraseña debe tener al menos ${minPasswordLength} caracteres`;
      valid = false;
    }

    return { valid, errors: newErrors };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { valid, errors } = validateForm();
    if (!valid) {
      setErrors(errors);
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.post("/auth/signup", {
        name,
        email,
        password,
      });
      setSuccessMessage("Registration successful! Redirecting to dashboard...");
      setToken(response.data.token);
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error: any) {
      setErrors({
        ...errors,
        api: error.response?.data?.message || "An error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center mb-4">
            Sign Up
          </CardTitle>
        </CardHeader>
        <CardContent>
          {successMessage && (
            <div className="bg-green-50 text-green-600 p-4 rounded mb-4">
              {successMessage}
            </div>
          )}
          {errors.api && (
            <div className="bg-red-50 text-red-600 p-4 rounded mb-4">
              {errors.api}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-gray-700">
                Nombre Completo
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`pl-10 ${
                    errors.name ? "border-red-500" : ""
                  } w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500`}
                  placeholder="Tu nombre"
                  disabled={isLoading}
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-gray-700">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`pl-10 ${
                    errors.email ? "border-red-500" : ""
                  } w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500`}
                  placeholder="tu@correo.com"
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-gray-700">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`pl-10 ${
                    errors.password ? "border-red-500" : ""
                  } w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500`}
                  placeholder="********"
                  disabled={isLoading}
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>

            {/* API Error */}
            {errors.api && (
              <p className="text-red-500 text-sm text-center">{errors.api}</p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gray-800 hover:bg-gray-900 text-white py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? "Registrando..." : "Regístrate"}
            </button>
          </form>

          {/* Additional Links */}
          <div className="mt-6 text-center space-y-3 text-sm">
            <div className="text-gray-600">
              ¿Ya tienes cuenta?{" "}
              <a
                href="/login"
                className="text-gray-800 font-medium hover:underline"
              >
                Inicia Sesión
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;
