import { useEffect, useRef, useState } from "react";
import { Filter, X, Check } from "lucide-react";

export default function FinancesDropdown({ onFiltersChange }) {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState([]);
  const dropdownRef = useRef(null);

  const fields = [
    { column: "fixa", label: "Tipo", type: "select", options: ["Fixa", "Variável"] },
    { column: "categoria", label: "Categoria", type: "text" },
    { column: "status", label: "Status", type: "select", options: ["Pago", "Pendente"] },
    { column: "data", label: "Período", type: "date" },
    { column: "descricao", label: "Descrição", type: "text" },
    { column: "metodo", label: "Método", type: "text" },
    { column: "valor", label: "Valor", type: "text" },
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleApply = (column, value, start = "", end = "") => {
    const newFilter = { column, value, start, end, operator: start || end ? "between" : "=" };
    setFilters((prev) => {
      const updated = [...prev.filter((f) => f.column !== column), newFilter];
      onFiltersChange?.(updated);
      return updated;
    });
  };

  const handleRemove = (column) => {
    setFilters((prev) => {
      const updated = prev.filter((f) => f.column !== column);
      onFiltersChange?.(updated);
      return updated;
    });
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 flex items-center gap-2 hover:bg-gray-50"
      >
        <Filter className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute top-0 left-full ml-2 bg-white border border-gray-200 shadow-lg rounded-lg p-4 w-80 z-50 ">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium text-gray-700">Filtros</span>
            <button onClick={() => setFilters([])} className="text-gray-400 hover:text-gray-600">
              limpar
            </button>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto overflow-x-hidden">
            {fields.map((f) => {
              const active = filters.find((af) => af.column === f.column);
              const value = active?.value || "";
              const start = active?.start || "";
              const end = active?.end || "";

              return (
                <div key={f.column}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>

                  {f.type === "select" && (
                    <select
                      value={value}
                      onChange={(e) => handleApply(f.column, e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Todos</option>
                      {f.options.map((op) => (
                        <option key={op} value={op}>{op}</option>
                      ))}
                    </select>
                  )}

                  {f.type === "text" && (
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => handleApply(f.column, e.target.value)}
                      placeholder="Digite o valor"
                      className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500"
                    />
                  )}

                  {f.type === "date" && (
                    <div className="flex gap-2">
                      <input
                        type="date"
                        value={start}
                        onChange={(e) => handleApply(f.column, value, e.target.value, end)}
                        className="w-1/2 border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500"
                      />
                      <input
                        type="date"
                        value={end}
                        onChange={(e) => handleApply(f.column, value, start, e.target.value)}
                        className="w-1/2 border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  )}

                  {(value || start || end) && (
                    <button
                      onClick={() => handleRemove(f.column)}
                      className="mt-1 text-xs text-red-500 hover:underline"
                    >
                      Remover
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <button
            onClick={() => setOpen(false)}
            className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md py-1.5 text-sm flex items-center justify-center gap-1"
          >
            <Check className="w-4 h-4" /> Fechar
          </button>
        </div>
      )}
    </div>
  );
}
