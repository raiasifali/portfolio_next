"use client";
import React from "react";

interface DateInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const DateInput: React.FC<DateInputProps> = ({
  label,
  name,
  value,
  onChange,
  required,
}) => {
  const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

  return (
    <div className="flex flex-col">
      <label className="font-semibold mb-1" htmlFor={name}>
        {label}
      </label>
      <input
        type="date"
        name={name}
        value={value}
        onChange={onChange}
        max={today}
        required={required}
        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
      />
    </div>
  );
};

export default DateInput;
