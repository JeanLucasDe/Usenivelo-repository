import { MoreVertical, User } from "lucide-react";
import { Draggable } from "react-beautiful-dnd";

export default function KanbanCard({
  card,
  index,
  canMoveStep,
  usuarios,
  companies,
  submodules,
  step,
  canView,
  canEdit,
  canDelete,
  openMenuCardId,
  setOpenMenuCardId,
  selectSubmoduleButton,
  setRecord,
  setCanEdit,
  setOnlyView,
  handleReloadKanban,
  supabase,
}) {
  const d = card.data || {};
  const title = d.title;
  const subtitle = d.description;

  const creatorCard = usuarios.find((user) => user.id === card.created_by);
  const CompanieCreator = companies.find((c) => c.id === creatorCard?.company_id);
  const avatar = CompanieCreator?.logo;

  const date = card.created_at;

  return (
    <Draggable
      key={card.id}
      draggableId={card.id}
      index={index}
      isDragDisabled={!canMoveStep}
    >
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="group relative p-3 rounded-md border border-gray-200 bg-white shadow-md hover:shadow-md 
        transition cursor-pointer select-none flex flex-col justify-between space-y-2 ml-2 mr-2 border border-gray-200"
        >
          {/* Top: avatar + data + menu */}
          <div className="flex justify-between items-start">
            <div>
              {avatar ? (
                <img src={avatar} className="w-9 h-9 rounded-full object-cover" />
              ) : (
                <div className="w-6 h-6 border border-gray-200 rounded-full">
                  <User />
                </div>
              )}
            </div>

            {/* Menu */}
            <div className="relative">
              <button
                className="p-1 hover:bg-gray-100 rounded"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenMenuCardId((prev) => (prev === card.id ? null : card.id));
                }}
              >
                <MoreVertical className="w-4 h-4 text-gray-500" />
              </button>

              {openMenuCardId === card.id && (
                <div
                  className="absolute right-0 mt-1 w-28 bg-white border border-gray-200 shadow-lg rounded-md z-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  {canView && (
                    <button
                      className="text-left w-full px-3 py-2 hover:bg-gray-100"
                      onClick={() => {
                        const sub = submodules.find((i) => i.id === card.submodule_id);
                        selectSubmoduleButton(sub ? sub : "main", step.id);
                        setRecord({ data: card.data, ...card });
                        setOpenMenuCardId(null);
                        setOnlyView(true);
                      }}
                    >
                      Ver
                    </button>
                  )}

                  {canEdit && (
                    <button
                      className="text-left w-full px-3 py-2 hover:bg-gray-100"
                      onClick={() => {
                        const sub = submodules.find((i) => i.id === card.submodule_id);
                        selectSubmoduleButton(sub, step.id);
                        setRecord({ data: card.data, ...card });
                        setCanEdit(true);
                        setOpenMenuCardId(null);
                        setOnlyView(false);
                      }}
                    >
                      Editar
                    </button>
                  )}

                  {canDelete && (
                    <button
                      className="text-left w-full px-3 py-2 hover:bg-gray-100 text-red-500"
                      onClick={async () => {
                        try {
                          await supabase.from("kanban_cards").delete().eq("id", card.id);

                          if (card.record_id) {
                            await supabase
                              .from("submodule_records")
                              .delete()
                              .eq("id", card.record_id);
                          }

                          setOpenMenuCardId(null);
                          handleReloadKanban();
                        } catch (err) {
                          console.error("Erro deletando card:", err);
                          alert("Erro ao deletar");
                        }
                      }}
                    >
                      Deletar
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Título / subtítulo */}
          <div className="flex flex-col w-full space-y-2">
            <div className="flex flex-col space-y-3 flex-1 min-w-0">
              <div className="text-sm font-bold text-gray-800 whitespace-nowrap overflow-hidden text-ellipsis w-full mt-3">
                {title}
              </div>

              {subtitle && (
                <div className="text-xs text-gray-500 truncate max-w-[200px] overflow-hidden whitespace-nowrap">
                  {subtitle}
                </div>
              )}
            </div>

            {/* Rodapé */}
            <div className="flex items-center pt-0.5 border-t space-x-1 mt-0.5">
              <div className="flex items-center gap-2 mt-2 text-xs text-gray-600">
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  💬 {card.data?.comments?.length || 0}
                </div>
                <div className="flex text-xs text-gray-600">
                  ✅ {card.data?.checklist?.filter((i) => i.done).length || 0}/
                  {card.data?.checklist?.length || 0}
                </div>
              </div>
            </div>

            {/* Labels */}
            <div className="flex gap-1 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {card.data?.labels?.map((label, idx) => (
                <span
                  key={idx}
                  className="text-[10px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap"
                  style={{ backgroundColor: label.color, color: "#fff" }}
                >
                  {label.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
