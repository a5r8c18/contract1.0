import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useAuth } from "../components/AuthContext";
import api from "../lib/axios";
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setToken } = useAuth();

  const validateForm = () => {
    let valid = true;
    const newErrors = { email: "", password: "", general: "" };

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

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({ email: "", password: "", general: "" });
    setIsLoading(true);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      }, {
        timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),
      });

      // Assuming the API returns a token
      const { access_token } = response.data;

      // Store token and user data
      setToken(access_token, email);
      // Redirect to dashboard or home
      navigate('/dashboard');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message || "An error occurred. Please try again.";
        setErrors(prev => ({ ...prev, general: errorMessage }));
      } else {
        setErrors(prev => ({ ...prev, general: "An error occurred. Please try again." }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Iniciar Sesión</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {errors.general}
              </div>
            )}
            <div>
              <Label htmlFor="email">Correo Electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full pl-10"
                  placeholder="tu@correo.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`mt-1 block w-full pr-10 pl-10 ${
                    errors.password ? "border-red-500" : ""
                  }`}
                  placeholder="********"
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>

            {/* General Error Message */}
            {errors.general && (
              <p className="text-red-500 text-sm text-center">
                {errors.general}
              </p>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-gray-800 hover:bg-gray-900 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Cargando..." : "Iniciar Sesión"}
            </Button>
          </form>

          {/* Additional Links */}
          <div className="mt-6 text-center space-y-3 text-sm">
            <div>
              <Link
                to="/forgot-password"
                className="text-gray-600 hover:text-gray-800 hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <div className="text-gray-600">
              ¿No tienes cuenta?{" "}
              <Link
                to="/signup"
                className="text-gray-800 font-medium hover:underline"
              >
                Regístrate
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
