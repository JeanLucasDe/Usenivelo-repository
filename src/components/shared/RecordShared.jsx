import { useState, useEffect } from "react";
import { supabase } from "@/lib/customSupabaseClient";
import { Button } from "@/components/ui/button";
import { AlertCircle, Calculator, FileText, Layers, Loader2, Upload, X } from "lucide-react";
import { useToast } from '@/components/ui/use-toast';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from "@/components/ui/select";
import { RecordRelationField } from "../admin/Tabs/RecordCreatorRelations";
import ConfirmationTemplate from "../admin/SubmoduleCRUDconfig/templates/ConfirmationTemplate";
import FileInput from "../admin/Inputs/FileInput";
import LimitReachedFullScreen from "../admin/SubmoduleCRUDconfig/templates/LimitReachedFullScreen";
import { uploadFileToSupabase } from "@/lib/uploadFile";
import { useNavigate } from "react-router-dom";
import PhoneInput from "../admin/Inputs/PhoneInput";

// --- Funções utilitárias --- //



// --- Componente principal --- //
export default function RecordShared({ fields = [], subFields = [], submodule_id , record=[],fetchRecords, onClose, isOpen,page, shared, creating, limiteAtingido,
logoUrl, userFieldsData, companyFieldsData,user,company, form_type, formConfig, sendForKanban, stepSelect,  userLogado}) {

  const { toast } = useToast();
  const LOCAL_CACHE_KEY = `formulaCache_${submodule_id || "default"}`;
  const ENABLE_KEY = `formulaCacheEnabled_${submodule_id || "default"}`;
  const [formData, setFormData] = useState({});
  const [previewData, setPreviewData] = useState(record);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [submodule, setSubmodule]= useState({})
  const [recordData, setRecordsData] = useState(record)
  const [submoduleName, setSubmoduleName] = useState()
  const [tipo, setTipo] = useState('entrada')
  const [relatedRecords, setRelatedRecords] = useState({});
  const CONFIRMATION_KEY = `confirmation_submodule_${submodule_id}`;
  const {title, message, subtitle} = formConfig.length > 0 && formConfig[0].template_data
  const navigate = useNavigate();

function calculateField(field, recordData) {
  
    if (!field.formula) return recordData[field.name] ?? null;

    let formula = field.formula; // ex: "campo1+campo2"

    // Substitui cada campo pelo valor atual do registro (garantindo que seja número)
    Object.keys(recordData).forEach(key => {
        const value = Number(recordData[key] ?? 0); // converte para número
        formula = formula.replace(new RegExp(`\\b${key}\\b`, 'g'), value);
    });

    // Avalia a expressão
    try {
        return eval(formula);
    } catch (e) {
        console.error("Erro ao calcular fórmula:", e, "Formula:", formula);
        return null;
    }
    }

 const fetchRelated = async () => {
    for (const field of fields.filter(f => f.field_type === "relation")) {
      for (const rc of field.relatedConfigs) {
        const { data, error } = await supabase
          .from("submodule_records")
          .select("id, data")
          .eq("submodule_id", rc.submodule);

        if (error) {
          console.error("Erro ao buscar registros relacionados:", error);
          continue;
        }

        setRelatedRecords(prev => ({
          ...prev,
          [field.id]: {
            ...(prev[field.id] || {}),
            [rc.submodule]: data || []
          }
        }));
      }
    }
  }

  // Inicializa valores padrão
  useEffect(() => {
  if (!fields?.length) return;
  setFormData(prev => {
    const localCache =
    enabled
    ? JSON.parse(localStorage.getItem(LOCAL_CACHE_KEY)) || {}
    : {};
    // Evita sobrescrever o estado se nada mudou
    const init = { ...(record?.data || {}), ...localCache, ...prev };

    fields.forEach(f => {
      if (init[f.name] === undefined) {
        if (["number", "formula"].includes(f.field_type)) init[f.name] = 0;
        else if (["boolean", "etapas"].includes(f.field_type)) init[f.name] = false;
        else init[f.name] = "";
      }
    });

    subFields.forEach(sf => {
      if (init[sf.name] === undefined) init[sf.name] = 0;
    });

    // Se o estado anterior for igual ao novo, não atualiza
    const changed = JSON.stringify(prev) !== JSON.stringify(init);
    return changed ? init : prev;
  });
}, []);
  const fetchAndUpdate = async () => {
    try {
      // 🔹 Busca o submódulo correspondente
      const { data: submoduleData, error } = await supabase
        .from("submodules")
        .select("id, name, limit")
        .eq("id", submodule_id)
        .single();

      if (error) {
        console.error("Erro ao buscar submódulo:", error);
      }

      // guarda o nome pra uso futuro (por exemplo, categoria)
      const submoduleName = submoduleData?.name || "Desconhecido";

      setSubmodule(submoduleData)
      setSubmoduleName(submoduleName)

      // cópia do estado atual (valores que o usuário digitou)
      const updated = { ...(formData || {}) };

      // Recalcula todas as fórmulas com base nos valores atuais
      const formulaFields = fields.filter(f => f.field_type === "formula");
      formulaFields.forEach(f => {
        const result = calculateField(f, updated);
        updated[f.name] = result ?? 0;
      });

      setPreviewData(updated);

      // --- monta cache apenas com os valores que interessam ---
      const formulaCache = {};

      // 1) valores das próprias fórmulas (resultado)
      formulaFields.forEach(f => {
        if (updated[f.name] !== undefined) {
          formulaCache[f.name] = Number(updated[f.name]);
        }
      });

      // 2) valores dos subfields relacionados às fórmulas
      const relatedSubFields = (subFields || []).filter(sf =>
        formulaFields.some(ff => ff.id === sf.field_id)
      );

      relatedSubFields.forEach(sf => {
        if (updated[sf.name] !== undefined) {
          const val = updated[sf.name];
          if (typeof val === "number" || String(val).match(/^[\d.,\-]+$/)) {
            const asNum = Number(String(val).replace(",", "."));
            formulaCache[sf.name] = Number.isFinite(asNum) ? asNum : 0;
          } else {
            formulaCache[sf.name] = val;
          }
        }
      });

      // 🔹 adiciona o nome do submódulo dentro do cache (útil p/ logs)
      formulaCache.__submoduleName = submoduleName;

      // grava no localStorage somente se realmente mudou
      try {
        const key = `formulaCache_${submodule_id || "default"}`;
        const prevRaw = localStorage.getItem(key);
        const nextRaw = JSON.stringify(formulaCache || {});
        if (enabled) {
          if (prevRaw !== nextRaw) {
            localStorage.setItem(key, nextRaw);
          }
        } else {
          localStorage.removeItem(key);
        }
      } catch (err) {
        console.error("Erro ao salvar formulaCache:", err);
      }
    } catch (err) {
      console.error("Erro geral no cálculo de fórmulas:", err);
    }
  };
  // Recalcula fórmulas dinamicamente e salva valores no cache (fórmulas + subfields)
  useEffect(() => {
  if (!fields?.length || !submodule_id) return;

  
  fetchAndUpdate();
  fetchRelated()
  setLoading(false)
  }, [formData, fields, subFields, submodule_id]);





  // Atualiza valor
const handleChange = (name, value) => {
    setFormData(prev => {
    const nextFormData = { ...prev, [name]: value };

    // Atualiza previewData com todos os campos atuais
    const updatedPreview = { ...nextFormData };

    // Recalcula fórmulas automaticamente
    const formulaFields = fields.filter(f => f.field_type === "formula");
    formulaFields.forEach(f => {
      updatedPreview[f.name] = calculateField(f, updatedPreview) ?? 0;
    });

    setPreviewData(updatedPreview);
    return nextFormData;
  });
};

  // Renderiza inputs personalizados
 const renderInput = (field) => {
  const value = formData[field.name] ?? recordData?.data?.[field.name] ?? "";

  // Campos do tipo formula
  if (field.field_type === "formula") {
    const relatedSubs = subFields.filter(sf => sf.field_id === field.id);
    const result = parseFloat(previewData[field.name] ?? record?.data?.[field.name] ?? 0) || 0;

    return (
      <div className="space-y-3">
        <Label>{field.name}</Label>
        {relatedSubs.length > 0 && (
          <div className="grid sm:grid-cols-2 gap-2">
            {relatedSubs.map(sf => {
              const subVal = formData[sf.name] ?? record?.data?.[sf.name] ?? "";
              return (
                <div key={sf.id}>
                  <label className="text-xs text-gray-500 block mb-1">{sf.name}</label>
                  <input
                    type="number"
                    step="any"
                    value={subVal}
                    onChange={(e) => handleChange(sf.name, parseFloat(e.target.value) || 0)}
                    className="block w-full h-10 px-3 text-gray-900 placeholder-gray-400 border-t-0 border-l-0 border-r-0 border-b-2 border-gray-300 focus:border-blue-500 focus:ring-0"
                  />
                </div>
              );
            })}
          </div>
        )}
        <div>
          <label className="text-xs text-gray-500 block mb-1">Resultado</label>
          <input
            type="text"
            readOnly
            value={String(result.toFixed(2))}
            className="block w-full h-10 px-3 text-green-700 font-medium bg-gray-100 border-t-0 border-l-0 border-r-0 border-b-2 border-gray-300 cursor-not-allowed"
          />
          {field.formula && (
            <p className="text-xs text-gray-500 mt-1 italic">{field.formula}</p>
          )}
        </div>
      </div>
    );
  }
  if (field.field_type === 'textarea') {
  return (
    <div className="mb-4">
      <Label>{field.name}{field.required && <span className="text-red-500"> *</span>}</Label>
      <textarea
        value={formData[field.name] ?? ""}
        placeholder="Digite..."
        onChange={(e) => handleChange(field.name, e.target.value)}
        className="w-full min-h-[80px] rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 px-3 text-sm resize-y focus:ring-2 focus:ring-blue-500 pt-2"
      />
    </div>
  )
}

  // Campos do tipo etapas
  if (field.field_type === "etapas") {
  const etapas = subFields.filter(sf => sf.field_id === field.id);

  const handleEtapaChange = (index, checked) => {
    const updatedForm = { ...formData };
    if (checked) {
      for (let i = 0; i <= index; i++) updatedForm[etapas[i].name] = true;
    } else {
      for (let i = index; i < etapas.length; i++) updatedForm[etapas[i].name] = false;
    }
    Object.entries(updatedForm).forEach(([key, val]) => handleChange(key, val));
  };

  return (
    <div className="flex flex-col">
      <Label>{field.name}</Label>
      {etapas.map((etapa, idx) => {
        const etapaVal = formData[etapa.name] ?? record?.data?.[etapa.name] ?? null;
        const isLast = idx === etapas.length - 1;

        return (
          <div>
            <div key={etapa.id} className="flex items-start gap-3 relative">
              {/* Linha vertical */}
              {!isLast && (
                <div
                  className={`absolute top-6 left-3 w-0.5 h-full ${
                    etapaVal ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
              )}
              {/* Bolinha */}
              <div
                onClick={() => handleEtapaChange(idx, !etapaVal)}
                className={`w-6 h-6 rounded-full border-2 cursor-pointer flex items-center justify-center mt-1 transition-colors duration-200 cursor-pointer ${
                  etapaVal ? "bg-green-500 border-green-500" : "bg-white border-gray-300"
                }`}
              >
              </div>
              {/* Nome da etapa */}
              <span className="text-sm text-gray-700 mt-1">{etapa.name}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
  // Select simples
  if (field.field_type === "select") {
    const options = subFields.filter(sf => sf.field_id === field.id);
    return (
      <div className="mb-4">
        <Label>{field.name}{field.required &&<span className="text-red-500"> *</span>}</Label>
        <Select value={formData[field.name] ?? ""} onValueChange={(value) => handleChange(field.name, value)}>
          <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecione..." />
          </SelectTrigger>
          <SelectContent>
            {options.map((op) => (
              <SelectItem key={op.id} value={op.name}>{op.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  // Multiselect
  if (field.field_type === "multiselect") {
    const options = subFields.filter(sf => sf.field_id === field.id);
    const selected = formData[field.name] || [];

    const handleSelect = (optionName) => {
      const limit = field.limit || options.length;
      let updatedSelection;

      if (selected.includes(optionName)) {
        updatedSelection = selected.filter((v) => v !== optionName);
      } else {
        if (selected.length < limit) {
          updatedSelection = [...selected, optionName];
        } else {
          updatedSelection = [...selected];
        }
      }
      handleChange(field.name, updatedSelection);
    };

    return (
      <div className="mb-4">
        <Label>{field.name}{field.required &&<span className="text-red-500"> *</span>}</Label>
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione...">
              {selected.length ? selected.join(", ") : "Selecione..."}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {options.map((op) => {
              const isSelected = selected.includes(op.name);
              return (
                <div
                  key={op.id}
                  className="flex items-center gap-2 px-2 py-1 cursor-pointer"
                  onPointerDown={(e) => e.preventDefault()} // impede fechamento
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleSelect(op.name)}
                    className="w-4 h-4 accent-green-500"
                  />
                  <span>{op.name}</span>
                </div>
              );
            })}
          </SelectContent>
        </Select>
        {field.limit && (
          <p className="text-sm text-gray-500 mt-1">
            Selecionados: {selected.length}/{field.limit}
          </p>
        )}
      </div>
    );
  }

  // Boolean
  if (field.field_type === "boolean") {
    const itemVal = formData[field.name] ?? record?.data?.[field.name] ?? false;
    return (
      <label className="flex items-center justify-between h-10 border-b border-gray-200 hover:bg-gray-50 cursor-pointer">
        <Label>{field.name}{field.required &&<span className="text-red-500"> *</span>}</Label>
        <div className="relative">
          <input type="checkbox" checked={!!itemVal} onChange={(e) => handleChange(field.name, e.target.checked)} className="sr-only peer" />
          <div className={`w-10 h-5 rounded-full transition-colors duration-200 ease-in-out ${itemVal ? "bg-green-500" : "bg-gray-300"}`} />
          <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out ${itemVal ? "translate-x-5" : "translate-x-0"}`} />
        </div>
      </label>
    );
  }
  if(field.field_type === 'phone') {
    return (
       <PhoneInput
      label={field.name}
      value={formData[field.name]}
      required={field.required}
      onChange={(val) => handleChange(field.name, val)}
    />
    )
  }

  // File
  if (field.field_type === "file") {
    return <FileInput field={field} value={formData[field.name]} onChange={(val) => handleChange(field.name, val)} />;
  }
  if (field.field_type === "relation") {
    return (
      <RecordRelationField
        key={field.id}
        field={field}
        relatedRecords={relatedRecords}
        formData={formData}
        setFormData={setFormData}
      />
    )
    
  }

  // Inputs simples (text, number, date)
  return (
    <div className="mb-4">
      <Label>{field.name}{field.required &&<span className="text-red-500"> *</span>}</Label>
      <Input
        type={field.field_type}
        value={value ?? ""}
        placeholder="Digite..."
        onChange={(e) => {
          const val = e.target.value;
          handleChange(field.name, field.field_type);
        }}
      />
    </div>
  );
};




/**
 * Mapeia dados dinâmicos para o formato da tabela "transactions"
 * @param {Object} data - Dados vindos do formulário (ex: fields)
 * @param {String} submoduleName - Nome do submódulo (vira a categoria)
 */

  // Salvar registro
  const handleSave = async () => {
  setLoading(true);
  try {
    const updatedData = { ...previewData };


    // 🔹 Faz upload dos arquivos só agora (no momento do save)
    for (const key of Object.keys(updatedData)) {
      const val = updatedData[key];
      if (val instanceof File) {
        const url = await uploadFileToSupabase(val);
        if (url) {
          updatedData[key] = url;
        } else {
          throw new Error(`Falha ao enviar o arquivo ${val.name}`);
        }
      }
    }

    // 🔹 payload final com URLs já substituídas
    const payload = {
        data: {
          ...(sendForKanban ? { title: submodule.name } : {}),
          ...updatedData
        }
      };


    // Cria novo registro
    const {data:dbRecord, error } = await supabase
      .from("submodule_records")
      .insert([
        {
          submodule_id,
          ...payload,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) throw error;

      //envia para kanban
    if (sendForKanban) {
      const { error } = await supabase
      .from("kanban_cards")
      .insert([
        {
          step_id: stepSelect,
          created_by: userLogado.id,
          record_id: dbRecord.id,
          submodule_id,
            ...payload,
          created_at: new Date().toISOString(),
        }
      ])
      if(error) throw error
    }
   

    toast({
      title: 'Registro Criado',
      description: 'Registro salvo com sucesso!',
    });
    

    // Atualiza lista local
    await fetchRecords && fetchRecords();

    // Limpa o formulário
    setFormData({});
    setPreviewData({});

    // Confirmação (se aplicável)

    if (!creating && form_type === 'confirmation') {
      localStorage.setItem(CONFIRMATION_KEY, "true");
      setAlreadySubmitted(true);
    }


  } catch (err) {
    console.error(err);
    toast({ title: 'Erro', description: err.message || 'Não foi possível salvar' });
  } finally {
    setLoading(false);
  }
};
 

  const [enabled, setEnabled] = useState(()=>{
    const saved = localStorage.getItem(ENABLE_KEY);
    return saved ? JSON.parse(saved) : true; // padrão: ligado
  });

  

  const [alreadySubmitted, setAlreadySubmitted] = useState(false);


  useEffect(() => {
  if (!creating && form_type === 'confirmation') {
    const saved = localStorage.getItem(CONFIRMATION_KEY);
    setAlreadySubmitted(saved === "true"); // converte string para boolean
  }
}, [submodule_id, form_type]);


  if (!isOpen) return null

  
  // Ordena os fields pelo 'order', colocando null no final
    

  const [isFormValid, setIsFormValid] = useState(false);
  const checkRequiredFields = () => {
    if (!fields?.length) return false;

    // Verifica cada campo obrigatório
    return fields.every(f => {
      if (!f.required) return true; // ignora campos não obrigatórios
      const value = formData[f.name];
      // considera vazio se for null, undefined, "", [], false (para boolean não obrigatória pode ajustar)
      if (f.field_type === "boolean") return value === true; // boolean obrigatório precisa ser true
      if (f.field_type === "multiselect") return Array.isArray(value) && value.length > 0;
      return value !== undefined && value !== null && value !== "";
    });
  };
  useEffect(() => {
    setIsFormValid(checkRequiredFields());
  }, [formData, fields]);
   

  const sortedFields = [...fields].sort((a, b) => {
    if (a.order == null && b.order == null) return 0;
    if (a.order == null) return 1;
    if (b.order == null) return -1;
    return a.order - b.order;
  });


  return (
    <>{!loading && !creating && alreadySubmitted ? (
      <ConfirmationTemplate
        title={title}
        subtitle={subtitle}
        message={message}
        submoduleId={submodule_id}
        fixed={true}
        companyFields={companyFieldsData} 
        userFields={userFieldsData}
        company={company}
        user={user}
      />)
      :
      !limiteAtingido ? (
      <div
      className={`${!creating && 'sm:relative md:fixed'} inset-0 z-50 flex items-center justify-center duration-300 px-2 sm:px-0 py-3 bg-blue-100`}
      onClick={onClose}
    >
      <div
        className="relative dark:bg-gray-800 sm:shadow-2xl w-full max-w-2xl sm:rounded-sm transform transition-all duration-300 motion-safe:animate-fadeIn overflow-hidden shadow-md border border-gray-100 font-sans bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Conteúdo com rolagem */}
        <div className={`${!creating && 'md:max-h-[90vh]'} overflow-y-auto px-4 sm:px-6  py-6 space-y-6 md:bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800  `}>
          {!creating && <div className="flex justify-center items-center">
          {logoUrl ? (
            <div
              className={`shadow-md border border-gray-200 bg-center bg-cover bg-no-repeat rounded-full`}
              style={{
                width: 100,
                height: 100,
                backgroundImage: `url(${logoUrl})`,
              }}
            />
          ) : null}
        </div>}
          {/* Cabeçalho */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-200 pb-4">
           <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-100 flex items-center justify-center gap-2 w-full text-center">
              {submoduleName && submoduleName}
              {loading && <Loader2 className="w-5 h-5 animate-spin text-gray-500" />}
            </h2>

          </div>
          {/* Seção de finanças */}
          {page === "FormFinances" && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tipo</label>
              <select
                name="tipo"
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setTipo(e.target.value)}
              >
                <option value="entrada">Entrada</option>
                <option value="saida">Saída</option>
              </select>
            </div>
          )}

         <div>
          {sortedFields.map((field) => (
            <div key={field.id} className="mb-4">
              {renderInput(field)}
            </div>
          ))}

  
        </div>
          {/* Rodapé fixo (salvar/fechar) */}
          <div className="sticky w-full dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 pt-3 pb-4 flex sm:flex-row items-center justify-end gap-3 sm:gap-2 px-4 sm:px-6">
            {!shared && <Button
              onClick={onClose}
              className="w-full sm:w-auto bg-gray-600 hover:bg-gray-500 text-white px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all hover:shadow-lg"
            >
              Fechar
            </Button>}
            <Button
              onClick={()=>{
                if(sendForKanban && !userLogado) {
                  navigate('/login')
                } else {
                  handleSave()
                }
              }}
              disabled={loading || calculating || !isFormValid}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-500 text-white px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all hover:shadow-lg"
            >
              <Upload className="w-4 h-4" />
              {loading ? "Salvando..." : "Enviar"}
            </Button>
          </div>
           {!creating && 
           <footer className="w-full dark:bg-gray-900 py-3 border-t border-gray-200 dark:border-gray-700 mt-2">
      <div className="max-w-4xl mx-auto flex flex-col  justify-center items-center gap-4 text-sm text-gray-800 dark:text-gray-00 mt-2">
        
       {/* Usuário */}
        {userFieldsData.length > 0 && (
          <div className="flex flex-col justify-center gap-4 items-center">
            {userFieldsData
              .filter((f) => f.field_name.toLowerCase() !== "logo") // 👈 ignora o campo logo
              .map((f) => (
                <span
                  key={f.field_name}
                  className="font-semibold text-gray-800 dark:text-gray-100 text-sm sm:text-base truncate"
                >
                  {user?.[f.field_name] ?? "-"}
                </span>
              ))}
          </div>
        )}

        {/* Empresa */}
        {companyFieldsData.length > 0 && company && (
          <div className="flex flex-col justify-center gap-4 items-center">
            {companyFieldsData
              .filter((f) => f.field_name.toLowerCase() !== "logo") // 👈 ignora o campo logo
              .map((f) => (
                <span
                  key={f.field_name}
                  className="font-semibold text-gray-800 dark:text-gray-100 text-sm sm:text-base truncate"
                >
                  {company?.[f.field_name] ?? "-"}
                </span>
              ))}
          </div>
        )}

      </div>
          </footer>}
           <div className="border-t border-gray-200"/>
          <p className="text-center text-sm text-gray-500 mt-6">
             © 2025
            Criado por <a href="https://usenivelo.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 hover:underline">useNivelo</a>
          </p>
          </div>
          </div>
      </div>
      ):
      (
      <div>
        <LimitReachedFullScreen/>
      </div>
      )
        }
    </>
  );
}
