import { useEffect, useRef, useState } from "react";
import { Filter, ChevronUp, ChevronDown, X, ListOrdered } from "lucide-react";

export default function DateFilterDropdown({
  onApply,
  onClear,
  defaultFilters = {},
}) {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState({
    from: defaultFilters.from || "",
    to: defaultFilters.to || "",
    month: defaultFilters.month || "",
    date: defaultFilters.created_at || "",
    sortOrder: defaultFilters.sortOrder || "asc",
  });
  const dropdownRef = useRef(null);

  // Fechar ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleApply = () => {
    onApply?.(filters);
    setOpen(false);
  };

  const handleClear = () => {
    const cleared = {
      from: "",
      to: "",
      month: "",
      date: "",
      sortOrder: "asc",
    };
    setFilters(cleared);
    onClear?.(cleared);
    setOpen(false);
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Botão principal */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 flex items-center gap-2 shadow-sm"
      >
        <ListOrdered className="w-4 h-4" />
        <span>Ordem</span>
      </button>

      {/* Dropdown flutuante para a direita */}
      {open && (
        <div
          className="absolute left-full top-0 ml-3 bg-white border border-gray-300 shadow-xl rounded-xl p-4 z-50 w-80 animate-in fade-in slide-in-from-left-2"
          style={{
            transformOrigin: "left center",
          }}
        >
          <div className="space-y-3">
            {/* De */}
            <div className="flex flex-col">
              <label className="text-xs text-gray-600 mb-1">De</label>
              <input
                type="date"
                value={filters.from}
                onChange={(e) => handleChange("from", e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>

            {/* Até */}
            <div className="flex flex-col">
              <label className="text-xs text-gray-600 mb-1">Até</label>
              <input
                type="date"
                value={filters.to}
                onChange={(e) => handleChange("to", e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>

            {/* Mês */}
            <div className="flex flex-col">
              <label className="text-xs text-gray-600 mb-1">Mês</label>
              <input
                type="month"
                value={filters.month}
                onChange={(e) => handleChange("month", e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>

            {/* Data específica */}
            <div className="flex flex-col">
              <label className="text-xs text-gray-600 mb-1">
                Data específica
              </label>
              <input
                type="date"
                value={filters.date}
                onChange={(e) => handleChange("date", e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>

            {/* Ordenação */}
            <button
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  sortOrder: prev.sortOrder === "asc" ? "desc" : "asc",
                }))
              }
              className="mt-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-1 w-full transition-all shadow-sm hover:shadow-md"
            >
              Data{" "}
              {filters.sortOrder === "asc" ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {/* Ações */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleApply}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md py-2 text-sm"
              >
                Aplicar
              </button>
              <button
                onClick={handleClear}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md py-2 text-sm flex items-center justify-center gap-1"
              >
                <X className="w-4 h-4" /> Limpar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
