import { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";

export default function FileInput({ field, value, onChange }) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(value || "");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (value && !previewUrl) setPreviewUrl(value);
  }, [value]);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (selectedFile.size > 10 * 1024 * 1024) {
      setErrorMsg("Arquivo excede o limite de 10 MB.");
      e.target.value = "";
      return;
    }

    setErrorMsg("");
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));

    // ⚠️ Não faz upload ainda — só guarda o arquivo
    onChange(selectedFile);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreviewUrl("");
    onChange(""); // limpa no pai
  };

  const isImage =
    typeof previewUrl === "string" &&
    (previewUrl.endsWith(".jpg") ||
      previewUrl.endsWith(".jpeg") ||
      previewUrl.endsWith(".png") ||
      previewUrl.endsWith(".gif") ||
      previewUrl.startsWith("data:image"));

  return (
    <div className="flex flex-col border border-gray-300 py-3  mt-3 hover:bg-gray-50 transition w-full col-span-2 bg-white p-2 shadow-sm rounded-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
        <span className="text-sm text-gray-900 mb-2 sm:mb-0">
          {field.name}{" "}
          {field.required && <span className="text-red-500">*</span>}
        </span>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {previewUrl ? (
            <div className="flex items-center justify-between w-full sm:w-auto">
              <a
                href={previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 text-xs underline truncate max-w-[80%]"
              >
                Ver arquivo
              </a>
              <button
                onClick={handleRemoveFile}
                className="text-xs text-red-600 hover:underline ml-2"
              >
                Remover
              </button>
            </div>
          ) : (
            <>
              <input
                type="file"
                accept="*/*"
                onChange={handleFileSelect}
                className="hidden"
                id={`file-${field.name}`}
              />
              <label
                htmlFor={`file-${field.name}`}
                className="w-full sm:w-auto text-center px-3 py-2 text-xs bg-blue-100 rounded-md border border-blue-300 hover:bg-gray-200 transition cursor-pointer flex justify-center items-center gap-1"
              >
                Selecionar arquivo
              </label>
            </>
          )}
        </div>
      </div>

      {previewUrl && isImage && (
        <img
          src={previewUrl}
          alt="preview"
          className="w-full sm:w-32 h-32 object-cover rounded-md border border-gray-200 shadow-sm mt-3"
        />
      )}

      {errorMsg && (
        <div className="flex items-center gap-1 text-red-600 text-xs mt-2">
          <AlertCircle size={12} />
          {errorMsg}
        </div>
      )}
    </div>
  );
}
