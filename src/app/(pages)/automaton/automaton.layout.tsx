"use client";

import { Draggable } from "@/components/draggable";
import { Link } from "@/components/link";
import { Screen } from "@/components/screen";

export const AutomatonLayout = () => {
  return (
    <Screen>
      <Link
        href="/"
        text="Voltar para a página inicial"
        className="!w-60 mb-5"
      />
      <Draggable>
        <div className="bg-amber-600 rounded-full w-10 h-10 cursor-pointer handle" />
      </Draggable>
    </Screen>
  );
};
