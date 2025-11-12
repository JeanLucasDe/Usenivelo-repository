import React from "react";
import { motion } from "framer-motion";
import {
  BarChart2,
  FileText,
  Calendar,
  TrendingUp,
  Users,
  DollarSign,
  PieChart as PieChartIcon,
  AlertTriangle,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  BarChart,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const ReportsOverview = () => {
  const { toast } = useToast();

  const handleClick = () => {
    toast({
      title: "🚧 Função em desenvolvimento",
      description: "Esta funcionalidade estará disponível em breve!",
    });
  };

  // 📊 Estatísticas principais
  const stats = [
    {
      title: "Relatórios Gerados",
      value: "28",
      change: "+4 este mês",
      icon: FileText,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Usuários Ativos",
      value: "152",
      change: "+12%",
      icon: Users,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Faturamento Médio",
      value: "R$ 28.500",
      change: "+7%",
      icon: DollarSign,
      color: "from-green-500 to-green-600",
    },
    {
      title: "Alertas Gerados",
      value: "3",
      change: "últimos 7 dias",
      icon: AlertTriangle,
      color: "from-orange-500 to-orange-600",
    },
  ];

  // 📈 Evolução de relatórios
  const reportsData = [
    { month: "Jan", reports: 12 },
    { month: "Fev", reports: 18 },
    { month: "Mar", reports: 22 },
    { month: "Abr", reports: 26 },
    { month: "Mai", reports: 28 },
    { month: "Jun", reports: 30 },
  ];

  // 📊 Performance por categoria
  const categoryData = [
    { name: "Financeiro", value: 40 },
    { name: "Vendas", value: 25 },
    { name: "Clientes", value: 20 },
    { name: "Projetos", value: 10 },
    { name: "Outros", value: 5 },
  ];
  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  // 🧾 Últimos relatórios
  const recentReports = [
    {
      title: "Relatório de Desempenho Financeiro",
      date: "10/10/2025",
      type: "Financeiro",
      status: "Concluído",
    },
    {
      title: "Análise de Crescimento de Clientes",
      date: "09/10/2025",
      type: "Clientes",
      status: "Em andamento",
    },
    {
      title: "Relatório de Vendas Mensal",
      date: "05/10/2025",
      type: "Vendas",
      status: "Concluído",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Relatórios
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Visualize o desempenho, exporte dados e acompanhe métricas em tempo real
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <Button onClick={handleClick} variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Exportar PDF
          </Button>
          <Button
            onClick={handleClick}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Novo Relatório
          </Button>
        </div>
      </motion.div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 cursor-pointer"
            onClick={handleClick}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                  {stat.value}
                </p>
                <p
                  className={`text-sm mt-1 ${
                    stat.change.startsWith("+")
                      ? "text-green-600 dark:text-green-400"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {stat.change}
                </p>
              </div>
              <div
                className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}
              >
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Linha - Relatórios mensais */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Evolução de Relatórios Mensais
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={reportsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="reports"
                stroke="#8b5cf6"
                strokeWidth={3}
                dot={{ fill: "#8b5cf6", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pizza - Distribuição */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Relatórios por Categoria
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Últimos Relatórios */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 overflow-x-auto"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Relatórios Recentes
        </h3>
        <table className="w-full text-sm text-left">
          <thead className="text-gray-600 dark:text-gray-300">
            <tr>
              <th className="py-2">Título</th>
              <th>Data</th>
              <th>Tipo</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody className="text-gray-800 dark:text-gray-100">
            {recentReports.map((r, i) => (
              <tr
                key={i}
                className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition"
              >
                <td className="py-2">{r.title}</td>
                <td>{r.date}</td>
                <td>{r.type}</td>
                <td>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      r.status === "Concluído"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
};

export default ReportsOverview;
