import { useState } from "react";

export  function Switch({ checked = false, onChange }) {
  const [isOn, setIsOn] = useState(checked);

  const toggle = () => {
    const newValue = !isOn;
    setIsOn(newValue);
    onChange?.(newValue);
  };

  return (
    <button
      onClick={toggle}
      className={`relative w-12 h-7 rounded-full transition-colors duration-300 ease-in-out
        ${isOn ? "bg-indigo-600" : "bg-gray-300"}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 ease-in-out
          ${isOn ? "translate-x-5" : "translate-x-0"}`}
      ></span>
    </button>
  );
}
