/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, ChangeEvent } from "react";
import { Settings as SettingsIcon, FileText, Lock, Bell, Users, User, Mail, Phone, Globe, Save } from "lucide-react";
import { useAuth } from "../components/AuthContext";
import api from "../lib/axios";
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
import { Button } from "../components/ui/button";

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

interface UserData {
  name: string;
  email: string;
  phone: string;
  language: Language;
  avatar: string;
}

interface Errors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  phone?: string;
  general?: string;
}

type Language = 'es' | 'en';

const translations: Record<Language, { [key: string]: string }> = {
  es: {
    title: "Ajustes del Sistema de Contratos",
    profile: "Perfil de Usuario",
    general: "Generales",
    security: "Seguridad",
    notifications: "Notificaciones",
    users: "Usuarios",
    save: "Guardar Cambios",
    saveUser: "Guardar datos de usuario",
    loading: "Cargando...",
    error: "Error",
    retry: "Reintentar",
    passwordMismatch: "Las contraseñas no coinciden",
    invalidEmail: "Correo electrónico inválido",
    invalidPassword: "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número",
    invalidPhone: "Número de teléfono inválido",
    saveSuccess: "Datos guardados exitosamente",
    contractPrefix: "Prefijo de contrato",
    autoNumbering: "Numeración automática",
    expirationDays: "Días para expiración por defecto",
    retentionYears: "Años de retención documental",
    signatureMethod: "Método de firma",
    allowEditing: "Permitir edición después de firmar",
    approvalWorkflow: "Flujo de aprobación",
    emailNotifications: "Notificaciones por correo",
    notificationDays: "Días previos para notificación de vencimiento",
    name: "Nombre completo",
    email: "Correo electrónico",
    phone: "Teléfono",
    language: "Idioma preferido",
    password: "Nueva contraseña",
    confirmPassword: "Confirmar contraseña",
    avatar: "Avatar",
    uploadAvatar: "Sube una imagen (máx. 2MB)",
  },
  en: {
    title: "Contract System Settings",
    profile: "User Profile",
    general: "General",
    security: "Security",
    notifications: "Notifications",
    users: "Users",
    save: "Save Changes",
    saveUser: "Save user data",
    loading: "Loading...",
    error: "Error",
    retry: "Retry",
    passwordMismatch: "Passwords do not match",
    invalidEmail: "Invalid email address",
    invalidPassword: "Password must be at least 8 characters, with one uppercase, one lowercase, and one number",
    invalidPhone: "Invalid phone number",
    saveSuccess: "Data saved successfully",
    contractPrefix: "Contract prefix",
    autoNumbering: "Automatic numbering",
    expirationDays: "Default expiration days",
    retentionYears: "Document retention years",
    signatureMethod: "Signature method",
    allowEditing: "Allow editing after signing",
    approvalWorkflow: "Approval workflow",
    emailNotifications: "Email notifications",
    notificationDays: "Days prior to expiration notification",
    name: "Full name",
    email: "Email address",
    phone: "Phone",
    language: "Preferred language",
    password: "New password",
    confirmPassword: "Confirm password",
    avatar: "Avatar",
    uploadAvatar: "Upload an image (max 2MB)",
  },
};

const SettingsPage = () => {
  const { token, email } = useAuth();
  const [settings, setSettings] = useState<SettingsData>({
    contractPrefix: "",
    autoNumbering: false,
    defaultExpirationDays: 30,
    notificationDays: 7,
    approvalWorkflow: "basic",
    signatureMethod: "digital",
    emailNotifications: true,
    documentRetentionYears: 5,
    allowEditing: false,
  });
  const [userData, setUserData] = useState<UserData>({
    name: "",
    email: "",
    phone: "",
    language: "es",
    avatar: "",
  });
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [activeTab, setActiveTab] = useState<"general" | "security" | "notifications" | "users">("general");
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<Errors>({});
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const t = translations[(userData.language || "es") as Language];

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return passwordRegex.test(password);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\+?\d{8,15}$/;
    return phoneRegex.test(phone);
  };

  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setSettings((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleUserDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Validar en tiempo real
    if (name === "email" && value && !validateEmail(value)) {
      setErrors((prev) => ({ ...prev, email: t.invalidEmail }));
    } else if (name === "email") {
      setErrors((prev) => ({ ...prev, email: undefined }));
    }
    if (name === "phone" && value && !validatePhone(value)) {
      setErrors((prev) => ({ ...prev, phone: t.invalidPhone }));
    } else if (name === "phone") {
      setErrors((prev) => ({ ...prev, phone: undefined }));
    }
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 2 * 1024 * 1024) { // Máx 2MB
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setErrors((prev) => ({ ...prev, general: "La imagen debe ser menor a 2MB" }));
    }
  };

  const handleUserSave = async () => {
    setErrors({});
    if (!userData || !token) {
      setErrors({ general: t.error });
      return;
    }

    // Validaciones
    if (!validateEmail(userData.email)) {
      setErrors({ email: t.invalidEmail });
      return;
    }
    if (password && !validatePassword(password)) {
      setErrors({ password: t.invalidPassword });
      return;
    }
    if (password && password !== confirmPassword) {
      setErrors({ confirmPassword: t.passwordMismatch });
      return;
    }
    if (userData.phone && !validatePhone(userData.phone)) {
      setErrors({ phone: t.invalidPhone });
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

      const response = await api.patch('/auth/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const updatedProfile = response.data;
      if (updatedProfile.email !== email) {
        throw new Error("Los datos del perfil no corresponden al usuario autenticado");
      }
      setUserData(updatedProfile);
      setAvatarPreview(updatedProfile.avatar);
      setPassword("");
      setConfirmPassword("");
      setAvatarFile(null);
      setErrors({});
      alert(t.saveSuccess);
    } catch (err: any) {
      setErrors({ general: err.message || t.error });
    }
  };

  const handleSave = async () => {
    if (!settings || !token) {
      setErrors({ general: t.error });
      return;
    }

    try {
      await api.patch('/settings', settings);
      setErrors({});
      alert(t.saveSuccess);
    } catch (err: any) {
      setErrors({ general: err.message || t.error });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!token || !email) {
        setErrors({ general: t.error });
        setIsLoading(false);
        return;
      }

      try {
        const [settingsResponse, profileResponse] = await Promise.all([
          api.get('/settings'),
          api.get('/auth/profile'),
        ]);

        const settingsData = settingsResponse.data;
        const profileData = profileResponse.data;

        if (profileData.email !== email) {
          throw new Error("Los datos del perfil no corresponden al usuario autenticado");
        }

        setSettings(settingsData);
        setUserData(profileData);
        setAvatarPreview(profileData.avatar);
      } catch (err: any) {
        setErrors({ general: err.message || t.error });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token, email, t]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">{t.loading}</p>
      </div>
    );
  }

  if (errors.general && Object.keys(errors).length === 1) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <Card className="max-w-4xl mx-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              {t.error}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-500 mb-4">{errors.general}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white"
            >
              {t.retry}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-8 transition-colors duration-300">
      <Card className="max-w-4xl mx-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 shadow-lg">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <SettingsIcon className="h-6 w-6 text-gray-700 dark:text-gray-200" />
            <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              {t.title}
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex flex-wrap border-b border-gray-200 dark:border-gray-700 mb-6">
            {["general", "security", "notifications", "users"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as typeof activeTab)}
                className={`px-4 py-2 font-medium flex items-center space-x-2 ${
                  activeTab === tab
                    ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                }`}
              >
                {tab === "general" && <FileText className="h-4 w-4" />}
                {tab === "security" && <Lock className="h-4 w-4" />}
                {tab === "notifications" && <Bell className="h-4 w-4" />}
                {tab === "users" && <Users className="h-4 w-4" />}
                <span>{t[tab]}</span>
              </button>
            ))}
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
                    <span>{t.contractPrefix}</span>
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
                    <span>{t.autoNumbering}</span>
                  </Label>
                  <Switch
                    id="autoNumbering"
                    checked={settings.autoNumbering}
                    onCheckedChange={(checked) => handleSwitchChange("autoNumbering", checked)}
                  />
                </div>

                <div>
                  <Label
                    htmlFor="defaultExpirationDays"
                    className="flex items-center space-x-2 mb-2 text-gray-700 dark:text-gray-200"
                  >
                    <FileText className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    <span>{t.expirationDays}</span>
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
                    <span>{t.retentionYears}</span>
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
                    <span>{t.signatureMethod}</span>
                  </Label>
                  <Select
                    value={settings.signatureMethod}
                    onValueChange={(value) => setSettings({ ...settings, signatureMethod: value })}
                  >
                    <SelectTrigger className="w-[280px] bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-700">
                      <SelectValue placeholder="Seleccione método de firma" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-700">
                      <SelectItem value="digital">{t.signatureMethod} digital</SelectItem>
                      <SelectItem value="manual">{t.signatureMethod} manual</SelectItem>
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
                    <span>{t.allowEditing}</span>
                  </Label>
                  <Switch
                    id="allowEditing"
                    checked={settings.allowEditing}
                    onCheckedChange={(checked) => handleSwitchChange("allowEditing", checked)}
                  />
                </div>

                <div>
                  <Label className="flex items-center space-x-2 mb-2 text-gray-700 dark:text-gray-200">
                    <Lock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    <span>{t.approvalWorkflow}</span>
                  </Label>
                  <Select
                    value={settings.approvalWorkflow}
                    onValueChange={(value) => setSettings({ ...settings, approvalWorkflow: value })}
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
                    <span>{t.emailNotifications}</span>
                  </Label>
                  <Switch
                    id="emailNotifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleSwitchChange("emailNotifications", checked)}
                  />
                </div>

                <div>
                  <Label
                    htmlFor="notificationDays"
                    className="flex items-center space-x-2 mb-2 text-gray-700 dark:text-gray-200"
                  >
                    <Bell className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    <span>{t.notificationDays}</span>
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
                      <span>{t.name}</span>
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
                      <span>{t.email}</span>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={userData.email}
                      onChange={handleUserDataChange}
                      className="max-w-xs bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-700"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <Label
                      htmlFor="phone"
                      className="flex items-center space-x-2 mb-2 text-gray-700 dark:text-gray-200"
                    >
                      <Phone className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      <span>{t.phone}</span>
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={userData.phone}
                      onChange={handleUserDataChange}
                      className="max-w-xs bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-700"
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <Label className="flex items-center space-x-2 mb-2 text-gray-700 dark:text-gray-200">
                      <Globe className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      <span>{t.language}</span>
                    </Label>
                    <Select
                      value={userData.language}
                      onValueChange={(value: Language) => setUserData({ ...userData, language: value })}
                    >
                      <SelectTrigger className="w-[280px] bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-700">
                        <SelectValue placeholder="Seleccione un idioma" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-700">
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="en">Inglés</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label
                      htmlFor="password"
                      className="flex items-center space-x-2 mb-2 text-gray-700 dark:text-gray-200"
                    >
                      <Lock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      <span>{t.password}</span>
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="max-w-xs bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-700"
                      placeholder="Dejar en blanco para no cambiar"
                    />
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                  </div>

                  <div>
                    <Label
                      htmlFor="confirmPassword"
                      className="flex items-center space-x-2 mb-2 text-gray-700 dark:text-gray-200"
                    >
                      <Lock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      <span>{t.confirmPassword}</span>
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="max-w-xs bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-700"
                      placeholder="Repita la nueva contraseña"
                    />
                    {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                  </div>
                </div>

                <div>
                  <Label className="flex items-center space-x-2 mb-2 text-gray-700 dark:text-gray-200">
                    <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    <span>{t.avatar}</span>
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
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t.uploadAvatar}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                  <Button
                    onClick={handleUserSave}
                    className="bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {t.saveUser}
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
                  {t.save}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
