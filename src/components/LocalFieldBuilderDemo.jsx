import React, { useState } from "react";
import { Trash2, Calculator, Layers, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LocalFieldFormDemo() {
  const FIELD_TYPES = [
    "text",
    "number",
    "date",
    "boolean",
    "textarea",
    "select",
    "formula",
    "etapas",
  ];

  const [fields, setFields] = useState([]);
  const [newField, setNewField] = useState({
    name: "",
    field_type: "",
    subFields: [],
    formula: "",
    operation: [],
  });
  const [formData, setFormData] = useState({});
  const [enabled, setEnabled] = useState(false);

  const parseFormula = (formula) => {
    const operators = /[\+\-\*\/\(\)]/g;
    const tokens = formula.split(operators).map((t) => t.trim()).filter(Boolean);
    const uniqueTokens = [...new Set(tokens)];
    const subFields = uniqueTokens.map((name) => ({ name, field_type: "text" }));
    const ops = formula.match(operators) || [];
    return { subFields, ops };
  };

  const handleAddField = () => {
    if (!newField.name || !newField.field_type) return;
    const id = `${newField.name}_${Date.now()}`;
    setFields([...fields, { ...newField, id }]);
    setNewField({ name: "", field_type: "", subFields: [], formula: "", operation: [] });
  };

  const handleRemoveField = (id) => {
    setFields(fields.filter((f) => f.id !== id));
    setFormData((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const renderInput = (field) => {
    switch (field.field_type) {
      case "text":
      case "number":
      case "date":
        return (
          <input
            type={field.field_type}
            value={formData[field.id] || ""}
            onChange={(e) =>
              setFormData({ ...formData, [field.id]: e.target.value })
            }
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
          />
        );
      case "boolean":
        return (
          <input
            type="checkbox"
            checked={!!formData[field.id]}
            onChange={(e) =>
              setFormData({ ...formData, [field.id]: e.target.checked })
            }
            className="h-5 w-5"
          />
        );
      case "textarea":
        return (
          <textarea
            value={formData[field.id] || ""}
            onChange={(e) =>
              setFormData({ ...formData, [field.id]: e.target.value })
            }
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
          />
        );
      case "select":
        return (
          <select
            value={formData[field.id] || ""}
            onChange={(e) =>
              setFormData({ ...formData, [field.id]: e.target.value })
            }
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione...</option>
            {field.subFields.map((sf, idx) => (
              <option key={idx} value={sf.name}>
                {sf.name}
              </option>
            ))}
          </select>
        );
      case "etapas":
        return (
          <div className="space-y-2">
            {field.subFields.map((sf, idx) => (
              <input
                key={idx}
                type="text"
                value={formData[`${field.id}_${idx}`] || ""}
                onChange={(e) =>
                  setFormData({ ...formData, [`${field.id}_${idx}`]: e.target.value })
                }
                placeholder={sf.name || `Etapa ${idx + 1}`}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>
        );
      case "formula":
        return (
          <input
            type="text"
            value={formData[field.id] || ""}
            onChange={(e) =>
              setFormData({ ...formData, [field.id]: e.target.value })
            }
            placeholder={field.formula || ""}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 px-7">

          {/* Cabeçalho */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
              Criador de Campos & Formulário
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Criador de Campos */}
            <div className="space-y-4 bg-white dark:bg-gray-700 p-4 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Criar Novo Campo</h3>
              <input
                type="text"
                placeholder="Nome do campo"
                value={newField.name}
                onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2"
              />
              <select
                value={newField.field_type}
                onChange={(e) => setNewField({ ...newField, field_type: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2"
              >
                <option value="">Selecione tipo...</option>
                {FIELD_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>

              {/* Subfields para etapas ou select */}
              {(newField.field_type === "etapas" || newField.field_type === "select") && (
                <div className="space-y-2">
                  {newField.subFields.map((sf, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={sf.name}
                        onChange={(e) => {
                          const copy = [...newField.subFields];
                          copy[idx].name = e.target.value;
                          setNewField({ ...newField, subFields: copy });
                        }}
                        placeholder="Nome da opção/etapa"
                        className="flex-1 border border-gray-300 rounded-lg p-2"
                      />
                      <button
                        onClick={() =>
                          setNewField({
                            ...newField,
                            subFields: newField.subFields.filter((_, i) => i !== idx)
                          })
                        }
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                  <Button
                    className="bg-green-500 hover:bg-green-600 text-white"
                    onClick={() =>
                      setNewField({
                        ...newField,
                        subFields: [...(newField.subFields || []), { name: "" }]
                      })
                    }
                  >
                    Adicionar {newField.field_type === "etapas" ? "Etapa" : "Opção"}
                  </Button>
                </div>
              )}

              {/* Fórmula */}
              {newField.field_type === "formula" && (
                <input
                  type="text"
                  placeholder="Digite a fórmula"
                  value={newField.formula}
                  onChange={(e) => {
                    const formula = e.target.value;
                    const { subFields, ops } = parseFormula(formula);
                    setNewField({ ...newField, formula, subFields, operation: ops });
                  }}
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              )}

              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white w-full mt-2"
                onClick={handleAddField}
              >
                Adicionar Campo
              </Button>
            </div>

            {/* Formulário gerado */}
            <div className="space-y-4 bg-white dark:bg-gray-700 p-4 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Formulário</h3>
              {fields.length === 0 && <p className="text-gray-500">Nenhum campo criado.</p>}
              {fields.map((f) => (
                <div key={f.id} className="relative bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-200">
                  <button
                    onClick={() => handleRemoveField(f.id)}
                    className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={16} />
                  </button>
                  <label className="block text-gray-700 font-medium mb-1">{f.name}</label>
                  {renderInput(f)}
                </div>
              ))}

              <Button className="bg-green-600 hover:bg-green-500 text-white w-full mt-4 flex items-center justify-center gap-2">
                <Upload className="w-4 h-4" /> Salvar Registro
              </Button>
            </div>
          </div>
    </div>
  );
}
