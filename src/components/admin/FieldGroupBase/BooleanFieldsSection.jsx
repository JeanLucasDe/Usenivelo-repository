import { Plus, Edit, Trash2 } from "lucide-react";

export default function BooleanFieldsSection({
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
  handleNewClick,
}) {
  if (!camposPorTipo.boolean) return null;

  return (
    <div className="grid select-none bg-white rounded-xl border border-gray-400 p-6 space-y-5 shadow-lg w-full">
      <div className="w-full">
        <div className="flex justify-between">
          <h3 className="text-gray-700 font-semibold mb-2 flex items-center">
            Boolean
            <button
              className="flex items-center gap-2 px-0.5 py-0.5 rounded-lg border border-white bg-green-500 text-white shadow-sm hover:bg-green-400 transition ml-2"
              onClick={() => handleNewClick("boolean")}
            >
              <Plus className="w-4 h-4" />
            </button>
          </h3>
        </div>

        <div className="grid sm:grid-cols-2 gap-2 w-full">
          {camposPorTipo.boolean.map((campo) => (
            <div key={campo.id} className="w-full">
              <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center">
                {editingFieldId === campo.id ? (
                  <>
                    <input
                      className="border border-gray-400 rounded-md px-2 py-1 text-sm w-full"
                      value={newField.name ? newField.name : campo.name}
                      onChange={(e) => {
                        setNewField({
                          ...newField,
                          name: e.target.value,
                          field_type: "boolean",
                        });
                        setSelectedField(campo);
                      }}
                    />
                    <button
                      onClick={handleSaveField}
                      className="ml-2 text-green-600 border border-green-600 px-2 py-0.5 rounded-md hover:bg-green-50"
                    >
                      Salvar
                    </button>
                    <button
                      onClick={handleCloseClick}
                      className="ml-2 text-red-600 border border-red-600 px-2 py-0 rounded-md hover:bg-red-50"
                    >
                      X
                    </button>
                  </>
                ) : (
                  <>
                    {campo.name}
                    <Trash2
                      className="w-4 h-4 ml-2 text-red-500 cursor-pointer"
                      onClick={() => handleDeleteField(campo)}
                    />
                    <Edit
                      className="w-4 h-4 ml-2 text-blue-500 cursor-pointer"
                      onClick={() => handleEditClick(campo)}
                    />
                  </>
                )}
              </label>

              <div className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-400">
                <p>Campo booleano</p>
              </div>
            </div>
          ))}

          {creatingFieldType === "boolean" && (
            <div className="w-full mt-6">
              <input
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-800"
                placeholder="Nome do novo campo"
                value={newField.name}
                onChange={(e) =>
                  setNewField({
                    ...newField,
                    name: e.target.value,
                    field_type: "boolean",
                  })
                }
              />
              <button
                onClick={handleSaveField}
                className="mt-2 text-green-600 border border-green-600 px-2 py-1 rounded-md hover:bg-green-50"
              >
                Salvar
              </button>
              <button
                onClick={handleCloseClick}
                className="ml-2 text-red-600 border border-red-600 px-2 py-0 rounded-md hover:bg-red-50"
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
