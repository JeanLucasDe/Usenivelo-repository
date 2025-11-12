import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/customSupabaseClient";
import { useToast } from "@/components/ui/use-toast";

const FormConfigMyFinances = ({ onClose, onSave , fetchFormsUser}) => {
  const { toast } = useToast();
  const [modules, setModules] = useState([]);
  const [subModules, setSubModules] = useState([]);
  const [fields, setFields] = useState([]);
  const [subfields, setSubFields] = useState([]);
  const [selectedForms, setSelectedForms] = useState({});
  const [loading, setLoading] = useState(true);

  // ✅ Carrega módulos, submodules, fields e subfields do usuário
  const fetchFields = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error("Usuário não autenticado:", userError);
        return;
      }

      const { data: modulesData, error: modulesError } = await supabase
        .from("modules")
        .select("*")
        .eq("user_id", user.id)
        .eq("customizable", true);
      if (modulesError) throw modulesError;
      if (!modulesData?.length) return;

      const { data: subModuleData, error: subModuleError } = await supabase
        .from("submodules")
        .select("*")
        .in("module_id", modulesData.map(m => m.id));
      if (subModuleError) throw subModuleError;

      const { data: fieldsData, error: fieldsError } = await supabase
        .from("submodule_fields")
        .select("*")
        .in("submodule_id", subModuleData.map(s => s.id));
      if (fieldsError) throw fieldsError;

      const { data: subFieldsData, error: subFieldsError } = await supabase
        .from("submodule_field_subfields")
        .select("*")
        .in("field_id", fieldsData.map(f => f.id));
      if (subFieldsError) throw subFieldsError;

      // ✅ Busca os formulários já configurados pelo usuário
        const { data: configuredForms } = await supabase
          .from("user_configured_forms")
          .select("submodule_id")
          .eq("user_id", user.id);

        // ✅ Preenche selectedForms com true para os submodule_ids que já existem
        const initialSelected = {};
        configuredForms?.forEach(cf => {
          initialSelected[cf.submodule_id] = true;
        });

      setModules(modulesData);
      setSubModules(subModuleData);
      setFields(fieldsData);
      setSubFields(subFieldsData);
      setSelectedForms(initialSelected); // ✅ aqui
      setLoading(false)
    } catch (err) {
      console.error("Erro ao carregar campos:", err.message);
    }
  };

  useEffect(() => {
    fetchFields();
  }, []);

  // ✅ Toggle de seleção de formulário
  const toggleFormSelection = (fieldId) => {
    setSelectedForms(prev => ({
      ...prev,
      [fieldId]: !prev[fieldId],
    }));
  };

  // ✅ Salva os formulários configurados
  const saveConfiguredForms = async () => {
  setLoading(true);
  try {
    // 1️⃣ Pega usuário
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      alert("Usuário não autenticado!");
      return;
    }

    // 2️⃣ IDs selecionados
    const selectedIds = Object.entries(selectedForms)
      .filter(([_, selected]) => selected)
      .map(([id]) => id); // UUIDs como string

    // 3️⃣ IDs que foram desmarcados
    const deselectedIds = Object.entries(selectedForms)
      .filter(([_, selected]) => !selected)
      .map(([id]) => id);

    // 4️⃣ Remove do banco os que foram desmarcados
    if (deselectedIds.length) {
      const { error: deleteError } = await supabase
        .from("user_configured_forms")
        .delete()
        .eq("user_id", user.id)
        .in("submodule_id", deselectedIds);

      if (deleteError) throw deleteError;
    }

    // 5️⃣ Insere/atualiza os selecionados (upsert)
    if (selectedIds.length) {
      const recordsToUpsert = selectedIds.map(submodule_id => ({
        user_id: user.id,
        submodule_id,
        created_at: new Date().toISOString()
      }));

      const { data, error: upsertError } = await supabase
        .from("user_configured_forms")
        .upsert(recordsToUpsert, { onConflict: ["user_id", "submodule_id"] });

      if (upsertError) throw upsertError;
    }

    toast({
      title: "Configuração Salva",
      description: "Configuração salva com sucesso!",
    });
    fetchFormsUser()
  } catch (err) {
    console.error("Erro ao salvar formulários configurados:", err.message);
    alert("❌ Erro ao salvar. Tente novamente.");
  } finally {
    setLoading(false);
  }
};


  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-b-4 border-gray-200"></div>
      </div>
    );
  }
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Configuração de Formulários
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-900 dark:hover:text-white font-bold"
        >
          Fechar
        </button>
      </motion.div>
      <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900 border-l-4 border-yellow-400 dark:border-yellow-600 rounded-md">
        <p className="text-yellow-800 dark:text-yellow-200 text-sm">
          ⚠️ Apenas os formulários que possuem o campo <strong>TOTAL</strong> podem ser configurados.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-800 dark:text-gray-100">
          <thead className="text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 w-full">
            <tr>
              <th className="py-2 px-3">Selecionar</th>
              <th className="py-2 px-3">Formulário</th>
            </tr>
          </thead>
          <tbody>
      {subModules
      .map((field) => {
        // Verifica se esse submodule possui o campo "TOTAL" ou "VALOR"
        const hasTotalField = fields.some(
            (f) =>
              f.submodule_id === field.id &&
              (
                ["TOTAL", "PREÇO", "VALOR"].includes(f.name.toUpperCase()) || 
                (f.relatedConfigs && f.relatedConfigs.length > 0)
              )
          );



    if (hasTotalField) {
     
      return (
        <tr
          key={field.id}
          className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <td className="py-3 px-4">
            <input
              type="checkbox"
              checked={!!selectedForms[field.id]}
              onChange={() => toggleFormSelection(field.id)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-400"
            />
          </td>
          <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
            {field.name}
          </td>
          <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
            {subModules
              .filter((sub) => sub.field_id === field.id)
              .map((sub) => sub.name)
              .join(", ")}
          </td>
        </tr>
      )
    }
  })}
          </tbody>

        </table>
      </div>

      <div className="flex justify-end mt-6 space-x-3">
        <button
          onClick={saveConfiguredForms}
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          {loading ? "Salvando..." : "Salvar Configuração"}
        </button>
      </div>
    
    </div>
  );
};

export default FormConfigMyFinances;
