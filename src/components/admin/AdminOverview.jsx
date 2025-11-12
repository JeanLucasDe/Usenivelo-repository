
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  FileText
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';

const AdminOverview = () => {
  const { toast } = useToast();

  const handleCardClick = () => {
    toast({
      title: "🚧 Funcionalidade em desenvolvimento",
      description: "Esta funcionalidade estará disponível em breve!",
    });
  };

  const stats = [
    {
      title: 'Novos Clientes',
      value: '12',
      change: '+5%',
      icon: Users,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Faturamento Mensal',
      value: 'R$ 12.5K',
      change: '+15%',
      icon: DollarSign,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Compromissos Hoje',
      value: '5',
      change: '2 concluídos',
      icon: Calendar,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Taxa de Conversão',
      value: '25%',
      change: '+3%',
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const revenueData = [
    { month: 'Jan', revenue: 8000 },
    { month: 'Fev', revenue: 9500 },
    { month: 'Mar', revenue: 11000 },
    { month: 'Abr', revenue: 10500 },
    { month: 'Mai', revenue: 12000 },
    { month: 'Jun', revenue: 12500 }
  ];

  const clientData = [
    { month: 'Jan', clients: 5 },
    { month: 'Fev', clients: 8 },
    { month: 'Mar', clients: 10 },
    { month: 'Abr', clients: 12 },
    { month: 'Mai', clients: 15 },
    { month: 'Jun', clients: 12 }
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
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Visão geral do seu negócio em tempo real
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <Button 
            onClick={handleCardClick}
            variant="outline"
          >
            <FileText className="w-4 h-4 mr-2" />
            Exportar PDF
          </Button>
          <Button 
            onClick={handleCardClick}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Novo Relatório
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 card-hover cursor-pointer"
            onClick={handleCardClick}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                  {stat.value}
                </p>
                <p className={`text-sm mt-1 ${stat.change.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                  {stat.change}
                </p>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Faturamento Mensal
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `R$ ${value.toLocaleString()}`} />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#8b5cf6" 
                strokeWidth={3}
                dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* New Clients Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Novos Clientes
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={clientData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="clients" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Alerts and Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Alertas Importantes
          </h3>
          <div className="space-y-4">
            {[
              {
                title: 'Fatura Vencida',
                description: 'Cliente TechStart Ltda - R$ 500,00',
                icon: AlertTriangle,
                color: 'text-red-500'
              },
              {
                title: 'Reunião em 30 min',
                description: 'Alinhamento com Consultoria Pro',
                icon: Calendar,
                color: 'text-blue-500'
              },
              {
                title: 'Contrato a Vencer',
                description: 'E-commerce Plus - renovação em 5 dias',
                icon: FileText,
                color: 'text-orange-500'
              }
            ].map((alert, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className={`w-10 h-10 ${alert.color} bg-opacity-10 rounded-lg flex items-center justify-center`}>
                  <alert.icon className={`w-5 h-5 ${alert.color}`} />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{alert.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{alert.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* To-Do List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Tarefas Pendentes
          </h3>
          <div className="space-y-4">
            {[
              { task: 'Enviar proposta para novo cliente', priority: 'Alta' },
              { task: 'Follow-up com João Santos', priority: 'Média' },
              { task: 'Preparar relatório mensal', priority: 'Baixa' },
              { task: 'Agendar reunião de equipe', priority: 'Média' }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-gray-400 mr-3 cursor-pointer hover:text-green-500" onClick={handleCardClick} />
                  <p className="text-gray-900 dark:text-white">{item.task}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  item.priority === 'Alta' ? 'bg-red-100 text-red-800' :
                  item.priority === 'Média' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {item.priority}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminOverview;
