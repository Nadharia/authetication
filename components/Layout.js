

import { useState } from "react"
import { useRouter } from "next/router"
import classNames from "classnames"
import { useUser } from "@/components/UserContext"
import Search from "./Search"
import Link from "next/link"
import {
  UserGroupIcon,
  DocumentTextIcon,
  CogIcon,
  PlusIcon,
  BookOpenIcon,
  ClipboardDocumentListIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline"

export default function Layout({ children }) {
  const { user, loading, setUser } = useUser()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const router = useRouter()

  const Login = ({ isActive = true, isLoggedIn }) => {
    const loginClass = classNames("px-6 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200", {
      "bg-red-600 text-white hover:bg-red-700": isActive,
      "bg-gray-200 text-gray-400 cursor-not-allowed": !isActive,
    })

    const handleLoginClick = () => {
      if (!isLoggedIn && isActive) router.push("/")
    }

    const handleLogout = async () => {
      try {
        const res = await fetch("http://localhost:8080/auth/logout", {
          method: "POST",
          credentials: "include",
        })
        if (!res.ok) throw new Error("Error al desloguear")
        setUser(null)
        router.push("/")
      } catch (error) {
        console.error(error)
      }
    }

    if (!isLoggedIn) {
      return (
        <button onClick={handleLoginClick} className={loginClass} disabled={!isActive}>
          Iniciar Sesión
        </button>
      )
    }

    return (
      <div className="flex items-center gap-4">
        {user?.username && (
          <span className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1.5 rounded-full border border-gray-200">
            {user.username}
          </span>
        )}
        <button
          onClick={handleLogout}
          className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium transition-colors duration-200"
        >
          Cerrar Sesión
        </button>
      </div>
    )
  }

  const DropdownMenu = ({ title, icon: Icon, items, isAdmin = false }) => {
    return (
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium transition-colors duration-200 hover:bg-red-700"
        >
          <Icon className="w-4 h-4" />
          <span>{title}</span>
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown Panel */}
        <div
          className={`absolute top-full left-0 mt-2 transition-all duration-200 z-50 ${
            dropdownOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden min-w-[280px]">
            {/* Header */}
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Icon className="w-5 h-5 text-red-600" />
                <span className="font-medium text-gray-800">{title}</span>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              {items.map((item, index) => (
                <Link key={index} href={item.href} passHref>
                  <div
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-5 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                      <item.icon className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{item.label}</div>
                      <div className="text-xs text-gray-500">{item.description}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-4 py-2 border-t border-gray-200">
              <div className="text-xs text-gray-500 text-center">
                {isAdmin ? "Panel de Administración" : "Herramientas de Usuario"}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const adminMenuItems = [
    {
      href: "/_usuarios",
      label: "Gestión de Usuarios",
      description: "Ver y administrar usuarios",
      icon: UserGroupIcon,
    },
    {
      href: "/logs",
      label: "Logs del Sistema",
      description: "Revisar actividad del sistema",
      icon: ClipboardDocumentListIcon,
    },
    {
      href: "/register",
      label: "Registrar Usuario",
      description: "Crear nuevas cuentas",
      icon: UserPlusIcon,
    },
    {
      href: "/signo/crear",
      label: "Crear Signo",
      description: "Agregar nuevo signo al diccionario",
      icon: PlusIcon,
    },
    {
      href: "/diccionario",
      label: "Diccionario",
      description: "Explorar todos los signos",
      icon: BookOpenIcon,
    },
    {
      href: "/signo/signos",
      label: "Signos",
      description: "Listado de signos",
      icon: BookOpenIcon,
    },
  ]

  const userMenuItems = [
    {
      href: "/signo/crear",
      label: "Crear Signo",
      description: "Agregar nuevo signo al diccionario",
      icon: PlusIcon,
    },
    {
      href: "/diccionario",
      label: "Diccionario",
      description: "Explorar todos los signos",
      icon: BookOpenIcon,
    },

    {
      href: "/signo/signos",
      label: "Signos",
      description: "Listado de signos",
      icon: BookOpenIcon,
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-black shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" passHref>
              <h1 className="text-3xl font-bold text-red-600 cursor-pointer hover:text-red-500 transition-colors duration-200">
                Dicciotips
              </h1>
            </Link>

            <div className="hidden md:flex items-center space-x-3">
              {user && (
                <DropdownMenu
                  title={user.rol?.toLowerCase() === "admin" ? "Administración" : "Herramientas"}
                  icon={user.rol?.toLowerCase() === "admin" ? CogIcon : DocumentTextIcon}
                  items={user.rol?.toLowerCase() === "admin" ? adminMenuItems : userMenuItems}
                  isAdmin={user.rol?.toLowerCase() === "admin"}
                />
              )}
              <Login isActive={true} isLoggedIn={!!user} />
            </div>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-800 text-white transition-colors duration-200"
              aria-label="Toggle menu"
            >
              <div className="relative w-6 h-6">
                <span
                  className={`absolute block w-6 h-0.5 bg-current transition-all duration-200 ${menuOpen ? "rotate-45 top-3" : "top-1"}`}
                ></span>
                <span
                  className={`absolute block w-6 h-0.5 bg-current transition-all duration-200 top-3 ${menuOpen ? "opacity-0" : "opacity-100"}`}
                ></span>
                <span
                  className={`absolute block w-6 h-0.5 bg-current transition-all duration-200 ${menuOpen ? "-rotate-45 top-3" : "top-5"}`}
                ></span>
              </div>
            </button>
          </div>

          {/* Mobile menu */}
          <div
            className={`md:hidden overflow-hidden transition-all duration-200 ${menuOpen ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"}`}
          >
            <div className="pb-4 space-y-3">
              {/* Mobile Menu Items */}
              <div className="bg-black rounded-lg p-4">
                <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                  {user?.rol?.toLowerCase() === "admin" ? (
                    <>
                      <CogIcon className="w-5 h-5" />
                      Administración
                    </>
                  ) : (
                    <>
                      <DocumentTextIcon className="w-5 h-5" />
                      Herramientas
                    </>
                  )}
                </h3>
                <div className="space-y-2">
                  {(user?.rol?.toLowerCase() === "admin" ? adminMenuItems : userMenuItems).map((item, index) => (
                    <Link key={index} href={item.href} passHref>
                      <div className="flex items-center gap-5 p-3 rounded-lg bg-black hover:bg-gray-600 text-white transition-colors duration-150 cursor-pointer">
                        <item.icon className="w-4 h-4" />
                        <div>
                          <div className="font-medium text-sm">{item.label}</div>
                          <div className="text-xs text-gray-300">{item.description}</div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-gray-700">
                <Login isActive={true} isLoggedIn={!!user} />
              </div>
            </div>
          </div>

          <div className="mt-4 w-full">
            <div className="max-w-2xl mx-auto">
              <Search />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-6 py-8">{children}</main>
    </div>
  )
}
