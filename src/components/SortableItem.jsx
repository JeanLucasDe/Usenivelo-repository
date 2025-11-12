import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Edit, Trash2, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const SortableItem = ({ module, editModule, deleteModule }) => {
  const { toast } = useToast();
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: module.userModuleId });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex items-center justify-between"
    >
      <div className="flex items-center space-x-4">
        <GripVertical className="w-5 h-5 text-gray-400 cursor-grab" />
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{module.name}</p>
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full ${
              module.type === 'Padrão' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
            }`}
          >
            {module.type}
          </span>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {module.customizable ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast({ title: 'Customizar módulo em desenvolvimento' })}
          >
            <Settings className="w-4 h-4 mr-1" />
            Customizar
          </Button>
        ) : (
          <span className="text-sm text-gray-500">Não customizável</span>
        )}
        {module.type === 'Customizado' && (
          <>
            <Button variant="ghost" size="icon" onClick={() => editModule(module)}>
              <Edit className="w-4 h-4 text-green-600" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => deleteModule(module)}>
              <Trash2 className="w-4 h-4 text-red-600" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default SortableItem;
