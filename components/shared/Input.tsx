import React, { ChangeEvent } from "react";

interface InputProps {
  placeholder: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  label: string;
  disabled?: boolean;
}

const Input = ({ placeholder, onChange, label, disabled }: InputProps) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-regular text-zinc-500">
        {label}:
      </label>
      <div className="mt-2">
        <input
          className="w-full px-3 py-2.5 text-gray-900 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent placeholder-gray-400"
          placeholder={placeholder}
          onChange={onChange}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default Input;
