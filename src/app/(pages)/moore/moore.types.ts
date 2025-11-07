export interface StateNode {
  id: string;
  position: {
    x: number;
    y: number;
  };
  label: string;
  isInitial: boolean;
  isFinal: boolean;
  output : string;
}

export interface Connection {
  id: string;
  sourceId: string;
  targetId: string;
  label: string;
}

export interface Automaton {
  states: StateNode[];
  connections: Connection[];
}

export interface IAutomatonPage {
  automaton: Automaton;
  mode: "addState" | "addConnection" | "move" | "delete";
  selectedStateId: string | null;
  word: string;
  testResult: {
    accepted: boolean;
    message: string;
  } | null;
  statusMessage: string | null;
  onAddState: (x: number, y: number) => void;
  onSelectState: (stateId: string) => void;
  onDeleteState: (stateId: string) => void;
  onAddConnection: (sourceId: string, targetId: string, symbol: string) => void;
  onSetInitial: (stateId: string) => void;
  onToggleFinal: (stateId: string) => void;
  onChangeMode: (
    newMode: "addState" | "addConnection" | "move" | "delete"
  ) => void;
  onChangeWord: (newWord: string) => void;
  onTestWord: () => void;
  onClearAutomaton: () => void;
  onSaveAutomaton: () => void;
  onLoadAutomaton: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleOrSetStateOutput: (stateId: string, outputValue: string) => void;
}

declare global {
  interface Window {
    jsPlumb: {
      getInstance: (options: { Container: HTMLElement }) => JsPlumbInstance;
    };
  }
}

export interface JsPlumbDragOptions {
  containment?: HTMLElement;
  stop?: (event: JsPlumbDragEvent) => void;
}

export interface JsPlumbDragEvent {
  el: HTMLElement;
}

export interface JsPlumbSourceOptions {
  filter: string;
  anchor: string;
  connectorStyle: { stroke: string; strokeWidth: number };
  maxConnections: number;
}

export interface JsPlumbTargetOptions {
  dropOptions: { hoverClass: string };
  anchor: string;
  allowLoopback: boolean;
}

export interface JsPlumbConnectionOptions {
  source: HTMLElement | null;
  target: HTMLElement | null;
  connector: Array<string | object>;
  overlays: Array<Array<string | object>>;
}

export interface JsPlumbInstance {
  importDefaults: (defaults: JsPlumbDefaults) => void;
  reset: () => void;
  batch: (callback: () => void) => void;
  draggable: (el: HTMLElement, options: JsPlumbDragOptions) => void;
  makeSource: (el: HTMLElement, options: JsPlumbSourceOptions) => void;
  makeTarget: (el: HTMLElement, options: JsPlumbTargetOptions) => void;
  connect: (options: JsPlumbConnectionOptions) => void;
}

export interface JsPlumbDefaults {
  Connector: Array<string | object>;
  Endpoint: string;
  EndpointStyle: { fill: string };
  PaintStyle: { stroke: string; strokeWidth: number };
  HoverPaintStyle: { stroke: string; strokeWidth: number };
  ConnectionOverlays: Array<Array<string | object>>;
}
