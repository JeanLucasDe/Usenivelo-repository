
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Building, 
  DollarSign, 
  TrendingUp, 
  Activity,
  Globe,
  Shield,
  Zap
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useToast } from '@/components/ui/use-toast';

const SuperAdminOverview = () => {
  const { toast } = useToast();

  const handleCardClick = () => {
    toast({
      title: "🚧 Funcionalidade em desenvolvimento",
      description: "Esta funcionalidade estará disponível em breve!",
    });
  };

  const stats = [
    {
      title: 'Total de Usuários',
      value: '12,847',
      change: '+12%',
      icon: Users,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Empresas Ativas',
      value: '3,421',
      change: '+8%',
      icon: Building,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Receita Mensal',
      value: 'R$ 847K',
      change: '+23%',
      icon: DollarSign,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Taxa de Crescimento',
      value: '18.2%',
      change: '+5%',
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const revenueData = [
    { month: 'Jan', revenue: 450000, users: 2800 },
    { month: 'Fev', revenue: 520000, users: 3200 },
    { month: 'Mar', revenue: 680000, users: 3800 },
    { month: 'Abr', revenue: 750000, users: 4200 },
    { month: 'Mai', revenue: 820000, users: 4600 },
    { month: 'Jun', revenue: 847000, users: 4950 }
  ];

  const planDistribution = [
    { plan: 'Starter', count: 1850, revenue: 179000 },
    { plan: 'Professional', count: 1200, revenue: 236400 },
    { plan: 'Enterprise', count: 371, revenue: 147290 }
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
            Visão Geral do Sistema
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Monitore o desempenho global da plataforma FlexiSaaS
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <div className="flex items-center space-x-2 px-3 py-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
            <Activity className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-green-600 dark:text-green-400">
              Sistema Online
            </span>
          </div>
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
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                  {stat.change} vs mês anterior
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
            Receita e Crescimento de Usuários
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'revenue' ? `R$ ${value.toLocaleString()}` : value,
                  name === 'revenue' ? 'Receita' : 'Usuários'
                ]}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#8b5cf6" 
                strokeWidth={3}
                dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="users" 
                stroke="#06b6d4" 
                strokeWidth={3}
                dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Plan Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Distribuição por Planos
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={planDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="plan" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'revenue' ? `R$ ${value.toLocaleString()}` : value,
                  name === 'revenue' ? 'Receita' : 'Clientes'
                ]}
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* System Health */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Status do Sistema
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Servidores',
              status: 'Operacional',
              icon: Globe,
              color: 'text-green-600 dark:text-green-400'
            },
            {
              title: 'Segurança',
              status: 'Protegido',
              icon: Shield,
              color: 'text-blue-600 dark:text-blue-400'
            },
            {
              title: 'Performance',
              status: 'Excelente',
              icon: Zap,
              color: 'text-purple-600 dark:text-purple-400'
            }
          ].map((item, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className={`w-10 h-10 ${item.color} bg-opacity-10 rounded-lg flex items-center justify-center`}>
                <item.icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{item.title}</p>
                <p className={`text-sm ${item.color}`}>{item.status}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Atividade Recente
        </h3>
        <div className="space-y-4">
          {[
            { action: 'Nova empresa cadastrada', company: 'TechStart Ltda', time: '2 min atrás' },
            { action: 'Upgrade de plano', company: 'Consultoria Pro', time: '15 min atrás' },
            { action: 'Pagamento processado', company: 'E-commerce Plus', time: '1 hora atrás' },
            { action: 'Novo usuário adicionado', company: 'Marketing Digital', time: '2 horas atrás' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{activity.action}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{activity.company}</p>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default SuperAdminOverview;
