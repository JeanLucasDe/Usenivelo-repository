import { useEffect, useState } from "react";
import { supabase } from "@/lib/customSupabaseClient";

const UseResetStatusMensal = (transactions) => {
  const [lastMonthChecked, setLastMonthChecked] = useState(new Date().getMonth());

  useEffect(() => {
      const today = new Date();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();
  
      // Só roda se o mês mudou
      if (currentMonth !== lastMonthChecked) {
        const resetStatusMes = async () => {
          try {
            const transacoesParaAtualizar = transactions.filter(transacao => {
              const transacaoDate = new Date(transacao.data);
              return (
                transacaoDate.getMonth() === currentMonth &&
                transacaoDate.getFullYear() === currentYear &&
                transacao.status !== "pendente"
              );
            });
  
            for (const t of transacoesParaAtualizar) {
              await supabase
                .from("transactions")
                .update({ status: "pendente" })
                .eq("id", t.id);
            }
  
            setLastMonthChecked(currentMonth); // atualiza o mês verificado
          } catch (err) {
            console.error("Erro ao resetar status mensal:", err.message);
          }
        };
  
        resetStatusMes();
    }
  }, []);
};

export default UseResetStatusMensal;
