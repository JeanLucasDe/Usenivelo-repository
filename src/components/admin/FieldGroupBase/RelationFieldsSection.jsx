import { useEffect, useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { supabase } from "@/lib/customSupabaseClient";

export default function RelationFieldsSection({
  camposPorTipo,
  editingFieldId,
  newField,
  creatingFieldType,
  setNewField,
  setSelectedField,
  handleSaveField,
  handleDeleteField,
  handleEditClick,
  handleCloseClick,
  setCreateNewField,
  handleUpdateRelatedConfigs,
  handleDefaultChange
  
}) {
  const [recordsCache, setRecordsCache] = useState({}); // cache por submoduleId

  useEffect(() => {
    const fetchAllRelatedRecords = async () => {
      for (const campo of camposPorTipo.relation || []) {
        for (const rc of campo.relatedConfigs || []) {
          if (!recordsCache[rc.submodule]) {
            const { data, error } = await supabase
              .from("submodule_records")
              .select("id, data")
              .eq("submodule_id", rc.submodule);
            if (!error && data) {
              setRecordsCache((prev) => ({ ...prev, [rc.submodule]: data }));
            }
          }
        }
      }
    };
    fetchAllRelatedRecords();
  }, [camposPorTipo.relation]);

  

  return (
    <div className="grid select-none bg-white rounded-xl border border-gray-400 p-6 space-y-5 shadow-lg w-full">
      <div className="w-full">
        <div className="flex justify-between">
          <h3 className="text-gray-700 font-semibold mb-2 flex items-center">
            Relation
            <button
              className="flex items-center gap-2 px-0.5 py-0.5 rounded-lg border border-white bg-green-500 text-white shadow-sm hover:bg-green-400 transition ml-2"
              onClick={() => {
                setCreateNewField(true);
                setNewField({ ...newField, field_type: "relation" });
              }}
            >
              <Plus className="w-4 h-4" />
            </button>
          </h3>
        </div>

        <div className="grid sm:grid-cols-2 gap-2 w-full">
          {camposPorTipo.relation.map((campo) => (
            <div
              key={campo.id}
              className="w-full border border-gray-300 rounded-md p-4 mb-4"
            >
              <div className="flex items-center justify-between">
                {editingFieldId === campo.id ? (
                  <>
                    <input
                      className="border border-gray-400 rounded-md px-2 py-1 text-sm w-full"
                      value={newField.name}
                      onChange={(e) => {
                        setNewField({
                          ...newField,
                          name: e.target.value,
                          field_type: "relation",
                        });
                        setSelectedField(campo);
                      }}
                    />
                    <button
                      onClick={() => handleSaveField()}
                      className="ml-2 text-green-600 border border-green-600 px-2 py-0.5 rounded-md hover:bg-green-50"
                    >
                      Salvar
                    </button>
                    <button
                      className="ml-2 text-red-600 border border-red-600 px-2 py-0 rounded-md hover:bg-green-50"
                      onClick={handleCloseClick}
                    >
                      X
                    </button>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between w-full">
                      {campo.name}
                      <div className="flex">
                        <Trash2
                          className="w-4 h-4 ml-2 text-red-500 cursor-pointer"
                          onClick={() => handleDeleteField(campo)}
                        />
                        <Edit
                          className="w-4 h-4 ml-2 text-blue-500 cursor-pointer"
                          onClick={() => handleEditClick(campo)}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Lista de relatedConfigs */}
              {campo.relatedConfigs?.map((rc, idx) => (
                <div
                  key={idx}
                  className="mt-3 p-3 border border-gray-200 rounded-md bg-gray-50"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-gray-800 text-sm font-medium">
                      {rc.moduleName} / {rc.submoduleName}
                    </span>
                    <button
                      className="text-red-600 text-sm"
                      onClick={() => {
                        const updatedConfigs = campo.relatedConfigs.filter(
                          (_, i) => i !== idx
                        );
                        handleUpdateRelatedConfigs(campo.id, updatedConfigs);
                      }}
                    >
                      Remover
                    </button>
                  </div>

                  <div className="mt-1 text-sm text-gray-600">
                    Campos: {rc.fieldNames.join(", ")}
                  </div>

                  {/* Select para valor padrão */}
                  <div className="mt-3">
                    <label className="text-sm text-gray-700">
                      Valor padrão:
                    </label>
                    <select
                      className="mt-1 w-full border border-gray-300 rounded-md px-2 py-1 text-sm"
                      value={rc.defaultValue || ""}
                      onChange={(e) =>
                        handleDefaultChange(campo, idx, e.target.value)
                      }
                    >
                      <option value="">-- Selecione --</option>
                      {recordsCache[rc.submodule]?.map((rec) => (
                        <option
                          key={rec.id}
                          value={rc.fieldNames
                            .map((f) => rec.data[f])
                            .join(" - ")}
                        >
                          {rc.fieldNames.map((f) => rec.data[f]).join(" - ")}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          ))}

          {/* Criando novo campo relation */}
          {creatingFieldType === "relation" && (
            <div className="w-full mt-6 border border-gray-300 p-4 rounded-md">
              <input
                className="w-full border border-gray-300 rounded-md px-3 py-2 mb-2"
                placeholder="Nome do novo campo"
                value={newField.name}
                onChange={(e) =>
                  setNewField({
                    ...newField,
                    name: e.target.value,
                    field_type: "relation",
                  })
                }
              />
              <button
                className="mt-2 text-green-600 border border-green-600 px-2 py-1 rounded-md hover:bg-green-50"
                onClick={() => handleSaveField()}
              >
                Salvar
              </button>
              <button
                className="ml-2 text-red-600 border border-red-600 px-2 py-0 rounded-md hover:bg-green-50"
                onClick={handleCloseClick}
              >
                X
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
