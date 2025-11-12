import React from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  ArrowDownCircle,
  TrendingUp,
  FileText,
  AlertTriangle,
  CheckCircle,
  Calendar,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const FinancialOverview = () => {
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
      title: "Receita do Mês",
      value: "R$ 32.400",
      change: "+12%",
      icon: DollarSign,
      color: "from-green-500 to-green-600",
    },
    {
      title: "Despesas Totais",
      value: "R$ 18.200",
      change: "-5%",
      icon: ArrowDownCircle,
      color: "from-red-500 to-red-600",
    },
    {
      title: "Lucro Líquido",
      value: "R$ 14.200",
      change: "+8%",
      icon: TrendingUp,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Faturas Pendentes",
      value: "6",
      change: "3 vencendo hoje",
      icon: FileText,
      color: "from-orange-500 to-orange-600",
    },
  ];

  // 📈 Gráfico de linha: Receita x Despesa
  const monthlyData = [
    { month: "Jan", receita: 24000, despesa: 18000 },
    { month: "Fev", receita: 26000, despesa: 20000 },
    { month: "Mar", receita: 29000, despesa: 21000 },
    { month: "Abr", receita: 31000, despesa: 22000 },
    { month: "Mai", receita: 32000, despesa: 23000 },
    { month: "Jun", receita: 34000, despesa: 24000 },
  ];

  // 🍕 Gráfico de pizza: Distribuição de despesas
  const expenseData = [
    { name: "Marketing", value: 3500 },
    { name: "Infraestrutura", value: 2800 },
    { name: "Folha de Pagamento", value: 8500 },
    { name: "Operacional", value: 3400 },
    { name: "Outros", value: 2000 },
  ];
  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  // 📅 Transações recentes
  const transactions = [
    {
      date: "10/10/2025",
      type: "Entrada",
      category: "Venda",
      description: "Venda produto X",
      amount: "R$ 2.500",
      status: "Recebido",
    },
    {
      date: "08/10/2025",
      type: "Saída",
      category: "Marketing",
      description: "Anúncios Google",
      amount: "R$ 800",
      status: "Pago",
    },
    {
      date: "05/10/2025",
      type: "Saída",
      category: "Serviços",
      description: "Pagamento de consultoria",
      amount: "R$ 1.200",
      status: "Pendente",
    },
  ];

  // ⚠️ Alertas financeiros
  const alerts = [
    {
      title: "Fatura a vencer",
      description: "Cliente XPTO Ltda - R$ 1.200 vence amanhã",
      icon: AlertTriangle,
      color: "text-yellow-500",
    },
    {
      title: "Pagamento atrasado",
      description: "Fornecedor ABC - R$ 800 em atraso há 3 dias",
      icon: FileText,
      color: "text-red-500",
    },
    {
      title: "Revisar fluxo de caixa",
      description: "Despesas subiram 10% este mês",
      icon: TrendingUp,
      color: "text-blue-500",
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
            Financeiro
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Acompanhe receitas, despesas e fluxo de caixa em tempo real
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <Button onClick={handleClick} variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Exportar PDF
          </Button>
          <Button
            onClick={handleClick}
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
          >
            Nova Transação
          </Button>
        </div>
      </motion.div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 cursor-pointer card-hover"
            onClick={handleClick}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.title}
                </p>
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
        {/* Receita vs Despesa */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Receita x Despesa (Mensal)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(v) => `R$ ${v.toLocaleString()}`} />
              <Line
                type="monotone"
                dataKey="receita"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: "#10b981", r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="despesa"
                stroke="#ef4444"
                strokeWidth={3}
                dot={{ fill: "#ef4444", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Distribuição de Despesas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Distribuição de Despesas
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expenseData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {expenseData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `R$ ${v.toLocaleString()}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Transações e Alertas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tabela de Transações */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 overflow-x-auto"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Transações Recentes
          </h3>
          <table className="w-full text-sm text-left">
            <thead className="text-gray-600 dark:text-gray-300">
              <tr>
                <th className="py-2">Data</th>
                <th>Tipo</th>
                <th>Categoria</th>
                <th>Descrição</th>
                <th>Valor</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody className="text-gray-800 dark:text-gray-100">
              {transactions.map((t, i) => (
                <tr
                  key={i}
                  className="border-t border-gray-200 dark:border-gray-700"
                >
                  <td className="py-2">{t.date}</td>
                  <td>{t.type}</td>
                  <td>{t.category}</td>
                  <td>{t.description}</td>
                  <td>{t.amount}</td>
                  <td>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        t.status === "Recebido"
                          ? "bg-green-100 text-green-800"
                          : t.status === "Pago"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Alertas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Alertas Financeiros
          </h3>
          <div className="space-y-4">
            {alerts.map((alert, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div
                  className={`w-10 h-10 ${alert.color} bg-opacity-10 rounded-lg flex items-center justify-center`}
                >
                  <alert.icon className={`w-5 h-5 ${alert.color}`} />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {alert.title}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {alert.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FinancialOverview;
