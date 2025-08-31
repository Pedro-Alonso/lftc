import { useState } from "react";
import { IAutomatonNode, IAutomatonPage } from "./automaton.types";

const AUTOMATON_SIZE = 40; // 40px (w-10 h-10)

const calculateRelativePosition = (
  event: React.MouseEvent,
  container: HTMLElement
): { x: number; y: number } => {
  const containerRect = container.getBoundingClientRect();
  return {
    x: event.clientX - containerRect.left,
    y: event.clientY - containerRect.top,
  };
};

const generateAutomatonId = (): string => {
  return `automaton-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const shouldIgnoreClick = (target: HTMLElement): boolean => {
  return !!(target.closest(".handle") || target.closest(".react-draggable"));
};

export const useAutomaton = (): IAutomatonPage => {
  const [automatons, setAutomatons] = useState<IAutomatonNode[]>([]);
  const [isAddAutomatonToggled, setIsAddAutomatonToggled] = useState(false);

  const onAddAutomaton = (e: React.MouseEvent) => {
    if (!isAddAutomatonToggled) return;

    e.stopPropagation();

    const target = e.target as HTMLElement;
    if (shouldIgnoreClick(target)) return;

    const container = e.currentTarget as HTMLElement;
    const clickPosition = calculateRelativePosition(e, container);

    const centeredPosition = {
      x: clickPosition.x - AUTOMATON_SIZE / 2,
      y: clickPosition.y - AUTOMATON_SIZE / 2,
    };

    const newAutomaton: IAutomatonNode = {
      id: generateAutomatonId(),
      position: centeredPosition,
    };

    setAutomatons((prev) => [...prev, newAutomaton]);
  };

  return {
    automatons,
    isAddAutomatonToggled,
    onAddAutomaton,
    onClearAutomatons: () => setAutomatons([]),
    onToggleAddAutomaton: () => setIsAddAutomatonToggled((prev) => !prev),
  };
};
