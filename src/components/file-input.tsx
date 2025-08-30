import React from "react";
import { Button } from "./button";

interface FileInputProps {
  accept?: string;
  className?: string;
  label?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function FileInput({
  accept,
  className = "",
  label,
  onChange,
}: FileInputProps) {
  const id = React.useId();
  return (
    <div className="flex flex-col gap-0.5">
      <Button
        onClick={() => document.getElementById(id)?.click()}
        text={label || ""}
        className={className}
      >
        <input
          id={id}
          type="file"
          accept={accept}
          onChange={onChange}
          className={`hidden ${className}`}
        />
      </Button>
    </div>
  );
}
