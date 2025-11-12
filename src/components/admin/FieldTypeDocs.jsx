export default function FieldTypeDocs({setShowDocs}) {
  return (
    <div className="w-full  bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-9">
      <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 ">Documentação de Tipos de Campo</h2>
          <button
          onClick={()=>setShowDocs(false)}
          className="border border-gray-200 text-2xl px-1"
          >X</button>
      </div>

       {/* Texto */}
      <div className="space-y-1">
        <label className="font-semibold underline text-gray-700 dark:text-gray-200">Texto</label>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          Campo de entrada de texto livre. Ideal para nomes ou descrições.
        </p>
        <input type="text" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="Ex: Nome do usuário" disabled />
      </div>

      {/* Número */}
      <div className="space-y-1">
        <label className="font-semibold underline text-gray-700 dark:text-gray-200">Número</label>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          Aceita apenas valores numéricos.
        </p>
        <input type="number" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="Ex: 42" disabled />
      </div>

      {/* Date */}
      <div className="space-y-1">
        <label className="font-semibold underline text-gray-700 dark:text-gray-200">Data</label>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          Campo para selecionar uma data.
        </p>
        <input type="date" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" disabled />
      </div>

      {/* Boolean */}
      <div className="space-y-1">
        <label className="font-semibold underline text-gray-700 dark:text-gray-200">Boolean</label>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          Campo de seleção verdadeiro/falso.
        </p>
        <input type="checkbox" disabled /> Exemplo
      </div>

      {/* Email */}
      <div className="space-y-1">
        <label className="font-semibold underline text-gray-700 dark:text-gray-200">Email</label>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          Campo para digitar e-mails válidos.
        </p>
        <input type="email" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="Ex: user@mail.com" disabled />
      </div>

      {/* Textarea */}
      <div className="space-y-1">
        <label className="font-semibold underline text-gray-700 dark:text-gray-200">Textarea</label>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          Campo de texto multi-linha.
        </p>
        <textarea className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" rows={3} placeholder="Ex: Digite sua mensagem" disabled></textarea>
      </div>

      {/* Link */}
      <div className="space-y-1">
        <label className="font-semibold underline text-gray-700 dark:text-gray-200">Link</label>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          Campo para inserir URLs.
        </p>
        <input type="url" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="Ex: https://exemplo.com" disabled />
      </div>

      {/* Etapas */}
      <div className="space-y-1">
        <label className="font-semibold underline text-gray-700 dark:text-gray-200">Etapas</label>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          Conjunto de subcampos organizados em etapas.
        </p>
        <fieldset className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 space-y-2">
          <legend className="px-2 text-gray-700 dark:text-gray-200 font-medium">Etapa 1</legend>
          <input type="text" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="Subcampo da etapa" disabled />
        </fieldset>
      </div>

      {/* Fórmula */}
      <div className="space-y-1">
        <label className="font-semibold underline text-gray-700 dark:text-gray-200">Fórmula</label>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          Campo que permite criar cálculos automáticos usando outros campos.
        </p>
        <input type="text" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="Ex: (Altura * Largura)/2" disabled />
      </div>

      {/* Select */}
      <div className="space-y-1">
        <label className="font-semibold underline text-gray-700 dark:text-gray-200">Select</label>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          Lista suspensa para selecionar uma opção entre várias.
        </p>
        <select className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" disabled>
          <option>Opção 1</option>
          <option>Opção 2</option>
          <option>Opção 3</option>
        </select>
      </div>
    </div>
  );
}
