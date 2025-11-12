import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/customSupabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from "@/components/ui/select";

export default function PermissionsTab() {
  const [users, setUsers] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addMode, setAddMode] = useState(false);
  const [newPermission, setNewPermission] = useState({ userId: "", role: "" });
  const [confirmDelete, setConfirmDelete] = useState(null);

  // 🔹 Carrega usuários e permissões do banco
  useEffect(() => {
    fetchUsers();
    fetchPermissions();
  }, []);

  const fetchUsers = async () => {
    const { data, error } = await supabase.from("users").select("*");
    if (!error) setUsers(data);
  };

  const fetchPermissions = async () => {
    const { data, error } = await supabase.from("permissions").select("*");
    if (!error) setPermissions(data);
  };

  // 🔹 Adiciona novo registro na tabela "permissions"
  const handleAddPermission = async () => {
    if (!newPermission.userId || !newPermission.role) return alert("Preencha todos os campos.");
    setLoading(true);

    // valida se user existe
    const userExists = users.find((u) => u.id === newPermission.userId);
    if (!userExists) {
      alert("Usuário não encontrado.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("permissions").insert([
      {
        user_id: newPermission.userId,
        role: newPermission.role,
      },
    ]);

    if (error) alert("Erro ao adicionar permissão: " + error.message);

    else {
      await fetchPermissions();
      setAddMode(false);
      setNewPermission({ userId: "", role: "" });
    }
    setLoading(false);
  };

  // 🔹 Edita função
  const handleEditRole = async (permId, role) => {
    const { error } = await supabase.from("permissions").update({ role }).eq("id", permId);
    if (!error) fetchPermissions();
  };

  // 🔹 Apagar permissão com modal
  const handleDeletePermission = async () => {
    if (!confirmDelete) return;
    const { error } = await supabase.from("permissions").delete().eq("id", confirmDelete.id);
    if (!error) {
      setPermissions(permissions.filter((p) => p.id !== confirmDelete.id));
      setConfirmDelete(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-4"
    >
      <p className="text-sm text-neutral-600 dark:text-neutral-400">
        Gerencie quem tem acesso e o que pode fazer dentro da sua empresa.
      </p>

      {/* LISTA DE PERMISSÕES */}
      <div className="border rounded-lg p-4 space-y-3">
        {permissions.length === 0 && (
          <p className="text-sm text-neutral-500">Nenhuma permissão adicionada ainda.</p>
        )}

        {permissions.map((perm) => {
          const user = users.find((u) => u.id === perm.user_id)
          return (
            <div
              key={perm.id}
              className="flex justify-between items-center border-b pb-2 last:border-b-0"
            >
              <div>
                <p className="font-medium">{user?.email || "Usuário não encontrado"}</p>
                <p className="text-sm text-neutral-500">{perm.role}</p>
              </div>

              <div className="flex gap-2">
                <Select
                  defaultValue={perm.role}
                  onValueChange={(value) => handleEditRole(perm.id, value)}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Função" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="destructive"
                  onClick={() => setConfirmDelete(perm)}
                >
                  Apagar
                </Button>
              </div>
            </div>
          );
        })}
      </div>
      {/* BOTÃO ADICIONAR */}
      {!addMode ? (
        <Button
          disabled={loading}
          className="w-full mt-2"
          onClick={() => setAddMode(true)}
        >
          {loading ? <Loader2 className="animate-spin mr-2" /> : "Adicionar"}
        </Button>
      ) : (
        <div className="space-y-3 border rounded-lg p-4">
          <Input
            type="text"
            placeholder="ID do usuário"
            value={newPermission.userId}
            onChange={(e) =>
              setNewPermission({ ...newPermission, userId: e.target.value })
            }
          />

          <Select
            onValueChange={(v) => setNewPermission({ ...newPermission, role: v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma função" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="editor">Editor</SelectItem>
              <SelectItem value="viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setAddMode(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddPermission} disabled={loading}>
              {loading ? <Loader2 className="animate-spin mr-2" /> : "Salvar"}
            </Button>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMAÇÃO */}
      <Dialog open={!!confirmDelete} onOpenChange={() => setConfirmDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-neutral-600">
            Tem certeza que deseja remover a permissão de{" "}
            <strong>
              {users.find((u) => u.id === confirmDelete?.userId)?.name || "usuário"}
            </strong>
            ?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeletePermission}>
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
