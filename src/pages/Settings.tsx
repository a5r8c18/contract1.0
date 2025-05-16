import { useState, useEffect, ChangeEvent } from "react";
import {
  Settings,
  FileText,
  Users,
  Lock,
  Mail,
  Bell,
  Save,
  User,
  Phone,
  Globe,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useAuth } from "../components/AuthContext";

interface UserData {
  name: string;
  email: string;
  phone: string;
  language: string;
  avatar: string;
}

interface SettingsData {
  contractPrefix: string;
  autoNumbering: boolean;
  defaultExpirationDays: number;
  notificationDays: number;
  approvalWorkflow: string;
  signatureMethod: string;
  emailNotifications: boolean;
  documentRetentionYears: number;
  allowEditing: boolean;
}

export default function ContractManagementSettings() {
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [activeTab, setActiveTab] = useState("general");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const { token, email, refreshProfile } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!token || !email) {
        setError("No se encontró el token o el usuario no está autenticado");
        setIsLoading(false);
        return;
      }

      try {
        console.log("Solicitando settings con token:", token);
        // Fetch settings
        const settingsResponse = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/settings`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(
          "Respuesta settings:",
          settingsResponse.status,
          settingsResponse.statusText
        );
        if (!settingsResponse.ok) {
          throw new Error("Error al obtener la configuración");
        }
        const settingsData = await settingsResponse.json();
        console.log("Datos settings:", settingsData);
        setSettings(settingsData);
        console.log("Solicitando perfil con token:", token);
        // Fetch user profile
        const profileResponse = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/auth/profile`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(
          "Respuesta perfil:",
          profileResponse.status,
          profileResponse.statusText
        );
        if (!profileResponse.ok) {
          throw new Error("Error al obtener el perfil");
        }
        const profileData = await profileResponse.json();
        console.log("Datos perfil:", profileData);
        // Validar que el email coincide con el del usuario autenticado
        if (profileData.email !== email) {
          throw new Error(
            "Los datos del perfil no corresponden al usuario autenticado"
          );
        }
        setUserData(profileData);
        setAvatarPreview(profileData.avatar);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Error en el servidor";
        console.error("Error completo:", err);
        setError(errorMessage);
        // No eliminar el token a menos que sea un error de autenticación
        if (err instanceof Error && err.message.includes("no autenticado")) {
          localStorage.removeItem("token");
          localStorage.removeItem("userEmail");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token, email]);

  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev!,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setSettings((prev) => ({
      ...prev!,
      [name]: checked,
    }));
  };

  const handleUserDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev!,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUserSave = async () => {
    if (!userData || !token) return;

    if (password && password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("email", userData.email);
      formData.append("phone", userData.phone);
      formData.append("language", userData.language);
      if (password) {
        formData.append("password", password);
      }
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/profile`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(
          data.message || "Error al guardar los datos del usuario"
        );
      }

      const updatedProfile = await response.json();
      // Validar que el email del perfil actualizado coincide
      if (updatedProfile.email !== email) {
        throw new Error(
          "Los datos del perfil actualizado no corresponden al usuario autenticado"
        );
      }
      setUserData(updatedProfile);
      setAvatarPreview(updatedProfile.avatar);
      setPassword("");
      setConfirmPassword("");
      setAvatarFile(null);
      setError("");
      refreshProfile(); // Trigger profile refresh for other components
      alert("Datos de usuario guardados exitosamente");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Error en el servidor";
      setError(errorMessage);
      localStorage.removeItem("token");
      localStorage.removeItem("userEmail");
    }
  };

  const handleSave = async () => {
    if (!settings || !token) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/settings`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(settings),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error al guardar la configuración");
      }

      setError("");
      alert("Configuración guardada exitosamente");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Error en el servidor";
      setError(errorMessage);
      localStorage.removeItem("token");
      localStorage.removeItem("userEmail");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <Card className="max-w-4xl mx-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-500 mb-4">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white"
            >
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!settings || !userData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-8 transition-colors duration-300">
      <Card className="max-w-4xl mx-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 shadow-lg">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Settings className="h-6 w-6 text-gray-700 dark:text-gray-200" />
            <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              Ajustes del Sistema de Contratos
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex flex-wrap border-b border-gray-200 dark:border-gray-700 mb-6">
            <button
              onClick={() => setActiveTab("general")}
              className={`px-4 py-2 font-medium flex items-center space-x-2 ${
                activeTab === "general"
                  ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>Generales</span>
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`px-4 py-2 font-medium flex items-center space-x-2 ${
                activeTab === "security"
                  ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              }`}
            >
              <Lock className="h-4 w-4" />
              <span>Seguridad</span>
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`px-4 py-2 font-medium flex items-center space-x-2 ${
                activeTab === "notifications"
                  ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              }`}
            >
              <Bell className="h-4 w-4" />
              <span>Notificaciones</span>
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`px-4 py-2 font-medium flex items-center space-x-2 ${
                activeTab === "users"
                  ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Usuarios</span>
            </button>
          </div>

          <div className="space-y-6">
            {activeTab === "general" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label
                    htmlFor="contractPrefix"
                    className="flex items-center space-x-2 mb-2 text-gray-700 dark:text-gray-200"
                  >
                    <FileText className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    <span>Prefijo de contrato</span>
                  </Label>
                  <Input
                    id="contractPrefix"
                    name="contractPrefix"
                    value={settings.contractPrefix}
                    onChange={handleSettingsChange}
                    className="max-w-xs bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-700"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="autoNumbering"
                    className="flex items-center space-x-2 mb-2 text-gray-700 dark:text-gray-200"
                  >
                    <FileText className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    <span>Numeración automática</span>
                  </Label>
                  <Switch
                    id="autoNumbering"
                    checked={settings.autoNumbering}
                    onCheckedChange={(checked: boolean) =>
                      handleSwitchChange("autoNumbering", checked)
                    }
                  />
                </div>

                <div>
                  <Label
                    htmlFor="defaultExpirationDays"
                    className="flex items-center space-x-2 mb-2 text-gray-700 dark:text-gray-200"
                  >
                    <FileText className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    <span>Días para expiración por defecto</span>
                  </Label>
                  <Input
                    type="number"
                    id="defaultExpirationDays"
                    name="defaultExpirationDays"
                    value={settings.defaultExpirationDays}
                    onChange={handleSettingsChange}
                    className="max-w-xs bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-700"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="documentRetentionYears"
                    className="flex items-center space-x-2 mb-2 text-gray-700 dark:text-gray-200"
                  >
                    <FileText className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    <span>Años de retención documental</span>
                  </Label>
                  <Input
                    type="number"
                    id="documentRetentionYears"
                    name="documentRetentionYears"
                    value={settings.documentRetentionYears}
                    onChange={handleSettingsChange}
                    className="max-w-xs bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-700"
                  />
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <Label className="flex items-center space-x-2 mb-2 text-gray-700 dark:text-gray-200">
                    <Lock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    <span>Método de firma</span>
                  </Label>
                  <Select
                    value={settings.signatureMethod}
                    onValueChange={(value) =>
                      setSettings({ ...settings, signatureMethod: value })
                    }
                  >
                    <SelectTrigger className="w-[280px] bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-700">
                      <SelectValue placeholder="Seleccione método de firma" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-700">
                      <SelectItem value="digital">Firma digital</SelectItem>
                      <SelectItem value="manual">Firma manual</SelectItem>
                      <SelectItem value="both">Ambos métodos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="allowEditing"
                    className="flex items-center space-x-2 mb-2 text-gray-700 dark:text-gray-200"
                  >
                    <Lock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    <span>Permitir edición después de firmar</span>
                  </Label>
                  <Switch
                    id="allowEditing"
                    checked={settings.allowEditing}
                    onCheckedChange={(checked: boolean) =>
                      handleSwitchChange("allowEditing", checked)
                    }
                  />
                </div>

                <div>
                  <Label className="flex items-center space-x-2 mb-2 text-gray-700 dark:text-gray-200">
                    <Lock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    <span>Flujo de aprobación</span>
                  </Label>
                  <Select
                    value={settings.approvalWorkflow}
                    onValueChange={(value) =>
                      setSettings({ ...settings, approvalWorkflow: value })
                    }
                  >
                    <SelectTrigger className="w-[280px] bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-700">
                      <SelectValue placeholder="Seleccione flujo de aprobación" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-700">
                      <SelectItem value="single-level">Un nivel</SelectItem>
                      <SelectItem value="two-level">Dos niveles</SelectItem>
                      <SelectItem value="custom">Personalizado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="grid grid-cols-1 gap-6">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="emailNotifications"
                    className="flex items-center space-x-2 mb-2 text-gray-700 dark:text-gray-200"
                  >
                    <Mail className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    <span>Notificaciones por correo</span>
                  </Label>
                  <Switch
                    id="emailNotifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked: boolean) =>
                      handleSwitchChange("emailNotifications", checked)
                    }
                  />
                </div>

                <div>
                  <Label
                    htmlFor="notificationDays"
                    className="flex items-center space-x-2 mb-2 text-gray-700 dark:text-gray-200"
                  >
                    <Bell className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    <span>Días previos para notificación de vencimiento</span>
                  </Label>
                  <Input
                    type="number"
                    id="notificationDays"
                    name="notificationDays"
                    value={settings.notificationDays}
                    onChange={handleSettingsChange}
                    className="max-w-xs bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-700"
                  />
                </div>
              </div>
            )}

            {activeTab === "users" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label
                      htmlFor="name"
                      className="flex items-center space-x-2 mb-2 text-gray-700 dark:text-gray-200"
                    >
                      <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      <span>Nombre completo</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={userData.name}
                      onChange={handleUserDataChange}
                      className="max-w-xs bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-700"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="email"
                      className="flex items-center space-x-2 mb-2 text-gray-700 dark:text-gray-200"
                    >
                      <Mail className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      <span>Correo electrónico</span>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={userData.email}
                      onChange={handleUserDataChange}
                      className="max-w-xs bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-700"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="phone"
                      className="flex items-center space-x-2 mb-2 text-gray-700 dark:text-gray-200"
                    >
                      <Phone className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      <span>Teléfono</span>
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={userData.phone}
                      onChange={handleUserDataChange}
                      className="max-w-xs bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-700"
                    />
                  </div>

                  <div>
                    <Label className="flex items-center space-x-2 mb-2 text-gray-700 dark:text-gray-200">
                      <Globe className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      <span>Idioma preferido</span>
                    </Label>
                    <Select
                      value={userData.language}
                      onValueChange={(value) =>
                        setUserData({ ...userData, language: value })
                      }
                    >
                      <SelectTrigger className="w-[280px] bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-700">
                        <SelectValue placeholder="Seleccione un idioma" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-700">
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="en">Inglés</SelectItem>
                        <SelectItem value="fr">Francés</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label
                      htmlFor="password"
                      className="flex items-center space-x-2 mb-2 text-gray-700 dark:text-gray-200"
                    >
                      <Lock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      <span>Nueva contraseña</span>
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="max-w-xs bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-700"
                      placeholder="Dejar en blanco para no cambiar"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="confirmPassword"
                      className="flex items-center space-x-2 mb-2 text-gray-700 dark:text-gray-200"
                    >
                      <Lock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      <span>Confirmar contraseña</span>
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="max-w-xs bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-700"
                      placeholder="Repita la nueva contraseña"
                    />
                  </div>
                </div>

                <div>
                  <Label className="flex items-center space-x-2 mb-2 text-gray-700 dark:text-gray-200">
                    <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    <span>Avatar</span>
                  </Label>
                  <div className="flex items-center space-x-4">
                    <img
                      src={avatarPreview || userData.avatar}
                      alt="Avatar"
                      className="h-16 w-16 rounded-full object-cover border-2 border-gray-300 dark:border-gray-700"
                    />
                    <div>
                      <Input
                        id="avatar"
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="max-w-xs bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-700"
                      />
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Sube una imagen (máx. 2MB)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                  <Button
                    onClick={handleUserSave}
                    className="bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Guardar datos de usuario
                  </Button>
                </div>
              </div>
            )}

            {activeTab !== "users" && (
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                <Button
                  onClick={handleSave}
                  className="bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Guardar cambios
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
