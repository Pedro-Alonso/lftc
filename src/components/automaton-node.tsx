"use client";

import { Draggable } from "@/components/draggable";
import { IAutomatonNode } from "../app/(pages)/automaton/automaton.types";

interface AutomatonNodeProps {
  automaton: IAutomatonNode;
}

export const AutomatonNode = ({ automaton }: AutomatonNodeProps) => {
  return (
    <div
      key={automaton.id}
      style={{
        position: "absolute",
        left: automaton.position.x,
        top: automaton.position.y,
        pointerEvents: "auto",
      }}
    >
      <Draggable>
        <div className="bg-amber-600 rounded-full w-10 h-10 cursor-pointer handle" />
      </Draggable>
    </div>
  );
};
