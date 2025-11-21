import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/customSupabaseClient";

export default function TransactionAIChat({ fetchTransactions }) {
  const [chatInput, setChatInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAddTransaction = async () => {
    if (!chatInput.trim()) return;
    setIsProcessing(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const res = await fetch("/api/parseTransaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: chatInput }),
      });

      let parsedTx = {};
      try {
        parsedTx = await res.json();
      } catch (e) {
        console.error("Erro ao interpretar JSON da API:", e);
        parsedTx = {};
      }

      const newTransaction = {
        user_id: user.id,
        tipo: parsedTx.tipo || "saida",
        descricao: parsedTx.descricao || chatInput,
        valor: parsedTx.valor || 0,
        categoria: parsedTx.categoria || null,
        data: parsedTx.data || new Date().toISOString(),
        fixa: parsedTx.fixa || false,
        parcelas_detalhes: parsedTx.parcelas_detalhes || [],
      };

      await supabase.from("transactions").insert([newTransaction]);
      fetchTransactions();
      setChatInput("");

    } catch (err) {
      console.error("Erro ao adicionar transação:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex items-center gap-2 mt-4">
      <input
        type="text"
        placeholder="Ex: comprei um sorvete de 4 reais"
        value={chatInput}
        onChange={(e) => setChatInput(e.target.value)}
        className="flex-1 p-2 border rounded"
      />
      <Button onClick={handleAddTransaction} disabled={isProcessing}>
        {isProcessing ? "Processando..." : "Adicionar"}
      </Button>
    </div>
  );
}
