
    import React, { useState } from 'react';
    import { motion } from 'framer-motion';
    import { Filter, Check, Archive, Bell, Plus } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import { useToast } from '@/components/ui/use-toast';

    const AlertsCenter = () => {
      const { toast } = useToast();
      const [alerts, setAlerts] = useState([
        { id: 1, type: 'Financeiro', message: 'Fatura #123 para TechStart Ltda está vencida.', date: '2024-09-20', read: false },
        { id: 2, type: 'Compromisso', message: 'Reunião "Alinhamento" com Consultoria Pro começa em 30 minutos.', date: '2024-09-21', read: false },
        { id: 3, type: 'Cliente', message: 'Contrato com E-commerce Plus vence em 5 dias.', date: '2024-09-21', read: true },
        { id: 4, type: 'Sistema', message: 'Backup do sistema concluído com sucesso.', date: '2024-09-21', read: true },
        { id: 5, type: 'Financeiro', message: 'Pagamento de R$ 1.200,00 recebido de Marketing Digital.', date: '2024-09-19', read: true },
      ]);

      const handleAction = (action, alert = null) => {
        toast({
          title: "🚧 Funcionalidade em desenvolvimento",
          description: `${action} ${alert ? `do alerta "${alert.message.substring(0, 20)}..."` : ''} estará disponível em breve!`,
        });
      };

      const markAsRead = (alertId) => {
        setAlerts(alerts.map(alert => alert.id === alertId ? { ...alert, read: true } : alert));
      };

      const getAlertIcon = (type) => {
        switch (type) {
          case 'Financeiro': return 'bg-green-100 text-green-800';
          case 'Compromisso': return 'bg-blue-100 text-blue-800';
          case 'Cliente': return 'bg-yellow-100 text-yellow-800';
          case 'Sistema': return 'bg-purple-100 text-purple-800';
          default: return 'bg-gray-100 text-gray-800';
        }
      };

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
                Central de Alertas
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Todas as notificações importantes em um só lugar
              </p>
            </div>
            <div className="flex items-center space-x-2 mt-4 md:mt-0">
              <Button 
                variant="outline"
                onClick={() => handleAction('Filtrar alertas')}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
              <Button 
                onClick={() => handleAction('Criar alerta customizado')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Criar Alerta
              </Button>
            </div>
          </motion.div>

          {/* Alerts List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-4"
          >
            {alerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 rounded-lg flex items-center space-x-4 ${alert.read ? 'bg-gray-50 dark:bg-gray-700/50' : 'bg-blue-50 dark:bg-blue-900/30'}`}
              >
                <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${getAlertIcon(alert.type)}`}>
                  <Bell className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className={`text-sm ${alert.read ? 'text-gray-600 dark:text-gray-400' : 'font-semibold text-gray-900 dark:text-white'}`}>
                    {alert.message}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(alert.date).toLocaleString('pt-BR')}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {!alert.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markAsRead(alert.id)}
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Marcar como lido
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAction('Arquivar', alert)}
                  >
                    <Archive className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <Button 
              variant="outline"
              onClick={() => handleAction('Ver histórico de alertas')}
            >
              Ver Histórico Completo
            </Button>
          </motion.div>
        </div>
      );
    };

    export default AlertsCenter;
  