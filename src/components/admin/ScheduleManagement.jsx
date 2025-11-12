
import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar, Clock, User, Video, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const ScheduleManagement = () => {
  const { toast } = useToast();

  const handleAction = (action, appointment = null) => {
    toast({
      title: "🚧 Funcionalidade em desenvolvimento",
      description: `${action} ${appointment ? `para ${appointment.title}` : ''} estará disponível em breve!`,
    });
  };

  const appointments = [
    {
      id: 1,
      time: '09:00 - 10:00',
      title: 'Reunião de Alinhamento',
      client: 'TechStart Ltda',
      type: 'Online',
      icon: Video,
      status: 'Concluído'
    },
    {
      id: 2,
      time: '11:00 - 12:00',
      title: 'Apresentação de Proposta',
      client: 'Novo Cliente Potencial',
      type: 'Online',
      icon: Video,
      status: 'Agendado'
    },
    {
      id: 3,
      time: '14:00 - 15:30',
      title: 'Consultoria Financeira',
      client: 'Consultoria Pro',
      type: 'Presencial',
      icon: MapPin,
      status: 'Agendado'
    },
    {
      id: 4,
      time: '16:00 - 16:30',
      title: 'Follow-up Rápido',
      client: 'E-commerce Plus',
      type: 'Telefone',
      icon: Clock,
      status: 'Agendado'
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
            Agendamentos
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Gerencie seus compromissos e reuniões
          </p>
        </div>
        <Button 
          onClick={() => handleAction('Novo agendamento')}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 mt-4 md:mt-0"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Compromisso
        </Button>
      </motion.div>

      {/* Calendar View (Placeholder) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Hoje, 21 de Setembro
          </h2>
          <Button 
            variant="outline" 
            onClick={() => handleAction('Visualizar calendário')}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Ver Calendário
          </Button>
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {appointments.map((appointment, index) => (
            <motion.div
              key={appointment.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className={`p-4 rounded-lg flex items-start space-x-4 ${
                appointment.status === 'Concluído' 
                  ? 'bg-gray-100 dark:bg-gray-700 opacity-60' 
                  : 'bg-blue-50 dark:bg-blue-900/30'
              }`}
            >
              <div className="w-20 text-center">
                <p className="font-bold text-gray-900 dark:text-white">{appointment.time.split(' - ')[0]}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{appointment.time.split(' - ')[1]}</p>
              </div>
              <div className="flex-1 border-l-2 border-blue-500 pl-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">{appointment.title}</h3>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mt-1 space-x-4">
                  <div className="flex items-center">
                    <User className="w-3 h-3 mr-1" />
                    <span>{appointment.client}</span>
                  </div>
                  <div className="flex items-center">
                    <appointment.icon className="w-3 h-3 mr-1" />
                    <span>{appointment.type}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  appointment.status === 'Concluído'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                }`}>
                  {appointment.status}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => handleAction('Ver detalhes', appointment)}
                >
                  Detalhes
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Activity Reports */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Relatórios de Atividades
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Reuniões esta semana', value: '15' },
            { title: 'Horas em reunião', value: '22.5h' },
            { title: 'Taxa de comparecimento', value: '95%' }
          ].map((report, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">{report.title}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{report.value}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 text-right">
          <Button 
            variant="outline"
            onClick={() => handleAction('Ver relatórios completos')}
          >
            Ver Relatórios Completos
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default ScheduleManagement;
