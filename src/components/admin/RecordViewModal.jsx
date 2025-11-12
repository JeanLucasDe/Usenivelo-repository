import React from "react";
import { Button } from "@/components/ui/button";
import { Calculator, Layers } from "lucide-react";

export default function RecordViewModal({ isOpen, onClose, record, fields, subFields }) {
  if (!isOpen) return null;

  const calculateField = (field, recordData) => {
    if (!field.formula) return recordData[field.name] ?? null;
    let formula = field.formula;
    Object.keys(recordData).forEach((key) => {
      const value = Number(recordData[key] ?? 0);
      formula = formula.replace(new RegExp(`\\b${key}\\b`, "g"), value);
    });
    try {
      return eval(formula);
    } catch (e) {
      console.error("Erro ao calcular fórmula:", e, "Formula:", formula);
      return null;
    }
  };

  return (
    <div
  className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
  onClick={onClose}
>
  <div
    className="relative w-full max-w-4xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-y-auto max-h-[90vh] p-6 sm:p-8"
    onClick={(e) => e.stopPropagation()}
  >
    {/* Header */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
        Visualizar Registro
      </h2>
      <Button variant="outline" onClick={onClose} className="sm:ml-auto">
        Fechar
      </Button>
    </div>

    {/* Campos */}
    <div className="space-y-5">
      {fields.map((field) => {
        const value = record.data?.[field.name];

        // Relation
        if (field.field_type === "relation") {
          const relatedConfig = field.relatedConfigs?.[0];
          const relatedItems = Array.isArray(value) ? value : [];

          return (
            <div key={field.id} className="mb-4">
              <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                {field.name} {relatedConfig?.submoduleName && <span className="text-gray-400 text-sm">({relatedConfig.submoduleName})</span>}
              </h4>
              {relatedItems.length === 0 ? (
                <p className="text-gray-400 italic">Nenhum registro relacionado</p>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                  <table className="min-w-full text-sm divide-y divide-gray-100 dark:divide-gray-700">
                    <thead className="bg-gray-100 dark:bg-gray-800">
                      <tr>
                        {relatedConfig.fieldNames.map((fn) => (
                          <th key={fn} className="px-4 py-2 text-left font-medium text-gray-600 dark:text-gray-300">
                            {fn}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-700">
                      {relatedItems.map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                          {relatedConfig.fields.map((fid, i) => (
                            <td key={fid} className="px-4 py-2">{item.data?.[relatedConfig.fieldNames[i]] ?? "-"}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        }

        // Boolean
        if (field.field_type === "boolean") {
          return (
            <div
              key={field.id}
              className="flex items-center justify-between p-4 rounded-xl bg-green-50 dark:bg-green-900/20"
            >
              <span className="font-medium text-gray-700 dark:text-gray-200">{field.name}</span>
              <span className={`font-semibold ${value ? "text-green-700 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}>
                {value ? "Sim" : "Não"}
              </span>
            </div>
          );
        }
        if (field.field_type === "file" || 'link') {
          return (
            <div key={field.id} className="flex justify-between p-4 rounded-xl mb-2">
              <span className="font-medium text-gray-700 dark:text-gray-200">{field.name}</span>
              <a href={value} target="_blank" className="text-gray-900 dark:text-gray-100">{value ?? "-"}</a>
            </div>
          );
        }

        // Etapas
        if (field.field_type === "etapas") {
          const etapas = subFields.filter((sf) => sf.field_id === field.id);
          return (
            <div key={field.id} className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl mb-4">
              <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2">
                {field.name} <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </h4>
              <div className="flex flex-wrap gap-2">
                {etapas.map((etapa) => {
                  const etapaVal = value?.[etapa.name] ?? false;
                  return (
                    <span
                      key={etapa.id}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        etapaVal ? "bg-blue-600 text-white dark:bg-blue-500" : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {etapa.name}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        }
        

        // Fórmula
        if (field.field_type === "formula") {
          const relatedSubs = subFields.filter((sf) => sf.field_id === field.id);
          const result = parseFloat(calculateField(field, record.data) ?? 0).toFixed(2);

          return (
            <div key={field.id} className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Calculator className="w-5 h-5 text-green-700 dark:text-green-400" />
                <span className="font-semibold text-gray-800 dark:text-gray-200">{field.name}</span>
              </div>
              {relatedSubs.length > 0 && (
                <div className="grid sm:grid-cols-2 gap-2 mb-2">
                  {relatedSubs.map((sf) => {
                    const subVal = record.data?.[sf.name] ?? 0;
                    return (
                      <div key={sf.id} className="text-sm text-gray-700 dark:text-gray-300">
                        <span className="text-gray-500 dark:text-gray-400">{sf.name}:</span> {subVal}
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="text-green-800 dark:text-green-400 font-semibold">Resultado: {result}</div>
            </div>
          );
        }

        // Text/Number
        return (
          <div key={field.id} className="flex justify-between p-4 rounded-xl mb-2">
            <span className="font-medium text-gray-700 dark:text-gray-200">{field.name}</span>
            <span className="text-gray-900 dark:text-gray-100">{value ?? "-"}</span>
          </div>
        );
      })}
    </div>
  </div>
</div>

  );
}
