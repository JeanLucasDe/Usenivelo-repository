import { Plus, Edit, Trash2 } from "lucide-react";

export default function FormulaFieldsSection({
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
  showMenu,
  setShowMenu,
  parseFormula,
  editingValue
}) {
  if (!camposPorTipo.formula) return null;

  return (
    <div className="grid  select-none bg-white rounded-xl border border-gray-400 space-y-5 shadow-lg w-full pb-2">
                <div className="w-full">
                  <div className="flex p-4 items-center">
                    <h3 className="text-gray-700 font-semibold ml-3 text-4lg">Fórmulas</h3>
                    <button
                      className="flex items-center gap-2 px-0.5 py-0.5 rounded-lg border border-white bg-green-500 text-white shadow-sm hover:bg-green-400 transition ml-2"
                      onClick={() => {
                        handleNewClick('formula');
                        setNewField({ ...newField, hasFunction: true, field_type: 'formula' });
                      }}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
    
                  {creatingFieldType === 'formula' && (
                    <div className="w-full mt-3 mb-9 px-2">
                      <input
                        className="w-full border border-gray-500 rounded-md px-3 py-2 bg-white text-gray-800 mb-2"
                        placeholder="Nome do novo campo"
                        value={newField.name}
                        onChange={(e) => {
                          setNewField({ ...newField, name: e.target.value });
                        }}
                      />
                      <input
                        className="w-full border border-gray-500 rounded-md px-3 py-2 bg-white text-gray-800"
                        placeholder="Fórmula"
                        value={newField.formula}
                        onChange={(e) => {
                          const formula = e.target.value;
                          const { subFields, ops } = parseFormula(formula);
                          setNewField({ ...newField, subFields, operation: ops, formula: e.target.value });
                        }}
                      />
                      <button
                        onClick={() => handleSaveField()}
                        className="mt-2 text-green-600 border border-green-600 px-2 rounded-md hover:bg-green-50"
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
    
                  <div className="grid gap-2 w-full">
                    {camposPorTipo.formula.map((campo) => {
                      return (
                        <div key={campo.id} className="w-full p-4 border border-gray-400 relative">
                          <div className="block text-sm font-medium text-gray-600 mb-1 flex items-center justify-between">
                            {editingFieldId === campo.id ? (
                              <>
                                {!newField.editFormula &&
                                <input
                                  className="border border-gray-400 rounded-md px-2 py-1 text-sm w-full"
                                  value={newField.name ? newField.name : editingValue}
                                  onChange={(e) => {
                                    setNewField({
                                      ...newField,
                                      name: e.target.value,
                                      formula:campo.formula,
                                      operation:campo.operation,
                                      field_type: 'formula',
                                    });
                                    setSelectedField(campo);
                                  }}
                                />}
                                {newField.editFormula &&
                                <input
                                  className="border border-gray-400 rounded-md px-2 py-1 text-sm w-full"
                                  value={newField.formula ? newField.formula : editingValue || null}
                                  onChange={(e) => {
                                    const formula = e.target.value;
                                    const { subFields, ops } = parseFormula(formula);
                                    setNewField({
                                      ...newField,
                                      name: campo.name,
                                      formula:e.target.value,
                                      operation:ops,
                                      field_type: 'formula',
                                    });
                                    setSelectedField(campo);
                                  }}
                                />}
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
                                <div>
                                  <p className="font-semibold">{campo.name}</p>
                                  <p>{campo.formula}</p>
                                </div>
                                <div className="">
                                  <button
                                    onClick={() => setShowMenu((prev) => (prev === campo.id ? null : campo.id))}
                                    className="p-1 rounded-md hover:bg-gray-100"
                                  >
                                    ⋮
                                  </button>
    
                                  {showMenu === campo.id && (
                                    <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-lg shadow-lg z-[2000]" >
                                      <button
                                        onClick={() => {
                                          handleEditClick(campo);
                                          setShowMenu(false);
                                          setNewField({
                                            ...newField,
                                            name: campo.nome,
                                            formula: campo.formula,
                                            editFormula: false,
                                            field_type: 'formula',
                                          });
                                        }}
                                        className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 text-blue-600"
                                      >
                                        Editar Nome
                                      </button>
    
                                      <button
                                        onClick={() => {
                                          handleEditClick({ ...campo, editFormula: true });
                                          setNewField({
                                            ...newField,
                                            name: campo.nome,
                                            formula: campo.formula,
                                            editFormula: true,
                                            field_type: 'formula',
                                          });
                                          setShowMenu(false);
                                        }}
                                        className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 text-indigo-600"
                                      >
                                        Editar Fórmula
                                      </button>
    
                                      <button
                                        onClick={() => {
                                          handleDeleteField(campo);
                                          handleDeleteSubField(campo);
                                          setShowMenu(false);
                                        }}
                                        className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 text-red-600"
                                      >
                                        Excluir
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
    
                          
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
  );
}
