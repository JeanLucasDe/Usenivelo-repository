// RecordCreatorRelations.jsx
import { useState } from "react";
import {useToast} from '@/components/ui/use-toast'

export function RecordRelationField({ field, relatedRecords, formData, setFormData }) {
  const selectedForField = formData[field.id] || [];
  const {toast} = useToast()
  const [searchQuery, setSearchQuery] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Verifica se existe defaultValue em alguma relatedConfig
  const defaultConfig = field.relatedConfigs?.find(rc => rc.defaultValue);

  const hasPriceField =
    field.relatedConfigs?.[0]?.fieldNames?.some(fn =>
      ["preço", "valor", "total"].some(keyword =>
        fn.toLowerCase().includes(keyword)
      )
    ) || false;

  // Adiciona item selecionado (default ou da busca)
  const handleAddItem = (rec) => {
    const current = selectedForField.filter(i => i.recordId !== rec.id);
    const newItem = { recordId: rec.id, quantity, data: rec.data };

    setSearchQuery("");
    setFormData(prev => ({
      ...prev,
      [field.id]: [...current, newItem],
      [field.name]: [...(prev[field.name] || []), newItem],
    }));
  };

  // Copiar defaultValue para o form
  const handleCopyDefault = () => {
    if (!defaultConfig) return;
    const submoduleRecords = relatedRecords?.[field.id]?.[defaultConfig.submodule] || [];
    const rec = submoduleRecords.find(r =>
      defaultConfig.fieldNames.map(f => r.data[f]).join(" - ") === defaultConfig.defaultValue
    );
    if (rec) {
      const newItem = { recordId: rec.id, quantity: 1, data: rec.data };
      setFormData(prev => ({
        ...prev,
        [field.id]: [newItem],
        [field.name]: [newItem],
      }));
       toast({
        title: "Copiado",
        description: "Copiado com Sucesso!",
      });
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-3 space-y-4 shadow-md w-full">
  {/* Label do campo */}
  <label className="font-semibold text-gray-800 text-base">{field.name}</label>

  {defaultConfig ? (
    // Mostra apenas default value
    <div className="flex justify-between items-center p-3 border border-gray-200 rounded-lg bg-gray-50">
  <input
    type="text"
    value={defaultConfig.defaultValue}
    readOnly
    className=" px-2 py-1 border border-gray-300 rounded-lg text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-green-500 "
  />
  <button
    className="text-green-600 text-sm px-3 py-1 border border-green-600 rounded-lg hover:bg-green-50 transition"
    onClick={handleCopyDefault}
  >
    Copiar
  </button>
</div>

  ) : (
    <>
      {/* Campo de busca + quantidade */}
      <div className="flex items-center gap-4 mt-2">
        <input
          type="text"
          placeholder="Buscar por nome ou ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />

        <input
          type="number"
          value={quantity}
          min={1}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-20 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition"
        />
      </div>

      {/* Lista de resultados filtrados */}
      {searchQuery.trim() !== "" &&
      Array.isArray(field.relatedConfigs) &&
      field.relatedConfigs.length > 0 ? (
        field.relatedConfigs.map((rc, idx) => {
          const records = relatedRecords?.[field.id]?.[rc.submodule] ?? [];
          const filtered = records.filter((rec) => {
            if (!rec?.data) return false;
            const searchableValues = Object.values(rec.data)
              .filter((v) => typeof v === "string" || typeof v === "number")
              .map((v) => String(v).toLowerCase());
            return (
              searchableValues.some((v) => v.includes(searchQuery.toLowerCase())) ||
              rec.id.toLowerCase().includes(searchQuery.toLowerCase())
            );
          });

          if (filtered.length === 0)
            return (
              <p key={idx} className="text-sm text-gray-400">
                Nenhum item encontrado em {rc.moduleName || "Módulo"} / {rc.submoduleName || "Submódulo"}
              </p>
            );

          return (
            <div key={idx} className="mb-4">
              <span className="text-sm text-gray-500 font-medium">
                {rc.moduleName || "Módulo"} / {rc.submoduleName || "Submódulo"}
              </span>

              <div className="max-h-52 overflow-y-auto mt-2 border border-gray-200 rounded-lg p-2 space-y-2 bg-white shadow-sm">
                {filtered.map((rec) => {
                  const nameKey = Object.keys(rec.data || {}).find((k) =>
                    ["nome", "name", "titulo", "descrição"].some((n) => k.toLowerCase().includes(n))
                  );
                  const displayName = nameKey ? rec.data[nameKey] : `Registro #${rec.id.slice(0, 6)}`;

                  const priceKey = Object.keys(rec.data || {}).find((k) =>
                    ["preço", "valor", "total", "price", "amount"].some((n) => k.toLowerCase().includes(n))
                  );
                  const displayPrice = priceKey ? Number(rec.data[priceKey]) : null;

                  return (
                    <div
                      key={rec.id}
                      className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50 transition cursor-pointer"
                    >
                      <div className="flex flex-col">
                        <span className="text-gray-800 font-medium truncate">{displayName}</span>
                        {displayPrice && (
                          <span className="text-green-600 text-sm font-semibold">R$ {displayPrice.toFixed(2)}</span>
                        )}
                      </div>

                      {/* Botão de adicionar com quantidade dentro */}
                      <button
                        className={`flex items-center gap-2 px-3 py-1 text-sm font-medium rounded-lg transition border ${
                          quantity
                            ? "text-green-600 border-green-600 hover:bg-green-50"
                            : "text-gray-300 border-gray-200 cursor-not-allowed"
                        }`}
                        disabled={!quantity}
                        onClick={() => handleAddItem(rec)}
                      >
                        + Adicionar
                        {quantity > 0 && (
                          <span className="bg-green-600 text-white rounded-full px-2 py-0.5 text-xs font-semibold">
                            {quantity}
                          </span>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })
      ) : (
        searchQuery.trim() !== "" && (
          <p className="text-sm text-gray-400">Carregando relações...</p>
        )
      )}

      {/* Itens selecionados */}
      {selectedForField.map((item, idx) => {
        const priceField = field.relatedConfigs?.[0]?.fieldNames?.find((fn) =>
          ["preço", "valor"].some((keyword) => fn.toLowerCase().includes(keyword))
        );
        const price = item.data?.[priceField] ?? 0;
        const subtotal = price * item.quantity;

        const nameKey = Object.keys(item.data || {}).find((k) =>
          ["nome", "name", "titulo", "descrição", "placa"].some((n) => k.toLowerCase().includes(n))
        );
        const displayName = nameKey ? item.data[nameKey] : `Registro #${item.recordId}`;

        return (
          <div
            key={item.recordId + idx}
            className="flex justify-between items-center p-3 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition"
          >
            <div className="flex flex-col">
              <span className="font-medium text-gray-800">{displayName}</span>
              {hasPriceField && (
                <span className="text-xs text-gray-500">
                  Preço: R$ {price.toFixed(2)} | Subtotal: R$ {subtotal.toFixed(2)}
                </span>
              )}
            </div>
            <button
              className="text-red-600 font-bold hover:text-red-800 transition"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  [field.id]: prev[field.id].filter((_, i) => i !== idx),
                  [field.name]: prev[field.name].filter((_, i) => i !== idx),
                }))
              }
            >
              ❌
            </button>
          </div>
        );
      })}
    </>
  )}
</div>


  );
}
