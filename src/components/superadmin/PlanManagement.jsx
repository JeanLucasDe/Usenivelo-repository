
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Star, Users, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const PlanManagement = () => {
  const { toast } = useToast();

  const handleAction = (action, plan = null) => {
    toast({
      title: "🚧 Funcionalidade em desenvolvimento",
      description: `${action} ${plan ? `do plano ${plan.name}` : ''} estará disponível em breve!`,
    });
  };

  const plans = [
    {
      id: 1,
      name: 'Starter',
      price: 97,
      users: 5,
      clients: 1000,
      storage: '5GB',
      features: ['Módulos básicos', 'Suporte por email', 'Relatórios básicos'],
      subscribers: 1850,
      revenue: 179000,
      popular: false
    },
    {
      id: 2,
      name: 'Professional',
      price: 197,
      users: 15,
      clients: 'Ilimitados',
      storage: '50GB',
      features: ['Todos os módulos', 'Suporte prioritário', 'IA e automações', 'Relatórios avançados'],
      subscribers: 1200,
      revenue: 236400,
      popular: true
    },
    {
      id: 3,
      name: 'Enterprise',
      price: 397,
      users: 'Ilimitados',
      clients: 'Ilimitados',
      storage: '500GB',
      features: ['Tudo do Professional', 'Módulos customizados', 'Suporte 24/7', 'API personalizada'],
      subscribers: 371,
      revenue: 147290,
      popular: false
    }
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
            Gestão de Planos
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Configure planos, preços e funcionalidades
          </p>
        </div>
        <Button 
          onClick={() => handleAction('Criar novo plano')}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 mt-4 md:mt-0"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Plano
        </Button>
      </motion.div>

      {/* Plans Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {[
          { title: 'Total de Assinantes', value: '3,421', icon: Users, color: 'from-blue-500 to-blue-600' },
          { title: 'Receita Mensal', value: 'R$ 562K', icon: DollarSign, color: 'from-green-500 to-green-600' },
          { title: 'Plano Mais Popular', value: 'Professional', icon: Star, color: 'from-purple-500 to-purple-600' }
        ].map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
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

      {/* Plans Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 relative ${
              plan.popular ? 'ring-2 ring-blue-600 scale-105' : ''
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                  Mais Popular
                </span>
              </div>
            )}

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {plan.name}
              </h3>
              <div className="flex items-baseline justify-center mb-4">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">
                  R$ {plan.price}
                </span>
                <span className="text-gray-500 dark:text-gray-400 ml-1">/mês</span>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Usuários:</span>
                <span className="font-medium text-gray-900 dark:text-white">{plan.users}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Clientes:</span>
                <span className="font-medium text-gray-900 dark:text-white">{plan.clients}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Armazenamento:</span>
                <span className="font-medium text-gray-900 dark:text-white">{plan.storage}</span>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Funcionalidades:</h4>
              <ul className="space-y-2">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">Assinantes:</span>
                <span className="font-medium text-gray-900 dark:text-white">{plan.subscribers}</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-gray-600 dark:text-gray-300">Receita:</span>
                <span className="font-medium text-green-600 dark:text-green-400">
                  R$ {plan.revenue.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAction('Editar', plan)}
                className="flex-1"
              >
                <Edit className="w-4 h-4 mr-1" />
                Editar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAction('Excluir', plan)}
                className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Promotions Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Promoções Ativas
          </h2>
          <Button 
            onClick={() => handleAction('Criar promoção')}
            variant="outline"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Promoção
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: 'Oferta de Lançamento',
              description: '50% OFF nos primeiros 3 meses',
              status: 'Ativa',
              usage: '847 usos',
              expires: '2024-03-31'
            },
            {
              title: 'Plano Anual',
              description: '12 meses por 10 (2 meses grátis)',
              status: 'Ativa',
              usage: '234 usos',
              expires: '2024-12-31'
            }
          ].map((promo, index) => (
            <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900 dark:text-white">{promo.title}</h3>
                <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full">
                  {promo.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{promo.description}</p>
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>{promo.usage}</span>
                <span>Expira: {promo.expires}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default PlanManagement;
