import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Zap, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import LogoNivelo from "../../images/LogoNivelo.png"

export default function Header({ user, handleLogout }) {
  return (
    <header className="fixed top-0 w-full z-[2000] glass-effect backdrop-blur-md bg-white/30 dark:bg-gray-900/30 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo e nome */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-2"
        >
          <Link to="/">
            <div className="w-14 h-14 rounded-lg flex items-center justify-center">
              <img src={LogoNivelo}/>
            </div>
          </Link>
        </motion.div>

        {/* Navegação */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#recursos" className="text-gray-600 hover:text-blue-600 transition-colors">
            Recursos
          </a>
          <a href="#planos" className="text-gray-600 hover:text-blue-600 transition-colors">
            Planos
          </a>
          <a href="#depoimentos" className="text-gray-600 hover:text-blue-600 transition-colors">
            Depoimentos
          </a>
          <a href="/documentation" className="text-gray-600 hover:text-blue-600 transition-colors">
            Docs
          </a>
        </nav>

        {/* Ações do usuário */}
        <div className="flex items-center space-x-4">
          {!user && (
            <Link to="/login">
              <Button variant="ghost">Entrar</Button>
            </Link>
          )}
          {!user ? (
            <Link to="/register">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Experimente Grátis
              </Button>
            </Link>
          ) : (
            <Link to="/admin">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Meu painel
              </Button>
            </Link>
          )}
          {user && (
            <button
              onClick={handleLogout}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
