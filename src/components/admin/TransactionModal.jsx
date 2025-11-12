import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/customSupabaseClient";
import { useToast } from "@/components/ui/use-toast";
import { X } from "lucide-react";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const TransactionModal = ({ isOpen, onClose, fetchTransactions, form_data,fetchTransactionsOrigin }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [parcelasDetalhadas, setParcelasDetalhadas] = useState([]);
  const [form, setForm] = useState({
    name: "",
    descricao: "",
    tipo: "entrada",
    categoria: "",
    valor: "",
    parcelas: 1,
    data: "",
    metodo: "Pix",
    fixa: false,
  });

  // 🔄 Atualiza o form caso receba dados externos
  useEffect(() => {
    if (form_data) {
      setForm((prev) => ({
        ...prev,
        ...form_data,
      }));

      if (form_data.parcelas_detalhes) {
        setParcelasDetalhadas(form_data.parcelas_detalhes);
      } else {
        const valor = Number(form_data.valor) || 0;
        const parcelas = Number(form_data.parcelas) || 1;
        const startDate = form_data.data ? new Date(form_data.data) : new Date();
        const isFixa = form_data.fixa || false;

        const geradas = Array.from({ length: isFixa ? 1 : parcelas }, (_, i) => {
          const d = new Date(startDate);
          if (!isFixa) d.setMonth(d.getMonth() + i);
          return {
            numero: i + 1,
            data: d.toISOString().split("T")[0],
            valor: valor.toFixed(2),
            status: "pendente",
          };
        });

        setParcelasDetalhadas(geradas);
      }
    }
  }, [form_data]);

  // ✅ Atualiza o estado corretamente para todos inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleStatusChange = async (idx, checked) => {
    try {
      const updated = [...parcelasDetalhadas];
      updated[idx].status = checked ? "pago" : "pendente";
      setParcelasDetalhadas(updated);

      if (form_data?.id) {
        const { error } = await supabase
          .from("transactions")
          .update({ parcelas_detalhes: updated })
          .eq("id", form_data.id);
        if (error) throw error;
      }
    } catch (err) {
      console.error("Erro ao atualizar status:", err.message);
    }
  };

  const formatCurrency = (n) =>
    n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const categoriasSugestoes = [
    "Alimentação",
    "Transporte",
    "Salário",
    "Educação",
    "Lazer",
    "Saúde",
    "Contas Fixas",
    "Investimentos",
    "Serviços",
    "Outros",
  ];

  const filteredCategorias = categoriasSugestoes.filter((c) =>
    c.toLowerCase().includes(form.categoria?.toLowerCase() || "")
  );

  const handleSaveTransaction = async (novaTransacao) => {
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Erro",
          description: "Usuário não autenticado!",
          variant: "destructive",
        });
        return;
      }

      // ✅ Verificação dos campos obrigatórios
      if (!novaTransacao.name || !novaTransacao.descricao || !novaTransacao.valor) {
        toast({
          title: "Campos obrigatórios",
          description: "Preencha o name, descrição e valor.",
          variant: "destructive",
        });
        return;
      }

      const valor = Number(novaTransacao.valor);
      const isFixa = novaTransacao.fixa || false;
      const parcelas = isFixa ? 1 : Number(novaTransacao.parcelas) || 1;
      const total = valor * parcelas;

      const parcelasGeradas = Array.from({ length: parcelas }, (_, i) => {
        const data = new Date(novaTransacao.data || new Date());
        if (!isFixa) data.setMonth(data.getMonth() + i);
        return {
          numero: i + 1,
          valor,
          data: data.toISOString().split("T")[0],
          status: "pendente",
        };
      });

      const transacaoCompleta = {
        user_id: user.id,
        name: novaTransacao.name,
        descricao: novaTransacao.descricao,
        tipo: novaTransacao.tipo,
        metodo: novaTransacao.metodo,
        valor,
        parcelas,
        total,
        categoria: novaTransacao.categoria,
        data: novaTransacao.data || new Date().toISOString().split("T")[0],
        fixa: isFixa,
        parcelas_detalhes: parcelasGeradas,
        created_at: novaTransacao.created_at || new Date().toISOString(),
      };

      let data, error;
      if (novaTransacao.id) {
        ({ data, error } = await supabase
          .from("transactions")
          .update(transacaoCompleta)
          .eq("id", novaTransacao.id)
          .select());
      } else {
        ({ data, error } = await supabase
          .from("transactions")
          .insert([transacaoCompleta])
          .select());
      }

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: novaTransacao.id
          ? "Movimentação atualizada com sucesso!"
          : "Movimentação salva com sucesso!",
      });

      fetchTransactions();
      fetchTransactionsOrigin();
       setForm({})
      onClose();
    } catch (error) {
      console.error("Erro ao salvar transação:", error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar a movimentação.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const valor = Number(form.valor) || 0;
  const parcelas = Number(form.parcelas) || 1;
  const total = (valor * parcelas).toFixed(2);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl overflow-y-auto max-h-[90vh]"
        
      >
        <div className="p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
        >
          {/* Cabeçalho */}
          <div className="flex justify-between items-center border-b pb-3">
            <h2 className="text-xl font-semibold text-gray-800">
              {form.id ? "Editar Movimentação" : "Nova Movimentação"}
            </h2>
            <X className="cursor-pointer" onClick={onClose} />
          </div>

          {/* name e Descrição */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Nome</Label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Ex: Salário de Outubro"
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>

            <div>
              <Label>Descrição</Label>
              <input
                type="text"
                name="descricao"
                value={form.descricao}
                onChange={handleChange}
                placeholder="Descrição detalhada"
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>
          </div>

          {/* Tipo e Método */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Tipo</Label>
              <Select
                value={form.tipo}
                onValueChange={(value) =>
                  handleChange({ target: { name: "tipo", value } })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entrada">Entrada</SelectItem>
                  <SelectItem value="saida">Saída</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Método de Pagamento</Label>
              <Select
                value={form.metodo}
                onValueChange={(value) =>
                  handleChange({ target: { name: "metodo", value } })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o método" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pix">Pix</SelectItem>
                  <SelectItem value="Cartão Crédito">Cartão Crédito</SelectItem>
                  <SelectItem value="Cartão Débito">Cartão Débito</SelectItem>
                  <SelectItem value="Boleto">Boleto</SelectItem>
                  <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Categoria */}
          <div>
            <Label>Categoria</Label>
            <input
              type="text"
              name="categoria"
              value={form.categoria}
              onChange={handleChange}
              placeholder="Ex: Alimentação, Transporte..."
              className="w-full border border-gray-300 rounded-lg p-2"
            />
          </div>

          {/* Valor e Parcelas */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Valor</Label>
              <input
                type="number"
                name="valor"
                value={form.valor}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>

            <div>
              <Label>Parcelas</Label>
              <input
                type="number"
                name="parcelas"
                value={form.parcelas}
                disabled={form.fixa}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>
          </div>

          {/* Data */}
          <div>
            <Label>Data</Label>
            <input
              type="date"
              name="data"
              value={form.data}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2"
            />
          </div>

          {/* Checkbox Fixa */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="fixa"
              checked={form.fixa}
              onChange={handleChange}
            />
            <Label>Movimentação Fixa</Label>
          </div>

          {/* Total */}
          <p className="text-right text-gray-700">
            💰 Total: <span className="font-semibold">{formatCurrency(total)}</span>
          </p>

          {/* Botões */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            {form.id && (
              <button
                onClick={async () => {
                  if (!form.id) return;
                  if (!confirm("Deseja realmente deletar esta transação?"))
                    return;
                  const { error } = await supabase
                    .from("transactions")
                    .delete()
                    .eq("id", form.id);
                  if (error) {
                    toast({
                      title: "Erro ao deletar",
                      description: error.message,
                      variant: "destructive",
                    });
                    return;
                  }
                  toast({
                    title: "Transação deletada",
                    description: "Removida com sucesso.",
                  });
                  fetchTransactions();
                  fetchTransactionsOrigin();
                  onClose();
                }}
                className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-500"
              >
                Deletar
              </button>
            )}

            <button
              disabled={loading}
              onClick={(e) => {
                e.preventDefault();
                handleSaveTransaction(form);
              }}
              className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-500"
            >
              {loading ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;
