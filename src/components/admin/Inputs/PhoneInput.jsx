import { useState } from "react";
import InputMask from "react-input-mask";

export default function PhoneInput({ value, onChange, label, required }) {
  const [phone, setPhone] = useState(value || "");

  const handleChange = (e) => {
    const val = e.target.value;
    setPhone(val);
    onChange?.(val);
  };

  return (
    <div className="flex flex-col mb-4 w-full">
      <label className="text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <InputMask
        mask="(99) 99999-9999"
        value={phone}
        onChange={handleChange}
        placeholder="(00) 00000-0000"
      >
        {(inputProps) => (
          <input
            {...inputProps}
            type="tel"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        )}
      </InputMask>
    </div>
  );
}
