import { useId } from "react";

export enum InputTypes {
  Text = "text",
  Regex = "regex",
}

interface InputProps<T extends string> {
  type: InputTypes;
  label?: string;
  value: T;
  className?: string;
  onChange: (value: T) => void;
}

export function Input<T extends string>({
  label,
  type,
  value,
  className = "",
  onChange,
}: InputProps<T>) {
  const id = `${label}-${useId()}`;
  return (
    <div className="flex flex-col gap-0.5">
      <label htmlFor={id}>{label}</label>
      <input
        name={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className={`bg-gray-200 border-2 rounded-sm p-0.5 ${className}`}
      />
    </div>
  );
}
