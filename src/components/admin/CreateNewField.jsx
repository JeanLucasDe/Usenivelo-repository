import { ChevronLeft,  Loader2,  Trash2 } from "lucide-react";
import {Link} from "react-router-dom"
import { useState } from "react";
import { Button } from '@/components/ui/button';
import {supabase} from "@/lib/customSupabaseClient"
import { useToast } from '@/components/ui/use-toast';
import { useDashboard } from '@/contexts/DashboardContext';
import FieldTypeDocs from "./FieldTypeDocs";
import RelationField from "./RelationField";

export default function CreateNewField ({submoduleId, setCreateNewField,fetchFields, type,fields,setPage}) {
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);
    const [newField, setNewField] = useState({
    name: '', field_type: 'text', hasFunction: false, subFields: [], operation: null, selectedSubFields: [],formula:''
    });
    const [showDocs, setShowDocs] = useState(false)
    const FIELD_TYPES = ['text', 'phone','number', 'date', 'boolean', 'email', 'textarea', 'link', 'etapas','formula','select','relation','multiselect','file'];

    const parseFormula = (formula) => {
    const operators = /[\+\-\*\/\(\)]/g;
    const tokens = formula.split(operators).map(t => t.trim()).filter(t => t);
    const uniqueTokens = [...new Set(tokens)]; // remove duplicados
    const subFields = uniqueTokens.map(name => ({ name, field_type: 'text' }));

    // Mantemos os operadores em ordem para cálculo futuro
    const ops = formula.match(operators) || [];

    return { subFields, ops };
    };

    const handleAddRelationConfig = (configs) => {
      setNewField((prev) => ({
        ...prev,
        relatedConfigs: configs, // substitui pelo array atualizado
      }));
    };
    //console.log(newField)

    const handleSaveField = async () => {
      setIsSaving(true); // 🔒 trava o botão
      if (!newField.name || !newField.name.trim()) {
          toast({ title: 'Erro', description: 'Nome do campo é obrigatório.' });
          return;
      }
    try {
        const { data: fieldData, error: insertError } = await supabase
        .from('submodule_fields')
        .insert([{
          submodule_id: submoduleId, // UUID do submodule
          name: newField.name,
          field_type: newField.field_type,
          formula:newField.formula,
          operation: newField.operation,
          relatedConfigs: newField.relatedConfigs,
          limit: newField.limit,
          show_in_table:true
        }])
        .select()
        .single();

      if (insertError) throw insertError;

      if (newField.field_type == 'formula' || 'etapas' || 'select' && Array.isArray(newField.subFields) && newField.subFields.length) {
            const rows = newField.subFields.map(sf => ({
              field_id: fieldData.id, // UUID correto
              name: sf.name,
              field_type: 'number',
            }));
      
            const { error: subfieldError } = await supabase
              .from('submodule_field_subfields')
              .insert(rows);
      
            if (subfieldError) throw subfieldError;
          }
        setNewField({
            name: '',
            field_type: 'text',
            hasFunction: false,
            subFields: [],
            operation: '',
            selectedSubFields: []
        });
        
        toast({ title: 'Campo salvo', description: `Campo "${newField.name}" salvo com sucesso.` });
        await fetchFields()
    } catch(err) {
        throw err
    } finally {
      setIsSaving(false); // 🔓 libera o botão
    }
    }

    if (showDocs) return <FieldTypeDocs setShowDocs={setShowDocs}/>

    return (
    <>
    <div className="space-y-6 p-6 rounded-xl">
      <button
      onClick={setCreateNewField}
      >Voltar</button>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold text-gray-900 py-3 rounded-lg  ">Novo Campo</h1>
          <Link to="/documentation">
            <button
              size="sm"
              className="px-3 py-1 rounded-lg border-1 border-gray-200 underline new_camp"
            >
              Documentação
            </button>
          </Link>
        </div>
        {/* Nome */}
        <div className="flex flex-col">
          <label className="font-semibold text-gray-700 dark:text-gray-200 mb-1">Nome do Campo:</label>
          <input
            className="w-full px-4 py-2 rounded-lg border-2 border-indigo-300 dark:border-indigo-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            value={newField.name}
            onChange={e => setNewField({ ...newField, name: e.target.value })}
          />
        </div>
        {/* Tipo */}
        <div className="flex flex-col">
          <label className="font-semibold text-gray-700 dark:text-gray-200 mb-1">Tipo do Campo:</label>
          <select
            className="w-full px-4 py-2 rounded-lg border-2 border-indigo-300 dark:border-indigo-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            value={newField.field_type }
            onChange={e => setNewField({ ...newField, field_type: e.target.value})}
          >
            <option value="" disabled>Selecione...</option> 
            {FIELD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/**function etapas */}
        {(newField.field_type === 'etapas') && (
              <div className="border-2 border-indigo-300 dark:border-indigo-600 rounded-lg p-4 bg-indigo-50 dark:bg-indigo-900 space-y-4 transition">
            <h3 className="font-semibold text-indigo-800 dark:text-indigo-200 text-lg">
              Etapas
            </h3>
            {/* Lista de subcampos */}
            {newField.subFields?.map((sf, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <input
                  className="flex-1 px-3 py-2 rounded-lg border-2 border-indigo-300 dark:border-indigo-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                  placeholder="Nome do subcampo"
                  value={sf.name}
                  onChange={e => {
                    const updated = [...newField.subFields];
                    updated[idx].name = e.target.value;
                    setNewField({ ...newField, subFields: updated });
                  }}
                />
                <button
                  className="text-red-600 hover:text-red-800 transition transform hover:scale-60"
                  onClick={() => {
                    const updated = newField.subFields.filter((_, i) => i !== idx);
                    setNewField({ ...newField, subFields: updated });
                  }}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
            {/* Botão adicionar subcampo */}
            <Button
              size="sm"
              className="bg-green-500 hover:bg-green-600 text-white rounded-lg px-4 py-2 shadow-md hover:scale-105 transform transition"
              onClick={() =>
                setNewField({
                  ...newField,
                  subFields: [...(newField.subFields || []), { name: '', type: 'boolean' }]
                })
              }
            >
              Adicionar Subcampo
              </Button>
              
            </div>
          )}
        {/* função, fórmula */}
        { newField.field_type === 'formula' && (
          <div className=" bg-purple-50 dark:bg-gray-800 w-full rounded-lg shadow-sm">
            <h1>Digite a fórmula:</h1>
        <input
          type="text"
          value={newField.formula || ""}
          onChange={(e) =>{
            const formula = e.target.value;
            const { subFields, ops } = parseFormula(formula);
            setNewField({ ...newField, formula: e.target.value,subFields, operation:ops  })}
          }
          placeholder="Ex: (Altura * Largura) / 2"
          className="flex-1 px-3 py-2  w-full rounded-lg border-2 border-indigo-300 dark:border-indigo-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        />
          </div>
        )}
        {(newField.field_type === 'select' || newField.field_type === 'multiselect') && (
  <div>
    {/* Limite apenas para multiselect */}
    {newField.field_type === 'multiselect' && (
      <div className="mb-2">
        <label className="flex items-center text-gray-700 dark:text-gray-200">
          Limite
          <input
            type="number"
            min={1}
            max={newField.subFields?.length || 1} // máximo igual ao número de opções
            value={newField.limit || ''}
            onChange={e => {
              const value = e.target.value ? parseInt(e.target.value) : null;
              const maxOptions = newField.subFields?.length || 1;
              const limitedValue = value > maxOptions ? maxOptions : value;
              setNewField({ ...newField, limit: limitedValue });
            }}
            className="flex-1 px-3 ml-2 py-2 w-[90px] rounded-lg border-2 border-indigo-300 dark:border-indigo-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />
        </label>
        {newField.limit > (newField.subFields?.length || 0) && (
          <p className="text-sm text-red-600 mt-1">
            O limite não pode ser maior que o número de opções ({newField.subFields?.length})
          </p>
        )}
      </div>
    )}

    {/* Lista de subcampos / opções */}
    <div className="border-2 border-indigo-300 dark:border-indigo-600 rounded-lg p-4 bg-indigo-50 dark:bg-indigo-900 space-y-4 transition">
      <h3 className="font-semibold text-indigo-800 dark:text-indigo-200 text-lg">
        Opções
      </h3>

      {newField.subFields?.map((sf, idx) => (
        <div key={idx} className="flex items-center space-x-2">
          <input
            className="flex-1 px-3 py-2 rounded-lg border-2 border-indigo-300 dark:border-indigo-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            placeholder="Nome do subcampo"
            value={sf.name}
            onChange={e => {
              const updated = [...newField.subFields];
              updated[idx].name = e.target.value;
              setNewField({ ...newField, subFields: updated });
            }}
          />
          <button
            className="text-red-600 hover:text-red-800 transition transform hover:scale-60"
            onClick={() => {
              const updated = newField.subFields.filter((_, i) => i !== idx);
              setNewField({ ...newField, subFields: updated });
              // Ajusta limite se necessário
              if (newField.limit && newField.limit > updated.length) {
                setNewField(prev => ({ ...prev, limit: updated.length }));
              }
            }}
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      ))}

      <Button
        size="sm"
        className="bg-green-500 hover:bg-green-600 text-white rounded-lg px-4 py-2 shadow-md hover:scale-105 transform transition"
        onClick={() =>
          setNewField({
            ...newField,
            subFields: [...(newField.subFields || []), { name: '', type: 'text' }]
          })
        }
      >
        Adicionar Subcampo
      </Button>
    </div>
  </div>
        )}


        {newField.field_type === 'relation' && (
          <RelationField
            value={newField.related_module}
            onChange={(configs) => handleAddRelationConfig(configs)}
          />
        )}
        

        <div className="mt-4 text-right">
          <Button
            disabled={!newField.field_type || !newField.name || isSaving}
            onClick={handleSaveField}
            className={`bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md transform transition ${
              isSaving ? "opacity-70 cursor-not-allowed" : "hover:scale-105"
            }`}
          >
            {isSaving ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Salvando...
              </span>
            ) : (
              "Salvar"
            )}
          </Button>
      </div>
    </div>
    </>
    )
}