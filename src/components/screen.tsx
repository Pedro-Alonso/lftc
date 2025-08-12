import React from "react";

interface Props {
  children: React.ReactNode;
}

export const Screen = ({ children }: Props) => {
  return (
    <div className="flex flex-col justify-center items-center p-5">
      {children}
    </div>
  );
};
