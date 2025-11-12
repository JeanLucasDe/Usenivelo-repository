import { useEffect, useState } from "react";
import { supabase } from "@/lib/customSupabaseClient";
import { Search, PlusCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RelationFieldMulti({ value, onChange }) {
  const [modules, setModules] = useState([]); 
  const [submodules, setSubmodules] = useState([]); 
  const [fields, setFields] = useState([]); 

  const [relatedConfigs, setRelatedConfigs] = useState(value?.relatedConfigs || []);
  const [currentConfig, setCurrentConfig] = useState({
    module: "",
    submodule: "",
    fields: [],
  });

  // Buscar módulos do usuário
  useEffect(() => {
    const fetchModules = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) return;

      const { data, error } = await supabase
        .from("modules")
        .select("id, name, submodules(id, name)")
        .eq("user_id", user.id)
        .eq("type", "Customizado")
        .order("name", { ascending: true });

      if (error) return console.error(error);
      setModules(data || []);
    };
    fetchModules();
  }, []);

  // Atualizar submodules ao escolher módulo
  useEffect(() => {
    if (!currentConfig.module) {
      setSubmodules([]);
      setCurrentConfig((c) => ({ ...c, submodule: "", fields: [] }));
      return;
    }

    const module = modules.find((m) => m.id === currentConfig.module);
    setSubmodules(module?.submodules || []);
    setCurrentConfig((c) => ({ ...c, submodule: "", fields: [] }));
  }, [currentConfig.module, modules]);

  // Buscar campos do submodule
  useEffect(() => {
    const fetchFields = async () => {
      if (!currentConfig.submodule) return;

      const { data, error } = await supabase
        .from("submodule_fields")
        .select("id, name")
        .eq("submodule_id", currentConfig.submodule);

      if (error) return console.error(error);
      setFields(data || []);
      setCurrentConfig((c) => ({ ...c, fields: [] }));
    };
    fetchFields();
  }, [currentConfig.submodule]);

  // Alternar seleção de campo
  const toggleField = (fieldId) => {
    setCurrentConfig((prev) => ({
      ...prev,
      fields: prev.fields.includes(fieldId)
        ? prev.fields.filter((f) => f !== fieldId)
        : [...prev.fields, fieldId],
    }));
  };

  // Finalizar e adicionar configuração
  const finalizeCurrentConfig = () => {
    const moduleObj = modules.find((m) => m.id === currentConfig.module);
    const submoduleObj = submodules.find((s) => s.id === currentConfig.submodule);
    const selectedFields = fields.filter((f) => currentConfig.fields.includes(f.id));

    const config = {
      module: moduleObj?.id || "",
      moduleName: moduleObj?.name || "",
      submodule: submoduleObj?.id || "",
      submoduleName: submoduleObj?.name || "",
      fields: selectedFields.map((f) => f.id),
      fieldNames: selectedFields.map((f) => f.name),
    };

    const updatedConfigs = [...relatedConfigs, config];
    setRelatedConfigs(updatedConfigs);
   onChange(updatedConfigs);; // 🔹 envia pro pai

    // Limpa a configuração atual
    setCurrentConfig({ module: "", submodule: "", fields: [] });
    setFields([]);
    setSubmodules([]);
  };

  // Apagar configuração
  const deleteConfig = (index) => {
    const updated = relatedConfigs.filter((_, i) => i !== index);
    setRelatedConfigs(updated);
    onChange(updated);;
  };

  return (
    <div className="border-2 border-indigo-300 dark:border-indigo-600 rounded-lg p-4 bg-indigo-50 dark:bg-indigo-900 space-y-4 transition">
      <h3 className="font-semibold text-indigo-800 dark:text-indigo-200 text-lg flex items-center gap-2">
        <Search className="w-5 h-5" />
        Campos Relacionais
      </h3>

      {/* Seletor atual */}
      <div className="space-y-4">
        {/* Módulo */}
        <div className="flex flex-col">
          <label className="font-semibold text-gray-700 dark:text-gray-200 mb-1">Módulo</label>
          <select
            className="w-full px-4 py-2 rounded-lg border-2 border-indigo-300 dark:border-indigo-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-400 transition"
            value={currentConfig.module}
            onChange={(e) =>
              setCurrentConfig((c) => ({ ...c, module: e.target.value }))
            }
          >
            <option value="">Selecione um módulo</option>
            {modules.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        {/* Submódulo */}
        {currentConfig.module && (
          <div className="flex flex-col">
            <label className="font-semibold text-gray-700 dark:text-gray-200 mb-1">Submódulo</label>
            <select
              className="w-full px-4 py-2 rounded-lg border-2 border-indigo-300 dark:border-indigo-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-400 transition"
              value={currentConfig.submodule}
              onChange={(e) =>
                setCurrentConfig((c) => ({ ...c, submodule: e.target.value }))
              }
            >
              <option value="">Selecione um submódulo</option>
              {submodules
              .filter(
                (s) =>
                    !relatedConfigs.some(
                    (conf) =>
                        conf.module === currentConfig.module &&
                        conf.submodule === s.id
                    )
                )
              .map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Campos */}
        {currentConfig.submodule && (
          <div className="flex flex-col space-y-2">
            <label className="font-semibold text-gray-700 dark:text-gray-200">
              Campos de exibição
            </label>
            {fields.length > 0 ? (
              fields.map((f) => (
                <label
                  key={f.id}
                  className="flex items-center gap-2 text-gray-800 dark:text-gray-100"
                >
                  <input
                    type="checkbox"
                    checked={currentConfig.fields.includes(f.id)}
                    onChange={() => toggleField(f.id)}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  {f.name}
                </label>
              ))
            ) : (
              <p className="text-sm text-gray-500">Nenhum campo encontrado</p>
            )}
          </div>
        )}

        {/* Botão adicionar módulo */}
        {currentConfig.module &&
          currentConfig.submodule &&
          currentConfig.fields.length > 0 && (
            <Button
              onClick={finalizeCurrentConfig}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              <PlusCircle className="w-5 h-5" />
              Adicionar Módulo
            </Button>
          )}
      </div>

      {/* Listagem das configurações */}
      {relatedConfigs.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-800 dark:text-gray-200">
            Configurações adicionadas
          </h4>
          {relatedConfigs.map((c, idx) => (
            <div
              key={idx}
              className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg flex justify-between items-center"
            >
              <div>
                <p>
                  <strong>Módulo:</strong> {c.moduleName}
                </p>
                <p>
                  <strong>Submódulo:</strong> {c.submoduleName}
                </p>
                <p>
                  <strong>Campos:</strong>{" "}
                  {(c.fieldNames || []).join(", ")}
                </p>
              </div>
              <button
                className="text-red-600 hover:text-red-800 px-2 py-1 rounded-lg border border-red-400 hover:bg-red-100 transition flex items-center gap-1"
                onClick={() => deleteConfig(idx)}
              >
                <Trash2 className="w-4 h-4" />
                Apagar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
