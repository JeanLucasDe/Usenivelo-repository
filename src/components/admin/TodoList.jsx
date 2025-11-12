
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Filter, CheckCircle, Circle, Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const TodoList = () => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Enviar proposta para novo cliente', description: 'Preparar e enviar a proposta para a empresa XYZ.', priority: 'Alta', status: 'Pendente', date: '2024-09-22' },
    { id: 2, title: 'Follow-up com João Santos', description: 'Ligar para o João para discutir os próximos passos.', priority: 'Média', status: 'Pendente', date: '2024-09-21' },
    { id: 3, title: 'Preparar relatório mensal', description: 'Compilar os dados de vendas e marketing para o relatório de Setembro.', priority: 'Baixa', status: 'Pendente', date: '2024-09-25' },
    { id: 4, title: 'Agendar reunião de equipe', description: 'Marcar a reunião semanal de alinhamento.', priority: 'Média', status: 'Concluída', date: '2024-09-20' },
  ]);
  const [newTask, setNewTask] = useState('');

  const handleAction = (action, task = null) => {
    toast({
      title: "🚧 Funcionalidade em desenvolvimento",
      description: `${action} ${task ? `da tarefa "${task.title}"` : ''} estará disponível em breve!`,
    });
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTask.trim() === '') return;
    const newTaskObject = {
      id: Date.now(),
      title: newTask,
      description: '',
      priority: 'Média',
      status: 'Pendente',
      date: new Date().toISOString().split('T')[0]
    };
    setTasks([newTaskObject, ...tasks]);
    setNewTask('');
    toast({ title: "Tarefa adicionada!", description: `"${newTask}" foi adicionada à sua lista.` });
  };

  const toggleTaskStatus = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: task.status === 'Pendente' ? 'Concluída' : 'Pendente' }
        : task
    ));
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'Alta': return 'border-red-500';
      case 'Média': return 'border-yellow-500';
      case 'Baixa': return 'border-green-500';
      default: return 'border-gray-300';
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
            To-Do List
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Organize suas tarefas e aumente sua produtividade
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <Button 
            variant="outline"
            onClick={() => handleAction('Filtrar tarefas')}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
        </div>
      </motion.div>

      {/* Add Task Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <form onSubmit={handleAddTask} className="flex gap-4">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Adicionar nova tarefa..."
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
          <Button 
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar
          </Button>
        </form>
      </motion.div>

      {/* Tasks List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        {tasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 flex items-center space-x-4 border-l-4 ${getPriorityClass(task.priority)} ${task.status === 'Concluída' ? 'opacity-60' : ''}`}
          >
            <button onClick={() => toggleTaskStatus(task.id)}>
              {task.status === 'Concluída' ? (
                <CheckCircle className="w-6 h-6 text-green-500" />
              ) : (
                <Circle className="w-6 h-6 text-gray-400 hover:text-blue-500" />
              )}
            </button>
            <div className="flex-1">
              <p className={`font-medium text-gray-900 dark:text-white ${task.status === 'Concluída' ? 'line-through' : ''}`}>
                {task.title}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {task.description}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(task.date).toLocaleDateString('pt-BR')}
              </span>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                task.priority === 'Alta' ? 'bg-red-100 text-red-800' :
                task.priority === 'Média' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {task.priority}
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleAction('Editar', task)}
                  className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleAction('Excluir', task)}
                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default TodoList;
