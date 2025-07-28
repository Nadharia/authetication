

import { useRef, useState, useEffect } from "react"
import { registerUser } from "@/components/services/auth"
import { useUser } from "@/components/UserContext"
import { useRouter } from "next/router"
import {
  HiOutlineMail,
  HiLockClosed,
  HiArrowLeft,
  HiUser,
  HiCheckCircle,
  HiExclamationCircle,
  HiEye,
  HiEyeOff,
} from "react-icons/hi"
import { ImSpinner8 } from "react-icons/im"

export default function Register() {
  const usernameRef = useRef()
  const emailRef = useRef()
  const passwordRef = useRef()
  const passwordConfirmRef = useRef()
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})
  const [fieldValid, setFieldValid] = useState({})
  const { user, loading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || user.rol?.toLowerCase() !== "admin")) {
      router.push("/")
    }
  }, [loading, user, router])

  const validateField = (field, value) => {
    const errors = { ...fieldErrors }
    const valid = { ...fieldValid }

    switch (field) {
      case "username":
        if (!value.trim()) {
          errors.username = "Usuario requerido"
          valid.username = false
        } else if (!/^[a-zA-Z0-9._-]+$/.test(value)) {
          errors.username = "Solo letras, números, puntos, guiones y guiones bajos"
          valid.username = false
        } else if (value.length < 3) {
          errors.username = "Mínimo 3 caracteres"
          valid.username = false
        } else {
          delete errors.username
          valid.username = true
        }
        break

      case "email":
        if (!value.trim()) {
          errors.email = "Email requerido"
          valid.email = false
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.email = "Formato de email inválido"
          valid.email = false
        } else {
          delete errors.email
          valid.email = true
        }
        break

      case "password":
        if (!value) {
          errors.password = "Contraseña requerida"
          valid.password = false
        } else if (value.length < 6) {
          errors.password = "Mínimo 6 caracteres"
          valid.password = false
        } else {
          delete errors.password
          valid.password = true
        }
        break

      case "confirmPassword":
        const password = passwordRef.current?.value || ""
        if (!value) {
          errors.confirmPassword = "Confirmar contraseña"
          valid.confirmPassword = false
        } else if (value !== password) {
          errors.confirmPassword = "Las contraseñas no coinciden"
          valid.confirmPassword = false
        } else {
          delete errors.confirmPassword
          valid.confirmPassword = true
        }
        break
    }

    setFieldErrors(errors)
    setFieldValid(valid)
  }

  const handleInputChange = (field, value) => {
    validateField(field, value)
    setError("") // Clear general error when user types
  }

  const handleValidation = async (e) => {
    e.preventDefault()

    const username = usernameRef.current.value.trim()
    const email = emailRef.current.value.trim()
    const password = passwordRef.current.value.trim()
    const confirm = passwordConfirmRef.current.value.trim()

    // Validate all fields
    validateField("username", username)
    validateField("email", email)
    validateField("password", password)
    validateField("confirmPassword", confirm)

    // Check if there are any errors
    if (Object.keys(fieldErrors).length > 0 || !username || !email || !password || !confirm) {
      setError("Por favor corrige los errores antes de continuar")
      return
    }

    setError("")
    setIsLoading(true)

    try {
      await registerUser({ username, email, password })
      setMessage("Usuario registrado correctamente")

      // Clear inputs
      usernameRef.current.value = ""
      emailRef.current.value = ""
      passwordRef.current.value = ""
      passwordConfirmRef.current.value = ""
      setFieldValid({})
      setFieldErrors({})

      // Show message and redirect
      setTimeout(() => {
        setMessage("")
        router.push("/_usuarios")
      }, 2000)
    } catch (err) {
      setError(err.message || "Error en el registro")
    } finally {
      setIsLoading(false)
    }
  }

  if (loading || !user || user.rol?.toLowerCase() !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <ImSpinner8 className="animate-spin text-red-700 text-3xl mx-auto mb-4" />
          <p className="text-gray-600">Verificando permisos...</p>
        </div>
      </div>
    )
  }

  const InputField = ({ icon: Icon, type, placeholder, inputRef, field, showToggle = false }) => {
    const hasError = fieldErrors[field]
    const isValid = fieldValid[field]
    const showPasswordToggle = showToggle && (field === "password" ? showPassword : showConfirmPassword)

    return (
      <div className="relative">
        <label className="relative block">
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" size={20} />
          <input
            type={showToggle ? (showPasswordToggle ? "text" : "password") : type}
            placeholder={placeholder}
            ref={inputRef}
            onChange={(e) => handleInputChange(field, e.target.value)}
            className={`pl-10 ${showToggle ? "pr-12" : "pr-4"} w-full border rounded-lg py-3 text-gray-900 placeholder-gray-400 focus:outline-none transition-all duration-200 ${
              hasError
                ? "border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50"
                : isValid
                  ? "border-green-500 focus:ring-2 focus:ring-green-200 bg-green-50"
                  : "border-gray-300 focus:ring-2 focus:ring-red-200 bg-white hover:border-gray-400"
            }`}
            required
          />
          {showToggle && (
            <button
              type="button"
              onClick={() =>
                field === "password" ? setShowPassword(!showPassword) : setShowConfirmPassword(!showConfirmPassword)
              }
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              {showPasswordToggle ? <HiEyeOff size={20} /> : <HiEye size={20} />}
            </button>
          )}
          {isValid && (
            <HiCheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" size={20} />
          )}
        </label>
        {hasError && (
          <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
            <HiExclamationCircle size={16} />
            <span>{hasError}</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-md mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.push("/_usuarios")}
          className="flex items-center gap-2 text-red-700 hover:text-red-800 font-medium mb-6 transition-colors duration-200 bg-white rounded-lg px-4 py-2 shadow-sm hover:shadow-md"
        >
          <HiArrowLeft size={20} />
          Volver a usuarios
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-700 to-red-800 px-8 py-6 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <HiUser className="text-white text-2xl" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Registrar Usuario</h1>
            <p className="text-red-100 text-sm">Crear una nueva cuenta de usuario</p>
          </div>

          {/* Form */}
          <div className="p-8">
            <form className="space-y-6" onSubmit={handleValidation} noValidate>
              <InputField
                icon={HiUser}
                type="text"
                placeholder="Nombre de usuario"
                inputRef={usernameRef}
                field="username"
              />

              <InputField
                icon={HiOutlineMail}
                type="email"
                placeholder="Correo electrónico"
                inputRef={emailRef}
                field="email"
              />

              <InputField
                icon={HiLockClosed}
                type="password"
                placeholder="Contraseña"
                inputRef={passwordRef}
                field="password"
                showToggle={true}
              />

              <InputField
                icon={HiLockClosed}
                type="password"
                placeholder="Confirmar contraseña"
                inputRef={passwordConfirmRef}
                field="confirmPassword"
                showToggle={true}
              />

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-700 hover:bg-red-800 disabled:bg-red-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex justify-center items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <ImSpinner8 className="animate-spin" size={20} />
                    Registrando usuario...
                  </>
                ) : (
                  <>
                    <HiCheckCircle size={20} />
                    Registrar Usuario
                  </>
                )}
              </button>
            </form>

            {/* Messages */}
            {error && (
              <div className="mt-6 bg-red-100 border border-red-300 text-red-700 rounded-lg p-4 flex items-center gap-3 animate-fadeIn">
                <HiExclamationCircle className="text-red-500 flex-shrink-0" size={20} />
                <div>
                  <p className="font-medium">Error</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            )}

            {message && (
              <div className="mt-6 bg-green-100 border border-green-300 text-green-700 rounded-lg p-4 flex items-center gap-3 animate-fadeIn">
                <HiCheckCircle className="text-green-500 flex-shrink-0" size={20} />
                <div>
                  <p className="font-medium">¡Éxito!</p>
                  <p className="text-sm">{message}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center text-gray-600 text-sm">
          <p>Solo los administradores pueden registrar nuevos usuarios</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
