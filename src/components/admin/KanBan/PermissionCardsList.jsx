import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/customSupabaseClient";
import { Button } from "@/components/ui/button";
import { Eye, Plus } from "lucide-react";
import { useParams } from "react-router-dom";

export default function PermissionCardsList() {
  const { kanban_id } = useParams();
  const [submodules, setSubmodules] = useState([]);
  const [submodulesConfig, setSubmodulesConfig] = useState([]);
  const [users, setUsers] = useState([]);
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [showSelectUserId, setShowSelectUserId] = useState(null);
  const [selectedSubmodule, setSelectedSubmodule] = useState({});
  const [loading, setLoading] = useState(true)

  // Fetch usuários, submodules e configs
  const fetchUsersAndPerms = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();

      const { data: stepsData } = await supabase
        .from("kanban_steps")
        .select("*")
        .eq("kanban_id", kanban_id);

      const { data: perms } = await supabase
        .from("kanban_steps_permissions")
        .select("*")
        .in("step_id", stepsData.map((s) => s.id));

      const { data: usersData } = await supabase
        .from("users")
        .select("*")
        .in("id", perms.map((p) => p.user_id));

      const { data: mods } = await supabase
        .from("modules")
        .select("*")
        .eq("type", "Customizado")
        .eq('user_id',userData.user?.id)

      const { data: submods } = await supabase
        .from("submodules")
        .select("*")
        .in("module_id", mods.map((m) => m.id))

      const { data: submodsconfig } = await supabase
        .from("user_permissions_kanban")
        .select("*")
        .eq("kanban_id", kanban_id);

      setSubmodules(submods || []);
      setSubmodulesConfig(submodsconfig || []);
      setUsers(usersData || []);
      setLoading(false)
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsersAndPerms();
  }, []);

  // Adicionar submodule ao usuário
  const addSubmoduleToUser = async (userId) => {
    const submoduleId = selectedSubmodule[userId];
    if (!submoduleId) return;

    await supabase.from("user_permissions_kanban").insert([
      { kanban_id, user_id: userId, submodule_id: submoduleId },
    ]);

    setSelectedSubmodule((prev) => ({ ...prev, [userId]: null }));
    setShowSelectUserId(null);
    fetchUsersAndPerms();
  };

  // Map de submodules por usuário
  const usuariosComSubmodules = users.map((user) => {
    const configsDoUsuario = submodulesConfig.filter(
      (conf) => conf.user_id === user.id
    );

    const submodulesDoUsuario = configsDoUsuario.map((conf) => {
      const sub = submodules.find((s) => s.id === conf.submodule_id);
      return { ...conf, submodule_name: sub?.name ?? "Sem nome" };
    });

    return { ...user, submodules: submodulesDoUsuario };
  });

  const removeSubmoduleFromUser = async (configId) => {
    await supabase
      .from("user_permissions_kanban")
      .delete()
      .eq("id", configId);

    fetchUsersAndPerms(); // atualiza a lista
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-b-4 border-gray-200"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {usuariosComSubmodules.map((user) => {
        // Submodules disponíveis ainda não adicionados
        const submodulesDisponiveis = submodules.filter(
          (sm) => !user.submodules.some((us) => us.submodule_id === sm.id)
        );

        return (
          <div
            key={user.id}
            className="border p-4 rounded-lg shadow space-y-3 hover:shadow-md transition"
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="font-bold text-gray-800">{user.full_name}</div>
                <div className="text-sm text-gray-500">{user.email}</div>
              </div>

              <div className="flex gap-2">
                {/* Botão adicionar submodule */}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setShowSelectUserId(
                      showSelectUserId === user.id ? null : user.id
                    )
                  }
                >
                  <Plus />
                </Button>

                {/* Botão ver submodules */}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    setExpandedUserId(
                      expandedUserId === user.id ? null : user.id
                    )
                  }
                >
                  <Eye/>
                </Button>
              </div>
            </div>

            {/* Select para adicionar submodule */}
            {showSelectUserId === user.id && (
              <div className="flex gap-2 mt-2 items-center">
                <select
                  value={selectedSubmodule[user.id] || ""}
                  onChange={(e) =>
                    setSelectedSubmodule((prev) => ({
                      ...prev,
                      [user.id]: e.target.value,
                    }))
                  }
                  className="border rounded px-2 py-1 focus:ring focus:ring-blue-300"
                >
                  <option value="">Selecionar submodule</option>
                  {submodulesDisponiveis.map((sm) => (
                    <option key={sm.id} value={sm.id}>
                      {sm.name}
                    </option>
                  ))}
                </select>
                <Button onClick={() => addSubmoduleToUser(user.id)}>Adicionar</Button>
              </div>
            )}

            {/* Lista de submodules do usuário */}
            {expandedUserId === user.id && (
              <div className="mt-2 space-y-1">
                {user.submodules.length > 0 ? (
                  user.submodules.map((sub) => (
                    <div
                      key={sub.id}
                      className="bg-gray-50 rounded px-2 py-1 text-gray-700 hover:bg-gray-100 transition flex justify-between items-center"
                    >
                      <span>{sub.submodule_name}</span>

                      <button
                        onClick={() => removeSubmoduleFromUser(sub.id)}
                        className="text-red-500 hover:text-red-700 text-sm font-semibold px-2"
                      >
                        Remover
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400 italic">Nenhum submodule</p>
                )}
              </div>
            )}

          </div>
        );
      })}
    </div>
  );
}
