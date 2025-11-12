import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronDown,ChevronLeft, ChevronRight, Trash2  } from "lucide-react"
import CalendarEntries from './CalendarEntries';

const CalendarNotionStyle = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState(null);
  const [events, setEvents] = useState([]);
  const [userForms, setUserForms] = useState([]);
  const [selectedFormId, setSelectedFormId] = useState(null);
  const { toast } = useToast();
  const [outer, setOuter] = useState(false)
  const [newEvent, setNewEvent] = useState({
    title: '',
    fields: [{ name: 'Nota', value: '' }],
    priority: 'normal',
    remind_me: false,
    remind_time: "",
    remind_frequency: "",
    remind_duration: 3,   // novo campo (em meses)
    remind_dates: [],      // novo campo (array de datas)
    save_form: false,
    tags: ''
  });
  const [tagFilter, setTagFilter] = useState('');

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  // --- Fetch user's forms ---
  const fetchUserForms = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user.id;

    const { data, error } = await supabase
      .from('form_calendar_fields')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) console.error(error);
    else setUserForms(data || []);
  };
 
  // --- Fetch events ---
  const fetchEvents = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user.id;

    const startOfMonthDate = new Date(currentYear, currentMonth, 1);
    const endOfMonthDate = new Date(currentYear, currentMonth + 1, 0);

    const { data, error } = await supabase
      .from('form_calendar_entries')
      .select('*')
      .eq('user_id', userId)
      .gte('date', startOfMonthDate.toISOString().split('T')[0])
      .lte('date', endOfMonthDate.toISOString().split('T')[0])
      .order('date', { ascending: true });

    if (error) console.error(error);

    else {
      setEvents(data || [])
      
    }
  };

  useEffect(() => {
    fetchUserForms();
    fetchEvents();
  }, [currentMonth, currentYear]);

  // --- Calendar calculations ---
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
  const calendarCells = [
    ...Array(firstDayIndex).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  // --- Navigation ---
  const handlePrevMonth = () => {
    setCurrentMonth(prev => (prev === 0 ? 11 : prev - 1));
    if (currentMonth === 0) setCurrentYear(y => y - 1);
  };
  const handleNextMonth = () => {
    setCurrentMonth(prev => (prev === 11 ? 0 : prev + 1));
    if (currentMonth === 11) setCurrentYear(y => y + 1);
  };

  // --- Field handling ---
  const handleAddField = () => {
    setNewEvent(prev => ({
      ...prev,
      fields: [...prev.fields, { name: 'Novo Campo', value: '' }]
    }));
  };
  const handleFieldChange = (index, key, value) => {
    const updatedFields = [...newEvent.fields];
    updatedFields[index][key] = value;
    setNewEvent(prev => ({ ...prev, fields: updatedFields }));
  };
  const handleDeleteField = (index) => {
    setNewEvent(prev => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index)
    }));
  };

// helpers
const pad = (n) => String(n).padStart(2, '0');




/**
 * startDateISO: "YYYY-MM-DD" (string)
 * frequency: 'once' | 'daily' | 'weekly' | 'monthly'
 * durationMonths: number (3|6|12)
 *
 * returns array of "YYYY-MM-DD" strings
 */
function generateRemindDates(startDate, frequency, duration_months = 6) {
  const reminders = [];
  const start = new Date(startDate);
  const endDate = new Date(start);
  endDate.setMonth(endDate.getMonth() + duration_months);

  let current = new Date(start);

  while (current <= endDate) {
    const formatted = current.toISOString().split("T")[0];
    reminders.push({date:formatted, concluse:false}); // salva uma cópia

    switch (frequency) {
      case "diario":
        current = new Date(current);
        current.setDate(current.getDate() + 1);
        break;
      case "semanal":
        current = new Date(current);
        current.setDate(current.getDate() + 7);
        break;
      case "mensal":
        current = new Date(current);
        current.setMonth(current.getMonth() + 1);
        break;
      default:
        current = new Date(current);
        current.setDate(current.getDate() + 1);
    }
  }

  return reminders;
}




  // --- Save / Update event ---
  const handleSaveEvent = async () => {
    if (!newEvent.title.trim()) return toast({ title: 'Digite o título para continuar.' });

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não encontrado');
      const userId = user.id;

      // Se não tiver form selecionado, cria novo
      let formId = selectedFormId;
      if (!formId && newEvent.save_form) {
        const { data, error } = await supabase.from('form_calendar_fields').insert([{
          user_id: userId,
          fields: newEvent.fields,
          name: newEvent.title
        }]).select().single();
        if (error) throw error;
        formId = data.id;
        setUserForms(prev => [...prev, data]);
        setSelectedFormId(formId);
      }

      
      // build the date string YYYY-MM-DD from currentYear/currentMonth/selectedDay
      const startDateISO = `${currentYear}-${pad(currentMonth + 1)}-${pad(selectedDay)}`;

      // generate remind_dates (array of YYYY-MM-DD) if reminder enabled
      const remindDates = newEvent.remind_me
        ? generateRemindDates(startDateISO, newEvent.remind_frequency, newEvent.remind_duration)
        : null; 
      
      
      const payload = {
        form_id: formId,
        title: newEvent.title,
        fields: newEvent.fields,
        priority: newEvent.priority,
        tags: newEvent.tags,
        day: selectedDay,
        month: currentMonth,
        year: currentYear,
        date: new Date(currentYear, currentMonth, selectedDay),
        remind_me: newEvent.remind_me,
        remind_time: newEvent.remind_time,
        remind_frequency: newEvent.remind_frequency,
        remind_dates: newEvent.remind_frequency != "unico" ? remindDates : [startDateISO],
        user_id: userId
      };
      
      
      if (newEvent.id) {
        const { error } = await supabase.from('form_calendar_entries').update(payload).eq('id', newEvent.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('form_calendar_entries').insert([payload]);
        if (error) throw error;
      }

      setNewEvent({ title: '', fields: [{ name: 'Campo', value: '' }], priority: 'normal', tags: '' });
      setSelectedDay(null);
      fetchEvents();
      toast({ title: 'Entrada salva', description: 'O formulário foi atualizado.' });
        

    } catch (err) {
      console.error('Erro ao salvar evento:', err.message || err);
      alert(`Erro ao salvar evento: ${err.message || err}`);
    }
  };

  // --- Edit / Delete event ---
  const handleEditEvent = (event) => {
    setSelectedDay(new Date(event.date).getDate());
    setSelectedFormId(event.form_id);
    setNewEvent({
      id: event.id,
      title: event.title,
      fields: event.fields || [{ name: 'Campo', value: '' }],
      priority: event.priority || 'normal',
      tags: event.tags || []
    });
  };
  const handleDeleteEvent = async (id) => {
    await supabase.from('form_calendar_entries').delete().eq('id', id);
    fetchEvents();
  };

  const getEventsForDay = (day) => {
  return events.filter(e => {
    const eventDate = new Date(e.date);

    return (
      eventDate.getUTCDate() === day &&
      eventDate.getUTCMonth() === currentMonth &&
      eventDate.getUTCFullYear() === currentYear &&
      (tagFilter ? e.tags?.includes(tagFilter) : true)
    );
  });
};
const [viewDay, setViewDay] = useState()
const [selectedViewEvent,setSelectedViewEvent] = useState()

const isPastDay = (day) => {
  if (!day) return true;
  const today = new Date();
  const date = new Date(currentYear, currentMonth, day);
  return date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
};

const handleDeleteForm = async (formId) => {
  try {
    // Remove o vínculo dos eventos com esse formulário
    const { error: updateError } = await supabase
      .from("form_calendar_entries")
      .update({ form_id: null })
      .eq("form_id", formId);

    if (updateError) throw updateError;

    // Agora apaga só o formulário
    const { error: deleteError } = await supabase
      .from("form_calendar_fields")
      .delete()
      .eq("id", formId);

    if (deleteError) throw deleteError;

    // Atualiza estado local
    setUserForms((prev) => prev.filter((f) => f.id !== formId));

    // Se estava selecionado, limpa
    if (selectedFormId === formId) {
      setSelectedFormId("");
    }

    fetchEvents();
  } catch (err) {
    console.error("Erro ao deletar formulário:", err.message);
  }
};


const [openDropdown, setOpenDropdown] = useState(false);
const [selectPage, setSelectPage] = useState("Atividades")



  return (
    <div>
      <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setSelectPage("Atividades")}
            className={`px-4 py-2 rounded-t-lg font-medium text-sm sm:text-base transition ${
              selectPage === "Atividades"
                ? "bg-purple-600 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Atividades
          </button>

          <button
            onClick={() => setSelectPage("Calendario")}
            className={`px-4 py-2 rounded-t-lg font-medium text-sm sm:text-base transition ${
              selectPage === "Calendario"
                ? "bg-purple-600 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Calendario
          </button>
        </div>


      {selectPage === "Calendario" ?
      <div className="p-4 max-w-6xl mx-auto space-y-6">
        {/* Header / Navigation */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl shadow-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Navegação de Mês */}
        <div className="flex items-center gap-3">
      <button
        onClick={handlePrevMonth}
        className="p-2 rounded-full bg-white shadow hover:bg-blue-50 transition"
      >
        <ChevronLeft className="w-5 h-5 text-gray-700" />
      </button>
      <button
        onClick={handleNextMonth}
        className="p-2 rounded-full bg-white shadow hover:bg-blue-50 transition"
      >
        <ChevronRight className="w-5 h-5 text-gray-700" />
      </button>
        </div>
      
        {/* Título central */}
        <div className="flex flex-col items-center text-center">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
        {months[currentMonth]} {currentYear}
      </h2>
      <span className="text-xs sm:text-sm text-gray-500 mt-1">
        Visualização mensal • {events.length} itens
      </span>
        </div>
      
        {/* Filtros */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full sm:w-auto justify-center">
      {/* Select de Formulários */}
      <div className="relative inline-block w-full">
        <button
      className="w-full flex justify-between items-center bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none min-w-[150px]"
      onClick={() => setOpenDropdown((prev) => !prev)}
        >
      {selectedFormId
        ? userForms.find((f) => f.id === selectedFormId)?.name
        : "Criar novo formulário"}
      <ChevronDown className="w-4 h-4 ml-2 text-gray-500" />
        </button>
      
        {openDropdown && (
      <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
        <div
          className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-600 "
          onClick={() => {
            setSelectedFormId("");
            setOpenDropdown(false);
          }}
        >
          ➕ Criar novo formulário
        </div>
        {userForms.map((f) => (
          <div
            key={f.id}
            className="flex justify-between items-center px-3 py-2 hover:bg-gray-50 text-sm text-gray-800"
          >
            <span
              className="cursor-pointer flex-1"
              onClick={() => {
                setSelectedFormId(f.id);
                setOpenDropdown(false);
              }}
            >
              {f.name}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation(); // evita abrir select
                handleDeleteForm(f.id);
              }}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
        )}
      </div>
      {/* Select de Mês */}
      <select
        value={currentMonth}
        onChange={(e) => setCurrentMonth(Number(e.target.value))}
        className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
      >
        {months.map((m, i) => (
          <option key={i} value={i}>
            {m}
          </option>
        ))}
      </select>
      {/* Select de Ano */}
      <select
        value={currentYear}
        onChange={(e) => setCurrentYear(Number(e.target.value))}
        className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
      >
        {Array.from({ length: 21 }, (_, i) => currentYear - 10 + i).map(
          (year) => (
            <option key={year} value={year}>
              {year}
            </option>
          )
        )}
      </select>
        </div>
      </div>
        {/* Week Header */}
        <div className="grid grid-cols-7 text-center font-medium border-b">
          {daysOfWeek.map(day => <div key={day} className="p-2">{day}</div>)}
        </div>
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {calendarCells.map((day, idx) => (
            <div
              key={idx}
              onClick={() => {
        if (!day) return;
      
        if (isPastDay(day)) {
      setViewDay(day); // modal só de visualização
        } else {
      setSelectedDay(day);
      if (selectedFormId) {
        // pega o formulário correto
        const selectedForm = userForms.find(f => f.id === selectedFormId);
        if (selectedForm && selectedForm.fields?.length) {
          // mantém os valores predefinidos
          const formFields = selectedForm.fields.map(f => ({ ...f }));
          setNewEvent({
            title: selectedForm.name || "",
            fields: formFields,
            priority: 'normal',
            tags: []
          });
        } else {
          // se não tiver campos
          setNewEvent({
            title: '',
            fields: [{ name: 'Campo', value: '' }],
            priority: 'normal',
            tags: []
          });
        }
      } else {
        // novo formulário sem pré-definição
        setNewEvent({
          title: '',
          fields: [{ name: 'Nota', value: '' }],
          priority: 'normal',
          tags: []
        });
      }
        }
      }}
              className={`h-28 bg-white p-2 text-sm relative ${day ? "hover:bg-blue-50 cursor-pointer" : "bg-gray-50"}`}
            >
              {day && <><span className="absolute top-1 left-1 text-gray-600 text-xs">{day}</span>
                <div className="mt-5 space-y-1">
                  {getEventsForDay(day).map((event, i) => (
                    <div key={i} className="flex items-center gap-1">
                      <span className={`text-xs px-1 py-0.5 rounded ${event.priority === 'high' ? 'bg-red-200 text-red-800' : event.priority === 'medium' ? 'bg-yellow-200 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                        {event.priority}
                      </span>
                      <span onClick={() => handleEditEvent(event)} className="truncate cursor-pointer">{event.title}</span>
                      <button onClick={() => handleDeleteEvent(event.id)}>
                        <Trash2 className="w-3 h-3 text-gray-500 hover:text-black"/>
                      </button>
                    </div>
                  ))}
                </div>
              </>}
            </div>
          ))}
        </div>
       {/* Modal */}
      {selectedDay && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 backdrop-blur-sm p-4">
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 relative border border-gray-100">
      
      {/* Botão fechar */}
      <button
        onClick={() => setSelectedDay(null)}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
      >
        ✕
      </button>

      {/* Título */}
      <input
        type="text"
        placeholder="Título do evento"
        value={newEvent.title}
        onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
        className="w-full text-xl font-semibold border-b border-gray-300 pb-2 focus:ring-2 focus:ring-blue-300 outline-none transition placeholder-gray-400"
      />

      {/* Salvar Formulário */}
      <div className="flex items-center gap-2 mt-4">
        <input
          type="checkbox"
          checked={newEvent.save_form}
          onChange={(e) => setNewEvent({ ...newEvent, save_form: e.target.checked })}
          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-300"
        />
        <label className="text-sm text-gray-700">Salvar Formulário</label>
      </div>

      {/* Data */}
      <div className="flex justify-between items-center text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg mt-4">
        <span className="font-medium">Data</span>
        <span className="text-gray-800">{selectedDay}/{currentMonth + 1}/{currentYear}</span>
      </div>

      {/* Campos dinâmicos */}
      <div className="mt-6 space-y-3">
        {newEvent.fields.map((field, index) => (
          <div key={index} className="flex flex-col sm:flex-row items-center gap-2 bg-gray-50 p-2 rounded-lg shadow-sm">
            <input
              type="text"
              value={field.name}
              onChange={(e) => handleFieldChange(index, "name", e.target.value)}
              className="flex-1 border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none"
              placeholder="Nome do campo"
            />
            <span className="hidden sm:inline">:</span>
            <input
              type="text"
              value={field.value}
              onChange={(e) => handleFieldChange(index, "value", e.target.value)}
              className="flex-1 border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none"
              placeholder="Descrição"
            />
            {newEvent.fields.length > 1 && (
              <button
                onClick={() => handleDeleteField(index)}
                className="mt-2 sm:mt-0 px-2 py-1 text-sm text-red-500 hover:bg-red-100 rounded-lg transition"
              >
                ✕
              </button>
            )}
          </div>
        ))}
        <button
          onClick={handleAddField}
          className="w-full py-2 text-sm rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition font-medium"
        >
          + Adicionar campo
        </button>
      </div>

      {/* Prioridade */}
      <div className="mt-6">
        <label className="text-sm font-medium text-gray-600">Prioridade</label>
        <select
          value={newEvent.priority || ""}
          onChange={(e) => setNewEvent(prev => ({ ...prev, priority: e.target.value }))}
          className="w-full mt-2 border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
        >
          <option value="" disabled>Selecione...</option>
          <option value="alta" className="text-red-600">🔴 Alta</option>
          <option value="media" className="text-yellow-600">🟡 Média</option>
          <option value="baixa" className="text-green-600">🟢 Baixa</option>
        </select>
      </div>

      {/* Tags */}
      <div className="mt-6">
        <label className="text-sm font-medium text-gray-600">Tags</label>
        <div className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            checked={outer}
            onChange={() => {
              setOuter(!outer);
              setNewEvent({ ...newEvent, tag: '' });
            }}
            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-300"
          />
          <label className="text-sm text-gray-700">Outro</label>
        </div>
        <select
          value={newEvent.tags || ""}
          disabled={outer}
          onChange={(e) => setNewEvent(prev => ({ ...prev, tags: e.target.value }))}
          className="w-full mt-2 border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
        >
          <option value="" disabled>Selecione...</option>
          <option value="trabalho">Trabalho</option>
          <option value="reunião">Reunião</option>
        </select>
        {outer && (
          <input
            type="text"
            className="w-full mt-2 border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="Tag personalizada"
            onChange={(e) => setNewEvent({ ...newEvent, tag: e.target.value })}
          />
        )}
      </div>

      {/* Lembrar-me */}
      <div className="mt-4 flex items-center gap-2">
        <input
          type="checkbox"
          checked={newEvent.remind_me || false}
          onChange={(e) => setNewEvent({ ...newEvent, remind_me: e.target.checked })}
          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-300"
        />
        <label className="text-sm text-gray-700">Lembrar-me</label>
      </div>

      {newEvent.remind_me && (
        <div className="mt-3 space-y-3">
          <div>
            <label className="text-xs text-gray-500 block">Horário</label>
            <select
              value={newEvent.remind_time || ""}
              onChange={(e) => setNewEvent({ ...newEvent, remind_time: e.target.value })}
              className="w-full mt-2 border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option value="" disabled>Selecione um horário</option>
              {Array.from({ length: 24 }, (_, i) => {
                const hour = i.toString().padStart(2, "0") + ":00";
                return <option key={hour} value={hour}>{hour}</option>;
              })}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 block">Frequência</label>
            <select
              value={newEvent.remind_frequency || ""}
              onChange={(e) => setNewEvent({ ...newEvent, remind_frequency: e.target.value })}
              className="w-full mt-2 border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option value="" disabled>Selecione</option>
              <option value="unico">Único</option>
              <option value="diario">Diário</option>
              <option value="semanal">Semanal</option>
              <option value="mensal">Mensal</option>
            </select>
          </div>
          {newEvent.remind_frequency !== "unico" && (
            <div>
              <label className="text-xs text-gray-500 block">Duração (meses)</label>
              <input
                type="number"
                min="1"
                value={newEvent.remind_duration || 1}
                onChange={(e) => setNewEvent({ ...newEvent, remind_duration: parseInt(e.target.value, 10) })}
                className="w-full p-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
          )}
        </div>
      )}

      {/* Botão Salvar */}
      <div className="flex justify-end mt-6">
        <button
          onClick={handleSaveEvent}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow transition"
        >
          Salvar
        </button>
      </div>

    </div>
  </div>
)}

      {/* Modal de visualização */}
      {viewDay && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-[450px] max-h-[80vh] overflow-y-auto p-6 relative border border-gray-100">
        {/* Botão fechar */}
        <button
          onClick={() => setViewDay(null)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          ✕
        </button>
        {/* Título */}
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          Eventos de {viewDay}/{currentMonth + 1}/{currentYear}
        </h2>
        {/* Select de eventos */}
        {getEventsForDay(viewDay).length > 0 ? (
          <select
            onChange={(e) => setSelectedViewEvent(getEventsForDay(viewDay)[e.target.value])}
            className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none"
          >
            {getEventsForDay(viewDay).map((event, i) => (
              <option key={event.id} value={i}>
                {event.title || "Sem título"} — {event.priority}
              </option>
            ))}
          </select>
        ) : (
          <p className="text-sm text-gray-500">Nenhum evento neste dia</p>
        )}
        {/* Detalhes do evento selecionado */}
        {selectedViewEvent && (
          <div className="mt-4 space-y-2">
            <p className="text-sm"><strong>Prioridade:</strong> {selectedViewEvent.priority}</p>
            {selectedViewEvent.fields?.map((f, i) => (
              <div key={i} className="text-sm">
                <span className="font-medium">{f.name}:</span> {f.value}
              </div>
            ))}
            {selectedViewEvent.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedViewEvent.tags.map((tag, i) => (
                  <span key={i} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
        </div>
      )}
      </div> : selectPage =='Atividades' &&
      <div>
        <CalendarEntries/>
      </div>}
    </div>
  );
};

export default CalendarNotionStyle;
