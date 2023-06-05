import React from "react";
import { chains } from "../../constants";
import { Chain } from "../../types";

type SelectProps = {
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  label: string;
  disabled?: boolean;
};

const Select: React.FC<SelectProps> = ({ placeholder, onChange, label }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-regular text-zinc-500">
        {label}:
      </label>
      <div className="mt-2">
        <select
          onChange={onChange}
          className="w-full px-3 py-2.5 text-gray-900 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent"
        >
          <option value="">{placeholder}</option>
          {chains.map((chain: Chain) => (
            <option key={chain.name} value={chain.name}>
              {chain.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Select;
