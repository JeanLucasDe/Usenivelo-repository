import React, { useEffect, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { MoreVertical } from "lucide-react";
import { supabase } from "@/lib/customSupabaseClient";

export default function TaskBoard({ tasks, setTasks, setOpenModal, setCurrentTask }) {
  const ignoreIds = useRef(new Set());

  function RoundCheckbox({ checked, onChange }) {
    return (
      <div
        onClick={() => onChange(!checked)}
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center cursor-pointer
          ${checked ? "bg-green-600 border-green-600" : "bg-white border-gray-400"}`}
      >
        {checked && <div className="w-3 h-3 rounded-full bg-white" />}
      </div>
    );
  }

  function DateStr(date) {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  }

  const priorityColors = {
    Alta: "border-l-4 border-red-500 bg-red-50",
    Media: "border-l-4 border-yellow-400 bg-yellow-50",
    Baixa: "border-l-4 border-green-500 bg-green-50",
  };

  // Atualiza status concluído com user_id
  const updateTaskStatus = async (task, completed) => {
    try {
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error("Usuário não autenticado");

      const { error } = await supabase
        .from("tasks")
        .update({ completed, user_id: user.id })
        .eq("id", task.id);

      if (error) throw error;

      ignoreIds.current.add(task.id);
      setTasks(prev => prev.map(t => (t.id === task.id ? { ...t, completed } : t)));
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
    }
  };

  // Salva posição das tarefas com user_id
  const saveOrder = async (tasksList) => {
    try {
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error("Usuário não autenticado");

      for (let i = 0; i < tasksList.length; i++) {
        const task = tasksList[i];
        const { error } = await supabase
          .from("tasks")
          .update({ position: i, user_id: user.id })
          .eq("id", task.id);

        if (error) console.error(error);
        ignoreIds.current.add(task.id);
      }
    } catch (err) {
      console.error("Erro ao salvar ordem:", err);
    }
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceId = source.droppableId;
    const destId = destination.droppableId;

    const sourceTasks = sourceId === "todo" ? [...tasks.filter(t => !t.completed)] : [...tasks.filter(t => t.completed)];
    const destTasks = destId === "todo" ? [...tasks.filter(t => !t.completed)] : [...tasks.filter(t => t.completed)];

    const [movedTask] = sourceTasks.splice(source.index, 1);
    if (sourceId !== destId) movedTask.completed = destId === "done";
    destTasks.splice(destination.index, 0, movedTask);

    const newTasks = [
      ...(!movedTask.completed ? destTasks : tasks.filter(t => !t.completed && t.id !== movedTask.id)),
      ...(movedTask.completed ? destTasks : tasks.filter(t => t.completed && t.id !== movedTask.id)),
    ];

    setTasks(newTasks);
    saveOrder(destTasks);
  };

  const renderTask = (task, index) => {
    const cardColor = priorityColors[task.priority] || "border-l-4 border-gray-200 bg-white";
    return (
      <Draggable key={task.id.toString()} draggableId={task.id.toString()} index={index}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`p-3 sm:p-4 rounded-xl shadow flex justify-between items-center hover:shadow-lg transition ${cardColor}`}
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <RoundCheckbox
                checked={task.completed || false}
                onChange={(value) => updateTaskStatus(task, value)}
              />
              <div>
                <h3 className={`text-base sm:text-lg font-medium text-gray-800 ${task.completed ? 'line-through' : ''}`}>
                  {task.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500">
                  {DateStr(task.date)} <span className="mx-1 sm:mx-2">•</span> {task.time}
                </p>
              </div>
            </div>
            <div className="flex gap-2 sm:gap-3 items-center text-gray-600">
              {task.tag && (
                <span className={`text-xs px-2 py-0.5 rounded ${
                  task.priority === "Alta" ? "bg-red-100 text-red-600"
                  : task.priority === "Media" ? "bg-yellow-100 text-yellow-700"
                  : "bg-green-100 text-green-700"
                }`}>
                  {task.tag}
                </span>
              )}
              <MoreVertical
                className="cursor-pointer hover:text-purple-600"
                onClick={() => { setCurrentTask(task); setOpenModal(true); }}
              />
            </div>
          </div>
        )}
      </Draggable>
    );
  };

  const todoTasks = tasks.filter(t => !t.completed).sort((a, b) => a.position - b.position);
  const doneTasks = tasks.filter(t => t.completed).sort((a, b) => a.position - b.position);

  useEffect(() => {
    const channel = supabase
      .channel('tasks_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tasks' },
        (payload) => {
          const newTask = payload.new;
          const oldTask = payload.old;

          setTasks(prev => {
            switch (payload.eventType) {
              case 'INSERT':
                if (!prev.some(t => t.id === newTask.id)) return [...prev, newTask];
                return prev;
              case 'UPDATE':
                if (ignoreIds.current.has(newTask.id)) {
                  ignoreIds.current.delete(newTask.id);
                  return prev;
                }
                return prev.map(t => t.id === newTask.id ? newTask : t);
              case 'DELETE':
                return prev.filter(t => t.id !== oldTask.id);
              default:
                return prev;
            }
          });
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {/* Próximos */}
      <Droppable droppableId="todo">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}
            className="p-4 sm:p-5 bg-gradient-to-r from-purple-50 to-indigo-100 rounded-xl shadow-md mb-4 sm:mb-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-700">
                Próximos <span className="text-gray-500 text-sm sm:text-base ml-1">{todoTasks.length}</span>
              </h2>
              <button
                onClick={() => { setCurrentTask(null); setOpenModal(true); }}
                className="px-4 py-2 rounded-md bg-purple-600 text-white font-medium hover:bg-purple-700"
              >
                + Nova
              </button>
            </div>
            <div className="space-y-3">
              {todoTasks.map((task, index) => renderTask(task, index))}
              {provided.placeholder}
            </div>
          </div>
        )}
      </Droppable>

      {/* Feitos */}
      <Droppable droppableId="done">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}
            className="p-4 sm:p-5 bg-gradient-to-r from-green-50 to-green-100 rounded-xl shadow-md"
          >
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4">
              ✅ Feitos <span className="text-gray-500 text-sm sm:text-base ml-1">{doneTasks.length}</span>
            </h2>
            <div className="space-y-3">
              {doneTasks.map((task, index) => renderTask(task, index))}
              {provided.placeholder}
            </div>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
