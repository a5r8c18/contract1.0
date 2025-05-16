/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import api from "../lib/axios";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [feedback, setFeedback] = useState<{
    type: "éxito" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate(); // Hook para redirección

  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setFeedback({
        type: "error",
        message: "Token inválido o faltante",
      });
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback({ type: null, message: "" });

    // Validar contraseñas
    if (!newPassword) {
      setErrors((prev) => ({
        ...prev,
        newPassword: "La contraseña es obligatoria",
      }));
      setIsSubmitting(false);
      return;
    }
    const minPasswordLength = parseInt(
      import.meta.env.VITE_MIN_PASSWORD_LENGTH || "6",
      10
    );
    if (newPassword.length < minPasswordLength) {
      setErrors((prev) => ({
        ...prev,
        newPassword: `La contraseña debe tener al menos ${minPasswordLength} caracteres`,
      }));
      setIsSubmitting(false);
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Las contraseñas no coinciden",
      }));
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await api.post('/auth/reset-password', { token, newPassword },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        }
      );

      const data = response.data;
      if (data.error) {
        throw new Error(data.error || "Error al restablecer la contraseña");
      }

      setFeedback({
        type: "éxito",
        message: data.message || "Contraseña restablecida exitosamente",
      });
      setNewPassword("");
      setConfirmPassword("");

      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error: any) {
      setFeedback({
        type: "error",
        message: error.message || "Error al restablecer la contraseña",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-center">Restablecer Contraseña</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nueva Contraseña</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={errors.newPassword ? "border-red-500" : ""}
              />
              {errors.newPassword && (
                <p className="text-sm text-red-500">{errors.newPassword}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={errors.confirmPassword ? "border-red-500" : ""}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || !token}
            >
              {isSubmitting ? "Restableciendo..." : "Restablecer Contraseña"}
            </Button>
            {feedback.type && (
              <div
                className={`p-4 rounded-md ${
                  feedback.type === "éxito"
                    ? "bg-green-50 text-green-800"
                    : "bg-red-50 text-red-800"
                }`}
              >
                {feedback.message}
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
