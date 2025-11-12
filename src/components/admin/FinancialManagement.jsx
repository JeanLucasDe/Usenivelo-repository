
import React from 'react';
import { motion } from 'framer-motion';
import { Plus, DollarSign, FileText, BarChart2, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const FinancialManagement = () => {
  const { toast } = useToast();

  const handleAction = (action, item = null) => {
    toast({
      title: "🚧 Funcionalidade em desenvolvimento",
      description: `${action} ${item ? `para ${item.client}` : ''} estará disponível em breve!`,
    });
  };

  const revenueData = [
    { month: 'Jan', revenue: 8000, expenses: 4500 },
    { month: 'Fev', revenue: 9500, expenses: 5000 },
    { month: 'Mar', revenue: 11000, expenses: 6000 },
    { month: 'Abr', revenue: 10500, expenses: 5500 },
    { month: 'Mai', revenue: 12000, expenses: 6200 },
    { month: 'Jun', revenue: 12500, expenses: 6500 }
  ];

  const recentTransactions = [
    { id: 1, client: 'TechStart Ltda', amount: 1500, status: 'Pago', date: '2024-09-20' },
    { id: 2, client: 'Consultoria Pro', amount: 2500, status: 'Pendente', date: '2024-09-18' },
    { id: 3, client: 'E-commerce Plus', amount: 800, status: 'Vencido', date: '2024-09-15' },
    { id: 4, client: 'Marketing Digital', amount: 1200, status: 'Pago', date: '2024-09-12' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
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
            Controle suas finanças, faturamento e pagamentos
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <Button 
            onClick={() => handleAction('Gerar boleto')}
            variant="outline"
          >
            <FileText className="w-4 h-4 mr-2" />
            Gerar Boleto
          </Button>
          <Button 
            onClick={() => handleAction('Nova transação')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Transação
          </Button>
        </div>
      </motion.div>

      {/* Financial Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {[
          { title: 'Faturamento no Mês', value: 'R$ 12.5K', icon: DollarSign, color: 'from-green-500 to-green-600' },
          { title: 'Contas a Receber', value: 'R$ 4.8K', icon: BarChart2, color: 'from-blue-500 to-blue-600' },
          { title: 'Contas Vencidas', value: 'R$ 800', icon: AlertTriangle, color: 'from-red-500 to-red-600' }
        ].map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                  {stat.value}
                </p>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Revenue and Expenses Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Receitas vs Despesas
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => `R$ ${value.toLocaleString()}`} />
            <Line type="monotone" dataKey="revenue" name="Receitas" stroke="#34d399" strokeWidth={3} />
            <Line type="monotone" dataKey="expenses" name="Despesas" stroke="#f87171" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Transações Recentes
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {recentTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {transaction.client}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    R$ {transaction.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(transaction.date).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      transaction.status === 'Pago' ? 'bg-green-100 text-green-800' :
                      transaction.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleAction('Ver detalhes', transaction)}
                    >
                      Detalhes
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default FinancialManagement;
