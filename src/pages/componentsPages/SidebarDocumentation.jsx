import React, { useState } from "react";
import { Menu } from "lucide-react";

export default function SidebarDocumentation({ menuItems = [], activeSection, setActiveSection }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Botão para mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-gray-100 dark:bg-gray-800 shadow-md"
        onClick={() => setIsOpen(true)}
      >
        <Menu className="w-6 h-6 text-gray-700 dark:text-gray-200" />
      </button>

      {/* Overlay quando menu mobile estiver aberto */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-gray-100 dark:bg-gray-900 p-4 border-r border-gray-300 dark:border-gray-700
          mt-0 md:mt-7
          transform transition-transform duration-300 
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
        `}
      >
        <h1 className="text-xl font-bold mb-6">Docs</h1>
        <nav className="flex flex-col space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id);
                setIsOpen(false); // fecha menu no mobile ao clicar
              }}
              className={`text-left p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800 ${
                activeSection === item.id ? "bg-gray-300 dark:bg-gray-700 font-semibold" : ""
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}
