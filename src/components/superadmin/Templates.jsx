
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Download, Eye, Edit, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Templates = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  const handleAction = (action, template = null) => {
    toast({
      title: "🚧 Funcionalidade em desenvolvimento",
      description: `${action} ${template ? `do template ${template.name}` : ''} estará disponível em breve!`,
    });
  };

  const templates = [
    {
      id: 1,
      name: 'Consultoria Empresarial',
      category: 'Serviços',
      description: 'Template completo para empresas de consultoria com módulos de projetos e clientes',
      downloads: 1247,
      rating: 4.8,
      modules: ['Dashboard', 'Projetos', 'Clientes', 'Financeiro', 'Relatórios'],
      image: 'consultoria-template.jpg'
    },
    {
      id: 2,
      name: 'E-commerce',
      category: 'Varejo',
      description: 'Solução completa para lojas online com gestão de produtos e vendas',
      downloads: 892,
      rating: 4.6,
      modules: ['Produtos', 'Pedidos', 'Estoque', 'Clientes', 'Marketing'],
      image: 'ecommerce-template.jpg'
    },
    {
      id: 3,
      name: 'Clínica Médica',
      category: 'Saúde',
      description: 'Sistema especializado para clínicas com agendamentos e prontuários',
      downloads: 634,
      rating: 4.9,
      modules: ['Agendamentos', 'Pacientes', 'Prontuários', 'Financeiro', 'Relatórios'],
      image: 'clinica-template.jpg'
    },
    {
      id: 4,
      name: 'Restaurante',
      category: 'Alimentação',
      description: 'Gestão completa para restaurantes com cardápio e delivery',
      downloads: 456,
      rating: 4.5,
      modules: ['Cardápio', 'Pedidos', 'Delivery', 'Estoque', 'Financeiro'],
      image: 'restaurante-template.jpg'
    },
    {
      id: 5,
      name: 'Academia',
      category: 'Fitness',
      description: 'Sistema para academias com controle de alunos e treinos',
      downloads: 378,
      rating: 4.7,
      modules: ['Alunos', 'Treinos', 'Pagamentos', 'Equipamentos', 'Relatórios'],
      image: 'academia-template.jpg'
    },
    {
      id: 6,
      name: 'Imobiliária',
      category: 'Imóveis',
      description: 'Plataforma para imobiliárias com gestão de imóveis e clientes',
      downloads: 289,
      rating: 4.4,
      modules: ['Imóveis', 'Clientes', 'Contratos', 'Visitas', 'Relatórios'],
      image: 'imobiliaria-template.jpg'
    }
  ];

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = [...new Set(templates.map(t => t.category))];

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
            Templates de Negócio
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Gerencie templates prontos para diferentes nichos
          </p>
        </div>
        <Button 
          onClick={() => handleAction('Criar novo template')}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 mt-4 md:mt-0"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Template
        </Button>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map(category => (
              <Button
                key={category}
                variant="outline"
                size="sm"
                onClick={() => handleAction(`Filtrar por ${category}`)}
                className="text-sm"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden card-hover"
          >
            <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <img 
                className="w-full h-full object-cover" 
                alt={`Template ${template.name}`}
               src="https://images.unsplash.com/photo-1586448354773-30706da80a04" />
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
                  {template.category}
                </span>
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-400">★</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{template.rating}</span>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {template.name}
              </h3>
              
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                {template.description}
              </p>

              <div className="mb-4">
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Módulos inclusos:
                </p>
                <div className="flex flex-wrap gap-1">
                  {template.modules.slice(0, 3).map((module, moduleIndex) => (
                    <span
                      key={moduleIndex}
                      className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded"
                    >
                      {module}
                    </span>
                  ))}
                  {template.modules.length > 3 && (
                    <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
                      +{template.modules.length - 3}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {template.downloads} downloads
                </span>
              </div>

              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={() => handleAction('Visualizar', template)}
                  className="flex-1"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Ver
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAction('Editar', template)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAction('Excluir', template)}
                  className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Templates;
