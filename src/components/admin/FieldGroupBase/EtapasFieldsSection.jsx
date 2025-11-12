import { Plus, Edit, Trash2 } from "lucide-react";

export default function EtapasFieldsSection({
  camposPorTipo,
  editingFieldId,
  newField,
  subFields,
  creatingFieldType,
  setNewField,
  setSelectedField,
  handleSaveField,
  setSelectSubCamp,
  selectSubCamp,
  handleDeleteField,
  handleDeleteSubField,
  setCreateNewField,
  handleEditClick,
  handleCloseClick,
  handleSaveSubField,
  handleNewClick,
}) {
  if (!camposPorTipo.etapas) return null;

  return (
    <div className="grid select-none bg-white rounded-xl border border-gray-400 space-y-5 shadow-lg w-full">
        <div className="w-full">
        <div className="flex  p-4 items-center">
            <h3 className="text-gray-700 font-semibold ml-3">Etapas</h3>
            <button
                className="flex items-center gap-2 px-0.5 py-0.5 rounded-lg border border-white bg-green-500 text-white shadow-sm hover:bg-green-400 transition ml-2"
                onClick={()=> {
                setCreateNewField(true)
            }}
            >
                <Plus className="w-4 h-4 " />
            </button>
        </div>
        <div className="grid gap-2 w-full">
            {camposPorTipo.etapas.map((campo) => (
            <div key={campo.id} className="w-full mb-4">
                <div className='flex items-center mt-2 mb-2 ml-2'>
                    <h3>{campo.name}</h3>
                    <button
                    className="flex items-center gap-2 px-0.5 py-0.5 rounded-lg border border-white bg-green-500 text-white shadow-sm hover:bg-green-400 transition ml-2"
                    onClick={() => {
                        handleNewClick('etapas')
                        setSelectSubCamp(campo.id)
                    }}
                    >
                    <Plus className="w-4 h-4" />
                    </button>
                    <button
                    className="ml-2 text-red-600 border border-red-600 px-2 py-0 rounded-md hover:bg-green-50"
                    onClick={()=>handleDeleteField(campo)}
                    >
                        X
                    </button>
                </div>
                {creatingFieldType === 'etapas' && campo.id == selectSubCamp && (
                    <div className="w-full mt-3 mb-3 ">
                    <input
                        className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-800"
                        placeholder="Nome do novo campo"
                        value={newField.name}
                        onChange={(e) => {
                        setNewField({ ...newField, name: e.target.value ,field_type:'etapas'})
                        }}
                    />
                    <button
                        onClick={() => handleSaveSubField(campo)}
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
                {subFields
                .filter(sub => sub.field_id === campo.id)
                .map(sub => (
                    <div key={sub.id} className="flex items-center justify-between border border-gray-400 px-3 py-2 bg-white ">
                    <span className='flex items-center'>
                        {editingFieldId === sub.id ? (
                            <>
                            <input
                                className="border border-gray-400 rounded-md px-2 py-1 text-sm w-full"
                                value={newField.name ? newField.name : campo.name}
                                onChange={(e) =>{
                                setNewField({ ...newField, name: e.target.value, field_type:'boolean' })
                                setSelectedField(campo)
                                }}
                            />
                            <button
                                onClick={() => handleSaveSubField(campo,sub)}
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
                            {sub.name}
                            <Trash2
                                className="w-4 h-4 ml-2 text-red-500 cursor-pointer"
                                onClick={() => handleDeleteSubField(sub)}
                            />
                            <Edit
                                className="w-4 h-4 ml-2 text-blue-500 cursor-pointer"
                                onClick={() => handleEditClick(sub)}
                            />
                            </>
                        )}
                    </span>
                    <div className="w-5 h-5 bg-white border border-gray-500 rounded-full hover:bg-blue-400"></div>
                    </div>
                ))}
                </div>
            ))}
        </div>
        </div>
    </div>
  );
}
