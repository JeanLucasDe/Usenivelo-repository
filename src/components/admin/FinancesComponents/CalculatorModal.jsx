import React, { useState, useEffect, useRef } from "react";

export default function CalculatorModal({
  open,
  onClose,
  onConfirm,
  initialValue = ""
}) {
  const [expression, setExpression] = useState(initialValue || "");
  const [preview, setPreview] = useState("");
  const modalRef = useRef(null);

  // Fecha ao clicar fora
  useEffect(() => {
    function handleClickOutside(e) {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    }

    if (open) document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Atualiza preview automático
  useEffect(() => {
    try {
      if (!expression.trim()) {
        setPreview("");
        return;
      }
      const safe = expression.replace(/[^-()\d/*+.]/g, "");
      const result = Function(`"use strict"; return (${safe})`)();
      setPreview(result);
    } catch {
      setPreview("");
    }
  }, [expression]);

  const press = (val) => {
    setExpression((prev) => (prev === "0" ? val : prev + val));
  };

  const clear = () => setExpression("");
  const backspace = () => setExpression((prev) => prev.slice(0, -1));

  const invert = () => {
    if (!expression) return;
    try {
      const safe = expression.replace(/[^-()\d/*+.]/g, "");
      const result = Function(`"use strict"; return (${safe})`)();
      setExpression(String(-result));
    } catch {}
  };

  const confirm = () => {
    if (preview !== "" && !isNaN(preview)) {
      onConfirm(preview);
    }
    onClose();
  };

  // Permite digitar diretamente no display
  const handleInputChange = (e) => {
    let val = e.target.value;
    // Apenas números, ponto e operadores
    val = val.replace(/[^0-9+\-*/().]/g, "");
    setExpression(val);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 select-none">
      <div
        ref={modalRef}
        className="bg-neutral-900 text-white rounded-3xl p-6 w-[360px] shadow-xl"
      >
        {/* Visor */}
        <input
          value={expression}
          onChange={handleInputChange}
          className="bg-white text-black rounded-xl p-4 text-right mb-5 min-h-[80px] text-4xl font-semibold outline-none w-full"
          placeholder=""
        />
        <div className="text-right text-gray-500 text-xl mb-4">{preview}</div>

        {/* Botões */}
        <div className="grid grid-cols-4 gap-3">
          <Btn label="C" onClick={clear} className="bg-gray-400 text-black" />
          <Btn label="⌫" onClick={backspace} className="bg-gray-400 text-black" />
          <Btn label="+/-" onClick={invert} className="bg-gray-400 text-black" />
          <Btn label="/" onClick={() => press("/")} className="bg-orange-500" />

          <Btn label="(" onClick={() => press("(")} />
          <Btn label=")" onClick={() => press(")")} />
          <Btn label="%" onClick={() => press("/100")} />
          <Btn label="*" onClick={() => press("*")} className="bg-orange-500" />

          {[7, 8, 9].map((n) => (
            <Btn key={n} label={n} onClick={() => press(String(n))} />
          ))}
          <Btn label="-" onClick={() => press("-")} className="bg-orange-500" />

          {[4, 5, 6].map((n) => (
            <Btn key={n} label={n} onClick={() => press(String(n))} />
          ))}
          <Btn label="+" onClick={() => press("+")} className="bg-orange-500" />

          {[1, 2, 3].map((n) => (
            <Btn key={n} label={n} onClick={() => press(String(n))} />
          ))}

          <Btn label="OK" onClick={confirm} className="bg-green-500 col-span-1" />
          <Btn label="0" onClick={() => press("0")} className="col-span-2" />
          <Btn label="." onClick={() => press(".")} />
        </div>
      </div>
    </div>
  );
}

function Btn({ label, onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`h-14 rounded-2xl bg-neutral-700 text-white text-xl active:scale-95 transition ${className}`}
    >
      {label}
    </button>
  );
}
