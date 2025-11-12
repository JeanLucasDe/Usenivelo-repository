import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/customSupabaseClient";
import { Calendar, ChevronDown, ChevronUp, MoreVertical } from "lucide-react";

const CalendarEntries = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filterView, setFilterView] = useState("day"); // day | week | month
  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState("");

  // 🔹 Buscar dados do banco
  const fetchEntries = async () => {

    const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          console.error("Usuário não autenticado:", userError);
          return;
        }
    setLoading(true);
    const { data, error } = await supabase
    .from("form_calendar_entries")
    .select("*")
    .eq("user_id", user.id)
    .order('date', { ascending: true });
    ;
    if (error) {
      console.error("Erro ao buscar entradas:", error.message);
      setLoading(false);
      return;
    }
    setEntries(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  // 🔹 Filtro por HOJE, SEMANA, MÊS
  const filterEntries = () => {
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    return entries.filter((entry) => {
      const entryDate = new Date(entry.date);

      if (search) {
        const inSearch = Object.values(entry).some(
          (val) =>
            val &&
            val.toString().toLowerCase().includes(search.toLowerCase())
        );
        if (!inSearch) return false;
      }

      switch (filterView) {
        case "day":
          return entry.date === todayStr;
        case "week":
          return entryDate >= startOfWeek && entryDate <= endOfWeek;
        case "month":
          return (
            entryDate.getMonth() === now.getMonth() &&
            entryDate.getFullYear() === now.getFullYear()
          );
        case "custom":
          return filterDate && entry.date === filterDate;
        default:
          return true;
      }
    });
};

const [openReminds, setOpenReminds] = useState({});
  const toggleConcluded = async (entryId, remindIndex, current) => {
  const target = entries.find((e) => e.id === entryId);
  const newRemindDates = [...target.remind_dates];
  newRemindDates[remindIndex].concluded = !current;

  const { error } = await supabase
    .from("form_calendar_entries")
    .update({ remind_dates: newRemindDates })
    .eq("id", entryId);

  if (!error) {
    setEntries((prev) =>
      prev.map((e) =>
        e.id === entryId ? { ...e, remind_dates: newRemindDates } : e
      )
    );
  }
};




  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">📅 Entradas de Calendário</h1>

      {/* Filtros */}
      <div className="mb-6 border-b border-gray-200 pb-2 flex flex-wrap gap-3 items-center">
        <button
          onClick={() => setFilterView("day")}
          className={`pb-1 px-3 ${
            filterView === "day"
              ? "text-purple-600 border-b-2 border-purple-500"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Hoje
        </button>
        <button
          onClick={() => setFilterView("week")}
          className={`pb-1 px-3 ${
            filterView === "week"
              ? "text-purple-600 border-b-2 border-purple-500"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Semana
        </button>
        <button
          onClick={() => setFilterView("month")}
          className={`pb-1 px-3 ${
            filterView === "month"
              ? "text-purple-600 border-b-2 border-purple-500"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Mês
        </button>

        <input
          type="date"
          value={filterDate}
          onChange={(e) => {
            setFilterDate(e.target.value);
            setFilterView("custom");
          }}
          className="px-2 py-1 border rounded text-sm"
        />

        <input
          type="text"
          placeholder="🔍 Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-1 border rounded text-sm flex-1"
        />
      </div>

      {loading ? (
        <p className="text-gray-500">Carregando...</p>
      ) : (
        <div className="space-y-4">
            <div className="relative flex flex-col">
            {/* Linha vertical da timeline */}
            {!filterEntries().length === 0 &&<div className="absolute left-16 top-0 bottom-0 w-0.5 bg-gray-200"></div>}

            <div className="space-y-6">
              {filterEntries().length === 0 ? 
              <div className="flex flex-col items-center justify-center py-12 text-gray-500 space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <Calendar />
            </div>
            <p className="text-sm sm:text-base font-medium">Ainda não há agendamentos</p>
          </div>:
              filterEntries().map((entry) => (
                <div key={entry.id} className="flex items-start gap-6 relative">
                  {/* Hora + ponto da timeline */}
                  <div className="flex flex-col items-center w-16 text-right">
                    <p className="text-xs font-medium text-gray-500">
                      {entry.remind_time || "--:--"}
                    </p>
                    <div
                      className={`w-4 h-4 rounded-full border-2 shadow mt-1 ${
                        entry.recurring
                          ? "bg-purple-500 border-purple-600"
                          : entry.concluded
                          ? "bg-green-500 border-green-600"
                          : "bg-red-500 border-red-600"
                      }`}
                    ></div>
                  </div>

                  {/* Card do evento */}
                  <div className="flex-1 p-4 bg-white rounded-xl shadow hover:shadow-md transition">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {entry.title || "Sem título"}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {entry.date} {entry.time && `• ${entry.time}`}
                        </p>
                      </div>
                      <MoreVertical className="text-gray-400 hover:text-purple-600 cursor-pointer" />
                    </div>

                    {entry.description && (
                      <p className="text-sm text-gray-600 mt-2">{entry.description}</p>
                    )}

                    {/* Toggle de remind_dates */}
                    {entry.remind_dates?.length > 0 && (
                      <div className="mt-3">
                        <button
                          onClick={() =>
                            setOpenReminds((prev) => ({
                              ...prev,
                              [entry.id]: !prev[entry.id],
                            }))
                          }
                          className="flex items-center gap-1 text-sm text-purple-600 font-medium hover:underline"
                        >
                          {openReminds?.[entry.id] ? (
                            <>
                              <ChevronUp size={16} /> Fechar lembretes
                            </>
                          ) : (
                            <>
                              <ChevronDown size={16} /> Ver lembretes
                            </>
                          )}
                        </button>

                        {openReminds?.[entry.id] && (
                          <div className="mt-2 max-h-40 overflow-y-auto border rounded-lg bg-gray-50">
                            {entry.remind_dates.map((r, i) => (
                              <div
                                key={i}
                                className="flex items-center justify-between text-sm px-3 py-2 border-b last:border-0"
                              >
                                <span>{r.date}</span>
                                <button
                                  onClick={() => toggleConcluded(entry.id, i, r.concluded)}
                                  className={`px-2 py-0.5 rounded text-xs font-medium ${
                                    r.concluded
                                      ? "bg-green-100 text-green-600 hover:bg-green-200"
                                      : "bg-red-100 text-red-600 hover:bg-red-200"
                                  }`}
                                >
                                  {r.concluded ? "Concluído" : "Pendente"}
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>




        </div>



        )}
    </div>
  );
};

export default CalendarEntries;
