import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Modal = ({ type, initialName = '', onClose, onSave }) => {
  const [name, setName] = useState(initialName);
  const [fields, setFields] = useState([]);

  useEffect(() => {
    setName(initialName);
  }, [initialName]);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave(name.trim(), fields);
    setName('');
    setFields([]);
  };

  const addField = () => {
    setFields([...fields, { id: Date.now(), name: '', field_type: 'text', required: false }]);
  };

  const updateField = (id, key, value) => {
    setFields(fields.map(f => (f.id === id ? { ...f, [key]: value } : f)));
  };

  const removeField = (id) => {
    setFields(fields.filter(f => f.id !== id));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {type === 'module' ? 'Módulo' : type === 'submodule' ? 'Submódulo' : 'Campo'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nome */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Nome</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={type === 'field' ? 'Nome do campo' : 'Nome'}
          />
        </div>

        {/* Campos para submódulos */}
        {type === 'submodule' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Campos</label>
            {fields.map(f => (
              <div key={f.id} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={f.name}
                  onChange={(e) => updateField(f.id, 'name', e.target.value)}
                  placeholder="Nome do campo"
                  className="flex-1 px-2 py-1 rounded-lg border dark:bg-gray-700 dark:text-white focus:outline-none"
                />
                <select
                  value={f.field_type}
                  onChange={(e) => updateField(f.id, 'field_type', e.target.value)}
                  className="px-2 py-1 rounded-lg border dark:bg-gray-700 dark:text-white focus:outline-none"
                >
                  <option value="text">Texto</option>
                  <option value="number">Número</option>
                  <option value="date">Data</option>
                  <option value="checkbox">Checkbox</option>
                </select>
                <label className="flex items-center space-x-1 text-sm">
                  <input
                    type="checkbox"
                    checked={f.required}
                    onChange={(e) => updateField(f.id, 'required', e.target.checked)}
                  />
                  <span>Obrigatório</span>
                </label>
                <button onClick={() => removeField(f.id)} className="text-red-500 hover:text-red-700">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <Button onClick={addField} variant="outline" size="sm" className="mt-2">
              <Plus className="w-4 h-4 mr-1" /> Adicionar Campo
            </Button>
          </div>
        )}

        <div className="flex justify-end space-x-2">
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave}>{activeModule ? 'Salvar' : 'Criar'}</Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Modal;
