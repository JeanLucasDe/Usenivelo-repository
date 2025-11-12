import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function ChartsSection({ filteredTransactions = [], expenseDistribution = [], cardType }) {
  const [activeChart, setActiveChart] = useState("barras");
  const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"];

  return (
    <div className="flex flex-col gap-4 mb-6 mt-10">
      {/* --- Abas / Toggle --- */}
      <div className="flex items-center justify-center gap-2 mb-2 md:hidden">
        <button
          onClick={() => setActiveChart("barras")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeChart === "barras"
              ? "bg-green-600 text-white shadow-sm"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Barras
        </button>
        <button
          onClick={() => setActiveChart("pizza")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeChart === "pizza"
              ? "bg-green-600 text-white shadow-sm"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Pizza
        </button>
      </div>

      {/* --- Gráficos --- */}
      <div className="flex flex-wrap gap-4 justify-center">
        {/* --- Gráfico de Barras --- */}
        <div
          className={`flex-1 min-w-[300px] bg-gray-50 rounded-xl p-4 shadow-sm transition-all duration-300 ${
            activeChart === "barras" ? "block" : "hidden lg:block"
          }`}
        >
          <h4 className="font-semibold mb-2 text-sm lg:text-base text-gray-700 text-center lg:text-left">
            {cardType == 'saida' ? 'Despesas Fixas e Variáveis por Categoria': 'Entradas'}
          </h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              layout="vertical"
              data={(() => {
                const fixas = filteredTransactions.filter((t) => t.fixa);
                const variaveis = filteredTransactions.filter((t) => !t.fixa);
                const totalFixas = fixas.reduce((sum, t) => sum + Number(t.valor), 0);
                const porCategoria = {};
                variaveis.forEach((t) => {
                  porCategoria[t.categoria] = (porCategoria[t.categoria] || 0) + Number(t.valor);
                });
                return [
                  { categoria: "Fixas", valor: totalFixas },
                  ...Object.entries(porCategoria).map(([cat, val]) => ({
                    categoria: cat,
                    valor: val,
                  })),
                ];
              })()}
              margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tick={{ fontSize: 10 }} />
              <YAxis dataKey="categoria" type="category" width={70} tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v) => `R$ ${v.toLocaleString("pt-BR")}`} />
              <Bar dataKey="valor" fill="#3b82f6" radius={[0, 8, 8, 0]}>
                {(() => {
                  const cores = COLORS;
                  const categorias = filteredTransactions.map((t) => t.categoria);
                  const unicas = ["Fixas", ...new Set(categorias)];
                  return unicas.map((_, i) => <Cell key={i} fill={cores[i % cores.length]} />);
                })()}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* --- Gráfico de Pizza --- */}
        <div
          className={`flex-1 min-w-[300px] bg-gray-50 rounded-xl p-4 shadow-sm transition-all duration-300 ${
            activeChart === "pizza" ? "block" : "hidden lg:block"
          }`}
        >
          <h4 className="font-semibold mb-2 text-sm lg:text-base text-gray-700 text-center lg:text-left">
            Distribuição de {cardType}
          </h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={expenseDistribution}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                label={window.innerWidth > 640}
              >
                {expenseDistribution.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `R$ ${v.toLocaleString()}`} />
              <Legend
                layout="vertical"
                verticalAlign="middle"
                align="right"
                wrapperStyle={{ fontSize: "10px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
