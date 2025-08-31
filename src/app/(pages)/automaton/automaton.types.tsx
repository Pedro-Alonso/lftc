export interface IAutomatonNode {
  id: string;
  position: { x: number; y: number };
}

export interface IAutomatonPage {
  automatons: IAutomatonNode[];
  isAddAutomatonToggled: boolean;
  onAddAutomaton: (e: React.MouseEvent) => void;
  onClearAutomatons: () => void;
  onToggleAddAutomaton: () => void;
}
