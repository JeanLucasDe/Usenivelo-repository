import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function PixCopyCard({ pixCode,title }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pixCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Erro ao copiar", err);
    }
  };

  return (
    <div className=" bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center">
        <h2 className="text-gray-800 dark:text-gray-100 font-semibold text-lg">{title}</h2>
      </div>

      <p className="mt-3 text-gray-700 dark:text-gray-200 break-all font-mono text-sm">
        {pixCode}
      </p>
    <button
        onClick={handleCopy}
        className="flex items-center gap-1 p-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded transition mt-4"
    >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        {copied ? "Copiado!" : "Copiar"}
    </button>
    </div>
  );
}
