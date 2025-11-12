import { useState } from "react";
import { supabase } from "@/lib/customSupabaseClient"; 

export default function AlertsWithInvoiceModal({ alerts, fetchTransactions }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);

  const openModal = (alert) => {
    setSelectedAlert(alert);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedAlert(null);
  };

  const handlePay = async () => {
  if (!selectedAlert) return;

  try {
    // 1️⃣ Buscar a transação no Supabase
    const { data: transactionData, error: fetchError } = await supabase
      .from("transactions")
      .select("id, parcelas_detalhes")
      .eq("id", selectedAlert.id)
      .single();

    if (fetchError || !transactionData) {
      console.error("Erro ao buscar transação:", fetchError);
      alert("Erro ao buscar a transação.");
      return;
    }

    const parcelas = transactionData.parcelas_detalhes || [];

    // 2️⃣ Atualizar apenas a parcela correspondente
    const updatedParcelas = parcelas.map((p) =>
      String(p.numero) === String(selectedAlert.parcelaNumero)
        ? { ...p, status: "pago" }
        : p
    );

    // 3️⃣ Verificação de segurança antes de salvar
    if (!Array.isArray(updatedParcelas) || updatedParcelas.length === 0) {
      console.error("parcelas_detalhes inválido:", updatedParcelas);
      alert("Erro interno: dados de parcelas inválidos.");
      return;
    }

    // 4️⃣ Atualizar no banco (com o array intacto)
    const { error: updateError } = await supabase
      .from("transactions")
      .update({ parcelas_detalhes: updatedParcelas })
      .eq("id", transactionData.id);

    if (updateError) {
      console.error("Erro ao atualizar parcela:", updateError);
      alert("Erro ao atualizar o status da parcela.");
      return;
    }

    // 5️⃣ Sucesso e refresh local
    alert(`✅ ${selectedAlert.title} foi marcada como paga!`);
    closeModal();
    fetchTransactions(); // atualiza os dados localmente

  } catch (err) {
    console.error("Erro no handlePay:", err);
    alert("Erro ao processar o pagamento.");
  }
};





  return (
    <>
      {/* Alertas */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Alertas
        </h3>
        <div className="space-y-4">
          {alerts.length > 0 ? (
            alerts.map((alert, index) => (
              <div
                key={index}
                className="flex items-center justify-between space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-12 h-12 ${alert.color} bg-opacity-15 rounded-xl flex items-center justify-center`}
                  >
                    <alert.icon className={`w-6 h-6 ${alert.color}`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {alert.title}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {alert.description}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => openModal(alert)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl shadow-md hover:from-blue-600 hover:to-blue-700 transition transform hover:-translate-y-0.5 hover:shadow-lg active:scale-95"
                >
                  Ver
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-600 dark:text-gray-400">
              Sem alertas no momento.
            </p>
          )}
        </div>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-lg p-8 relative animate-fadeIn">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              {selectedAlert?.title}
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
              {selectedAlert?.description}
            </p>

            <div className="mt-8 flex justify-end gap-4">
              <button
                onClick={closeModal}
                className="px-5 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white font-semibold rounded-2xl shadow-sm hover:bg-gray-400 dark:hover:bg-gray-500 hover:shadow-md transition transform hover:-translate-y-0.5 active:scale-95"
              >
                Fechar
              </button>
              <button
                onClick={handlePay}
                className="px-5 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-2xl shadow-md hover:from-green-600 hover:to-green-700 hover:shadow-lg transition transform hover:-translate-y-0.5 active:scale-95"
              >
                Pago
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
