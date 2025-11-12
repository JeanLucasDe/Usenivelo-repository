import { useEffect, useRef, useState } from "react";
import { Filter, X } from "lucide-react";

export default function FilterDropdown({ columns = [], onApply }) {
  const [open, setOpen] = useState(false);
  const [column, setColumn] = useState("");
  const [operator, setOperator] = useState("=");
  const dropdownRef = useRef(null);
  const [value, setValue] = useState("");

  const handleApply = () => {
    if (!column) return;
    onApply?.({ column, operator, value });
    setOpen(false);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleClear = () => {
    setColumn("");
    setOperator("=");
    setValue("");
    onApply?.(null); // limpa o filtro no componente pai
    setOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botão principal */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 flex items-center gap-2"
      >
        <Filter className="w-4 h-4" />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 bg-white border border-gray-300 shadow-lg rounded-lg p-3 z-50 w-64">
          <div className="space-y-2">
            {/* Coluna */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">Campo</label>
              <select
                value={column}
                onChange={(e) => setColumn(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm"
              >
                <option value="">Selecione</option>
                {columns.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Operador */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">Operador</label>
              <select
                value={operator}
                onChange={(e) => setOperator(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm"
              >
                <option value="=">Igual</option>
                <option value="!=">Diferente</option>
                <option value=">">Maior que</option>
                <option value="<">Menor que</option>
                <option value="ilike">Contém</option>
              </select>
            </div>

            {/* Valor */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">Valor</label>
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm"
                placeholder="Digite o valor"
              />
            </div>

            {/* Botões de ação */}
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleApply}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md py-1.5 text-sm"
              >
                Aplicar
              </button>
              <button
                onClick={handleClear}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md py-1.5 text-sm flex items-center justify-center gap-1"
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
