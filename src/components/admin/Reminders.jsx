import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { MoreVertical } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import TaskBoard from './TaskBoardReminders';

export default function TodoCalendar() {
  const [tasks, setTasks] = useState([]);
  const [sortBy, setSortBy] = useState("date"); // "date" ou "priority"
  const [sortByOrder, setSortByOrder] = useState("-")
  const { toast } = useToast();
  const now = new Date();
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  const [openModal, setOpenModal] = useState(false);
  const [currentTask, setCurrentTask] = useState({
    title: "",
    date: now.toISOString().split('T')[0],
    time: now.toTimeString().slice(0, 5),
    tag: "",
    notes: "",
    priority: "",
    completed: false,
  });

const [lastClick, setLastClick] = useState(0);

const handleClickDelete = async(id) => {
      try {
          const { error } = await supabase
            .from("tasks")
            .delete()
            .eq("id", id);
          if (error) {
            console.error("Error delete task:", error.message);
            return;
          }
          fetchTasks();
          setOpenModal(false)
        } catch (error) {
          console.error("Unexpected error:", err);
        }
    }


  const handleSaveTask = async (task) => {


    if (!task.title) return alert("insira um titulo")

    try {
      
        if (task.id) {
          // update
          await supabase
            .from("tasks")
            .update(task)
            .eq("id", task.id);
        } else {
          // insert
          const { data: { user } } = await supabase.auth.getUser();

          if (!user) return;

          await supabase
            .from("tasks")
            .insert([{ ...task, user_id: user.id }]);
        }
  
        fetchTasks();
        setOpenModal(false);
  
        setCurrentTask({
          title: "",
          date: "",
          time: "",
          tag: "",
          notes: "",
          priority: "low",
          completed: false,
        });




    } catch (err) {
      console.error(err);
      alert("Erro ao salvar tarefa");
    }
  };


   function RoundCheckbox({ label, checked, onChange }) {
    return (
      <label className="flex items-center cursor-pointer space-x-2">
        <div
          className={`w-4 h-4 rounded-full border-2 border-gray-400 flex items-center justify-center transition-all
            ${checked ? 'bg-green-600 border-green-600' : 'bg-white'}`}
          onClick={() => onChange(!checked)}
        >
          {checked && (
            <div className="w-3 h-3 rounded-full bg-green"></div>
          )}
        </div>
        <span className="text-gray-700 select-none">{label}</span>
      </label>
    );
  }
  
  const [filterView, setFilterView] = useState('day'); // 'day', 'week', 'month'
  const [filterMonth, setFilterMonth] = useState(null);
  const [filterDate, setFilterDate] = useState("");
  const [filterTag, setFilterTag] = useState("");


  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error("Usuário não autenticado:", userError);
      return;
    }

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq("user_id", user.id)
      .order('date', { ascending: true });
  

    if (error) {
      console.error(error);
    } else {
      setTasks(data);
    }
  };

  

  

  const DateStr = (now) => {return now.toISOString().split('T')[0]} // 'yyyy-mm-dd'

  
  const filterTasks = () => {
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0]; // YYYY-MM-DD

  // 1️⃣ Filtragem
  const filtered = tasks.filter((task) => {
    const taskDate = new Date(task.date);

    // 📌 Filtro por período
    switch (filterView) {
      case "day":
        if (task.date !== todayStr) return false;
        break;
      case "week":
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - (now.getDay() === 0 ? 6 : now.getDay() - 1));
  startOfWeek.setHours(0,0,0,0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23,59,59,999);

  const taskDateTime = task.date && task.time 
      ? new Date(`${task.date}T${task.time}`) 
      : new Date(task.date);

  if (!(taskDateTime >= startOfWeek && taskDateTime <= endOfWeek)) return false;
  break;


      case "month":
        if (
          taskDate.getMonth() !== now.getMonth() ||
          taskDate.getFullYear() !== now.getFullYear()
        ) {
          return false;
        }
        break;
      case "custom-month":
        if (
          filterMonth === null ||
          taskDate.getMonth() !== filterMonth ||
          taskDate.getFullYear() !== now.getFullYear()
        ) {
          return false;
        }
        break;
      case "custom-date":
        if (filterDate && task.date !== filterDate) return false;
        break;
      default:
        break;
    }

    // 📌 Filtro por Tag
    if (
      filterTag &&
      !task.tag?.toLowerCase().includes(filterTag.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  // 2️⃣ Ordenação
  return filtered.sort((a, b) => {
    // 🔹 Ordenar por data e hora
    if (sortBy === "date") {
      const getDateTime = (task) => {
        // Caso tenha campos separados (date + time)
        if (task.date && task.time)
          return new Date(`${task.date}T${task.time}`);
        // Caso tenha data no formato "2025-10-06 14:30"
        if (typeof task.date === "string" && task.date.includes(" "))
          return new Date(task.date.replace(" ", "T"));
        // Caso seja apenas data
        return new Date(task.date);
      };

      const diff = getDateTime(a) - getDateTime(b);
      return sortByOrder === "asc" ? diff : -diff;
    }

    // 🔹 Ordenar por prioridade
    if (sortBy === "priority") {
      const priorityOrder = { Alta: 3, Media: 2, Baixa: 1 };
      const diff =
        (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
      return sortByOrder === "asc" ? -diff : diff;
    }

    return 0;
  });
};




  function Modal({ isOpen, onClose, task, onSave }) {
    let [outer, setOuter] = useState(false)
    let [agendar, setAgendar] = useState(false)
    const now = new Date()
    const [formData, setFormData] = useState(currentTask || {
      title: "",
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().slice(0, 5),
      tag: "Tarefa",
      notes: "",
      priority: "Media",
      completed: false,
    });

    // sempre que o `task` mudar (abrir modal com nova task), atualiza localmente
    useEffect(() => {
      if (task) setFormData(task);
    }, [task]);

    if (!isOpen) return null;

    return (
     <div className=" fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 transition-opacity">
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-lg space-y-6 transform transition-all duration-300 scale-100 motion-safe:animate-fadeIn overflow-y-auto max-h-[90vh]">
    
    {/* Botão Fechar */}
    <button
      onClick={onClose}
      className="fixed top-4 right-4 text-gray-600 hover:text-gray-900 transition"
    >
      ✕
    </button>

    {/* Title */}
    <div>
      <label className="block text-sm font-medium mb-1">Título</label>
      <input
        type="text"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        className="w-full px-3 py-2 border rounded-lg"
        placeholder="Digite o título"
      />
    </div>
    <div className="flex items-center justify-between">
      <label className="text-sm font-medium">Agendar</label>
      <button
        type="button"
        onClick={() =>
          setAgendar(!agendar)
        }
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition 
          ${agendar ? "bg-purple-600" : "bg-gray-300"}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition 
            ${agendar? "translate-x-6" : "translate-x-1"}`}
        />
      </button>
    </div>

    {agendar &&
    
    <div className="grid grid-cols-2 gap-2">
      <div>
        <label className="block text-sm font-medium mb-1">Data</label>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Hora</label>
        <input
          type="time"
          value={formData.time}
          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>
    </div>
    }

    

    
    <div>
      <label className="block text-sm font-medium mb-1">Notas</label>
      <textarea
        value={formData.notes}
        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        className="w-full px-3 py-2 border rounded-lg h-32"
        placeholder="Digite aqui..."
      />
    </div>

    {/* Tags */}
    <div>
      <label className="block text-sm font-medium mb-1">Tag</label>
      <select
        value={formData.tag}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, tag: e.target.value }))
        }
        disabled={outer}
        className="w-full mt-2 border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-purple-300"
      >
        <option value="tarefa">Tarefa</option>
        <option value="trabalho">Trabalho</option>
        <option value="reunião">Reunião</option>
      </select>

      <div className="flex items-center mt-2 gap-2">
        <input
          type="checkbox"
          checked={outer}
          onChange={() => {
            setOuter(!outer);
            setFormData({ ...formData, tag: "" });
          }}
        />
        <label>Outro</label>
      </div>

      {outer && (
        <input
          type="text"
          className="w-full mt-2 border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-purple-300"
          placeholder="Tag"
          onChange={(e) =>
            setFormData({ ...formData, tag: e.target.value })
          }
        />
      )}
    </div>

    {/* Priority */}
    <div>
      <label className="block text-sm font-medium mb-1">Prioridade</label>
      <select
        value={formData.priority}
        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
        className="w-full px-3 py-2 border rounded-lg"
      >
        <option value="Baixa" >Baixa</option>
        <option value="Media">Media</option>
        <option value="Alta">Alta</option>
      </select>
    </div>

    {/* Save button */}
    <div className="flex justify-end">
      {formData.id && <button
        onClick={()=> handleClickDelete(formData.id)}
        className="px-4 py-2 mr-2 bg-red-500 text-black rounded-lg hover:bg-red-300"
      >
        Apagar
      </button>}
      <button
        onClick={() => handleSaveTask(formData)}
        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
      >
        Salvar
      </button>
    </div>
  </div>
</div>

    );
  }

// Função para reorganizar array

// Separar as tarefas por status
const upcomingTasks = filterTasks().filter((t) => !t.completed);
const completedTasks = filterTasks().filter((t) => t.completed);

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

function handleDragEnd(result) {
  if (!result.destination) return; // Se soltar fora da lista

  const { source, destination } = result;

  // Apenas se arrastar dentro da mesma lista
  if (source.droppableId === destination.droppableId) {
    if (source.droppableId === "upcoming") {
      const updated = reorder(
        upcomingTasks,
        source.index,
        destination.index
      );
      setUpcomingTasks(updated);
    } else if (source.droppableId === "completed") {
      const updated = reorder(
        completedTasks,
        source.index,
        destination.index
      );
      setCompletedTasks(updated);
    }
  }
}





  return (
    <div className="px-3 sm:px-6">
        <h1 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-6 text-gray-800 text-center sm:text-left">
          📌 Lembretes
        </h1>

        {/* Filtros */}
        <div className="mb-4 sm:mb-6 border-b border-gray-200">
          <div className="flex flex-wrap sm:flex-nowrap gap-3 sm:gap-6 relative justify-center sm:justify-start">
            {[
              { label: "Hoje", value: "day" },
              { label: "Semana", value: "week" },
              { label: "Mês atual", value: "month" },
            ].map((btn) => (
              <button
                key={btn.value}
                onClick={() => setFilterView(btn.value)}
                className={`relative pb-1 sm:pb-2 px-2 sm:px-3 text-sm sm:text-base transition-colors duration-300 ${
                  filterView === btn.value
                    ? "text-purple-600 font-medium"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {btn.label}
                {filterView === btn.value && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] sm:h-[3px] bg-purple-500 rounded-full transition-all duration-300" />
                )}
              </button>
            ))}

            {/* Custom Month */}
            <select
              value={filterMonth ?? ""}
              onChange={(e) => {
                setFilterView("custom-month");
                setFilterMonth(Number(e.target.value));
              }}
              className="pb-1 sm:pb-2 px-2 text-sm sm:text-base bg-transparent border-b border-gray-300 text-gray-600 focus:outline-none focus:border-purple-400"
            >
              <option value="">Mês</option>
              {months.map((m, i) => (
                <option key={i} value={i}>
                  {m}
                </option>
              ))}
            </select>

            {/* Custom Date */}
            <input
              type="date"
              value={filterDate}
              onChange={(e) => {
                setFilterView("custom-date");
                setFilterDate(e.target.value);
              }}
              className="pb-1 sm:pb-2 px-2 text-sm sm:text-base bg-transparent border-b border-gray-300 text-gray-600 focus:outline-none focus:border-purple-400"
            />

            {/* Tag */}
            <input
              type="text"
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
              className="px-2 py-1 text-sm sm:text-base bg-gray-100 border border-gray-300 text-gray-700 rounded-md focus:ring-2 focus:ring-purple-400 focus:outline-none"
              placeholder="🔖 Tag"
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
          {/* Ordenar por */}
          <div className="flex items-center gap-2">
            <label className="text-gray-700 text-sm font-medium">Ordenar por:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:ring-2 focus:ring-purple-500 focus:outline-none"
            >
              <option value="date">📅 Data</option>
              <option value="priority">⭐ Prioridade</option>
            </select>
          </div>

          {/* Ordem */}
          <div className="flex items-center gap-2">
            <label className="text-gray-700 text-sm font-medium">Ordem:</label>
            <select
              value={sortByOrder}
              onChange={(e) => setSortByOrder(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:ring-2 focus:ring-purple-500 focus:outline-none"
            >
              <option value="asc">⬆️ Crescente</option>
              <option value="desc">⬇️ Decrescente</option>
            </select>
          </div>
        </div>



        <TaskBoard
          tasks={tasks}
          setTasks={setTasks}
          setOpenModal={setOpenModal}
          setCurrentTask={setCurrentTask}
        />


  {/* Modal */}
  <Modal
    isOpen={openModal}
    onClose={() => setOpenModal(false)}
    task={currentTask}
    setTask={setCurrentTask}
    onSave={(newTask) => {
      if (currentTask) {
        setTasks((prev) =>
          prev.map((t) => (t.id === currentTask.id ? newTask : t))
        );
      } else {
        setTasks((prev) => [...prev, newTask]);
      }
    }}
  />
    </div>

  );
}
