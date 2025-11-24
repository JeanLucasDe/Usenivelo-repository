import React, { useState, useMemo, useEffect } from "react";
import { Trash2, X } from "lucide-react";
import TransactionModal from "./TransactionModal";
import FinancesDropdown from "./DropDowns/FinancesDropdown";
import ChartsSection from "./FinancesComponents/ChartsSection";

const CardDetailFinances = ({
  isOpen,
  onClose,
  cardType,
  transactions,
  fetchTransactions,
  originTransactions,
  fetchTransactionsOrigin,
  date
}) => {
  const [loading, setLoading] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  const [selectData, setSelectData] = useState({});
  const [openModalDetail, setOpenModalDetail] = useState(false);

  // ---------------------------
  // Função para filtrar transações
  // ---------------------------
 const applyFilters = (transactions, activeFilters = [], cardType, currentDate) => {
  if (!Array.isArray(transactions)) return [];

  let filtered = [...transactions];

  filtered = filtered.filter(item => {
    const itemDate = new Date(item.data || item.created_at);

    // 1️⃣ Filtra por tipo (entrada/saida)
    if (cardType && item.tipo !== cardType) return false;

    // 2️⃣ Filtra por mês/ano (mas mantém fixas sempre)
   if (currentDate) {
  const selectedMonth = currentDate.getMonth();
  const selectedYear = currentDate.getFullYear();

  const itemDateObj = new Date(item.data || item.created_at);
  const itemMonth = itemDateObj.getMonth();
  const itemYear = itemDateObj.getFullYear();

  // Mantém fixas sempre
  if (!item.fixa && (itemMonth !== selectedMonth || itemYear !== selectedYear)) {
    return false;
  }
}




    return true;
  });

  // 3️⃣ Aplica filtros ativos adicionais
  (activeFilters || []).forEach(f => {
    if (!f || !f.column) return;

    // Filtro de intervalo de datas
    if (f.operator === "between") {
      const start = f.start ? new Date(f.start) : f?.value?.start ? new Date(f.value.start) : null;
      const end = f.end ? new Date(f.end) : f?.value?.end ? new Date(f.value.end) : null;
      if (start || end) {
        filtered = filtered.filter(item => {
          const d = new Date(item.data || item.created_at);
          if (start && d < start) return false;
          if (end) {
            const inclusiveEnd = new Date(end);
            inclusiveEnd.setHours(23, 59, 59, 999);
            if (d > inclusiveEnd) return false;
          }
          return true;
        });
      }
      return;
    }

    // Filtro de fixas
    if (f.column === "fixa") {
      if (!f.value) return;
      const wantFixa = String(f.value).toLowerCase() === "fixa" || String(f.value) === "1" || String(f.value).toLowerCase() === "true";
      filtered = filtered.filter(item => Boolean(item.fixa) === wantFixa);
      return;
    }

    // Filtro de status (usando parcelas)
   if (f.column === "status") {
      if (!f.value) return;
      const desired = String(f.value).toLowerCase();
      filtered = filtered.filter(item => String(item.status).toLowerCase() === desired);
    }

    // Filtros gerais (categoria, descricao, tipo, etc.)
    if (f.value !== undefined && f.value !== null) {
      const target = String(f.value).toLowerCase();
      filtered = filtered.filter(item => {
        const raw = item[f.column];
        if (raw === undefined || raw === null) return false;
        const val = String(raw).toLowerCase();
        switch (f.operator) {
          case "=": return val === target;
          case "!=": return val !== target;
          case ">": return Number(raw) > Number(f.value);
          case "<": return Number(raw) < Number(f.value);
          case "ilike":
          case "like": return val.includes(target);
          default: return val.includes(target);
        }
      });
    }
  });

  // 4️⃣ Ordena por data decrescente
  filtered.sort((a, b) => {
    const da = new Date(a.data || a.created_at);
    const db = new Date(b.data || b.created_at);
    return db - da;
  });

  return filtered;
};





  // ---------------------------
  // Estado das transações filtradas
  // ---------------------------
  const [filteredTransactions, setFilteredTransactions] = useState(
    applyFilters(originTransactions, activeFilters, cardType)
  );

  useEffect(() => {
  setFilteredTransactions(
    applyFilters(originTransactions, activeFilters, cardType,date)
  );
}, [originTransactions, activeFilters, cardType, transactions, date]);



  // ---------------------------
  // Distribuição de despesas (para gráficos)
  // ---------------------------
  const expenseDistribution = useMemo(() => {
    const distribution = {};

    filteredTransactions.forEach(t => {
      if (t.tipo === "saida" && t.categoria) {
        distribution[t.categoria] = (distribution[t.categoria] || 0) + Number(t.valor);
      }
      if (Array.isArray(t.parcelas_detalhes) && t.tipo === "saida") {
        t.parcelas_detalhes.forEach(p => {
          const valorParcela = Number(p.valor) || 0;
          if (t.categoria) distribution[t.categoria] = (distribution[t.categoria] || 0) + valorParcela;
        });
      }
    });

    return Object.entries(distribution).map(([name, value]) => ({ name, value }));
  }, [filteredTransactions]);

  // ---------------------------
  // Formata data para display
  // ---------------------------
  const formatLocalDate = iso => {
    if (!iso) return "";
    const [year, month, day] = iso.split("T")[0].split("-");
    return `${day}/${month}/${year}`;
  };

  if (!isOpen) return null;

  // ---------------------------
  // Render
  // ---------------------------
  return (
    <div>
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Detalhes de {cardType}</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        

        {/* Gráficos */}
        <ChartsSection
          filteredTransactions={filteredTransactions}
          expenseDistribution={expenseDistribution}
          cardType={cardType}
        />

        {/* Lista detalhada */}
        <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
 <div className="flex  items-center mb-3 ">
            <h4 className="font-semibold mb-2 mr-2">Transações</h4>
            {/* Filters bar */}
            <div className="flex gap-2 mb-4">
              <FinancesDropdown
                  filters={activeFilters}
                  onFiltersChange={novosFiltros => {
                    setActiveFilters(Array.isArray(novosFiltros) ? novosFiltros.filter(Boolean) : []);
                  }}
                />
              {activeFilters.map(f => (
                <div
                  key={f.column}
                  className="bg-gray-200 text-sm px-2 py-1 rounded-md flex items-center gap-2"
                >
                  <span className="font-medium">{f.column}</span>
                  <span className="text-xs text-gray-700">
                    {f.operator === "between"
                      ? `${f.start || f?.value?.start || "..."} → ${f.end || f?.value?.end || "..."}`
                      : String(f.value ?? "")}
                  </span>
                  <button
                    className="ml-1 text-gray-600 hover:text-red-500"
                    onClick={() => setActiveFilters(activeFilters.filter(p => p.column !== f.column))}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
            
          </div>
          {/* Mobile */}
          <div className="flex flex-col gap-3 lg:hidden">
            {loading ? (
              <div className="text-center py-4">Carregando...</div>
            ) : filteredTransactions.length === 0 ? (
              <div className="text-center py-4">Nenhuma transação encontrada.</div>
            ) : (
              filteredTransactions.map(t => (
                <div
                  key={t.id}
                  className="border rounded-lg p-3 bg-white shadow-sm cursor-pointer hover:bg-gray-100 transition"
                  onClick={() => {
                    setOpenModalDetail(true);
                    setSelectData(t);
                  }}
                >
                  <div className="flex justify-between">
                    <span className="font-medium">{t.name}</span>
                    <span className={`font-semibold ${t.fixa ? "text-blue-600" : t.tipo === "entrada" ? "text-green-600" : "text-red-600"}`}>
                      R$ {Number(t.valor).toLocaleString("pt-BR")}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1 space-y-0.5">
                    <div>Data: {formatLocalDate(t.data || t.created_at)}</div>
                    <div>Categoria: {t.categoria}</div>
                  </div>
                </div>
              ))
            )}
          </div>
          {/* Desktop */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-gray-600">
                <tr>
                  <th className="py-2">Data</th>
                  <th>Tipo</th>
                  <th>Nome</th>
                  <th>Descrição</th>
                  <th>Categoria</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody className="text-gray-800">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4">Carregando...</td>
                  </tr>
                ) : filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4">Nenhuma transação encontrada.</td>
                  </tr>
                ) : (
                  filteredTransactions.map(t => (
                    <tr
                      key={t.id}
                      className={`border-t border-gray-200 cursor-pointer hover:bg-gray-300 transition ${t.fixa ? "bg-blue-50" : ""}`}
                      onClick={() => {
                        setOpenModalDetail(true);
                        setSelectData(t);
                      }}
                    >
                      <td className="py-2">{formatLocalDate(t.data || t.created_at)}</td>
                      <td className={t.fixa ? "text-blue-600 font-semibold" : ""}>{t.tipo}</td>
                      <td>{t.name}</td>
                      <td>{t.descricao}</td>
                      <td>{t.categoria}</td>
                      <td className={`font-semibold ${t.fixa ? "text-blue-600" : t.tipo === "entrada" ? "text-green-600" : "text-red-600"}`}>
                        R$ {Number(t.valor).toLocaleString("pt-BR")}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <TransactionModal
        isOpen={openModalDetail}
        onClose={() => setOpenModalDetail(false)}
        form_data={selectData}
        fetchTransactions={fetchTransactions}
        fetchTransactionsOrigin={fetchTransactionsOrigin}
      />
    </div>
  );
};

export default CardDetailFinances;
