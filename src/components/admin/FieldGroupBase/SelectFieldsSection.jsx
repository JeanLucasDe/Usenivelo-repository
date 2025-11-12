import { Plus, Edit, Trash2 } from "lucide-react";
import { useState } from "react";

export default function SelectFieldsSection({
  camposPorTipo,
  editingFieldId,
  newField,
  creatingFieldType,
  setNewField,
  setSelectedField,
  setCreateNewField,
  handleSaveField,
  handleDeleteField,
  handleEditClick,
  selectSubCamp ,
  setSelectSubCamp,
  handleSaveSubField,
  handleCloseClick,
  handleNewClick,
  handleDeleteSubField,
  subFields
}) {
    const [showMenu, setShowMenu] = useState()
  if (!camposPorTipo.select) return null;

  return (
    <div className="grid  select-none bg-white rounded-xl border border-gray-400 space-y-5 shadow-lg w-full">
        <div className="w-full">
            <div className="flex p-4 items-center">
            <h3 className="text-gray-700 font-semibold ml-3">Select</h3>
            <button
                className="flex items-center gap-2 px-0.5 py-0.5 rounded-lg border border-white bg-green-500 text-white shadow-sm hover:bg-green-400 transition ml-2"
                onClick={()=> {
                setNewField({
                ...newField,
                field_type: 'select',
                });
                setCreateNewField(true)
            }}
            >
                <Plus className="w-4 h-4 " />
            </button>
            </div>

            <div className="grid gap-2 w-full">
            {camposPorTipo.select.map((campo) => (
                <div key={campo.id} className="w-full mb-4">
                <div className="flex items-center mt-2 mb-2 ml-2 justify-between">
                    <div className="flex items-center w-full">
                    {editingFieldId === campo.id ? (
                        <>
                        <input
                            className="border border-gray-400 rounded-md px-2 py-1 text-sm w-full"
                            value={newField.name ? newField.name : editingValue}
                            onChange={(e) => {
                            setNewField({
                                ...newField,
                                name: e.target.value,
                                field_type: 'select',
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
                        ):(
                        <>
                        <div className='flex items-center justify-between w-full'>
                            <h3>{campo.name}</h3>
                            <button
                                onClick={() =>
                                {
                                setShowMenu((prev) => (prev === campo.id ? null : campo.id))
                                }
                                }
                                className="p-2 mr-2 rounded-md hover:bg-gray-100"
                            >
                                ⋮
                            </button>
                        </div>
                            </>
                        )}
                    </div>

                    {/* Três pontinhos - menu de opções */}
                    <div className="relative">

                    {showMenu === campo.id && (
                        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-lg shadow-lg z-100">
                        <button
                            onClick={() => {
                            handleNewClick('select');
                            setSelectSubCamp(campo.id);
                            setShowMenu(null);
                            }}
                            className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 text-green-600"
                        >
                            Adicionar Subcampo
                        </button>

                        <button
                            onClick={() => {
                            handleEditClick(campo);
                            setShowMenu(null);
                            }}
                            className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 text-blue-600"
                        >
                            Editar Nome
                        </button>

                        <button
                            onClick={() => {
                            handleDeleteField(campo);
                            setShowMenu(null);
                            }}
                            className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 text-red-600"
                        >
                            Excluir Campo
                        </button>
                        </div>
                    )}
                    </div>
                </div>

                {/* Novo subcampo */}
                {creatingFieldType === 'select' && campo.id == selectSubCamp && (
                    <div className="w-full mt-3 mb-3 px-2">
                    <input
                        className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-800"
                        placeholder="Nome do novo subcampo"
                        value={newField.name}
                        onChange={(e) => {
                        setNewField({
                            ...newField,
                            name: e.target.value,
                            field_type: 'select',
                        });
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

                {/* Subcampos existentes */}
                {subFields
                    .filter((sub) => sub.field_id === campo.id)
                    .map((sub) => (
                    <div
                        key={sub.id}
                        className="flex items-center justify-between border border-gray-400 px-3 py-2 bg-white"
                    >
                        <span className="flex items-center">
                        {editingFieldId === sub.id ? (
                            <>
                            <input
                                className="border border-gray-400 rounded-md px-2 py-1 text-sm w-full"
                                value={newField.name ? newField.name : campo.name}
                                onChange={(e) => {
                                setNewField({
                                    ...newField,
                                    name: e.target.value,
                                    field_type: 'boolean',
                                });
                                setSelectedField(campo);
                                }}
                            />
                            <button
                                onClick={() => handleSaveSubField(campo, sub)}
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
                    </div>
                    ))}
                </div>
            ))}
            </div>
        </div>
    </div>
  );
}
