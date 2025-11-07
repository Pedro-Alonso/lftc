"use client";

import { useCallback, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Automaton,
  Connection,
  IAutomatonPage,
  StateNode,
} from "./moore.types";

const STATE_SIZE = 50;

export const useAutomaton = (): IAutomatonPage => {
  const [automaton, setAutomaton] = useState<Automaton>({
    states: [],
    connections: [],
  });
  const [mode, setMode] = useState<
    "addState" | "addConnection" | "move" | "delete"
  >("addState");
  const [selectedStateId, setSelectedStateId] = useState<string | null>(null);
  const [word, setWord] = useState<string>("");
  const [testResult, setTestResult] = useState<{
    accepted: boolean;
    message: string;
  } | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const onAddState = useCallback(
    (x: number, y: number) => {
      const newState: StateNode = {
        id: `state-${uuidv4()}`,
        position: {
          x: x - STATE_SIZE / 2,
          y: y - STATE_SIZE / 2,
        },
        label: String(automaton.states.length),
        isInitial: automaton.states.length === 0,
        isFinal: false,
        output : ""
      };

      setAutomaton((prev) => ({
        ...prev,
        states: [...prev.states, newState],
      }));
    },
    [automaton.states.length]
  );

  const onDeleteState = useCallback((stateId: string) => {
    setAutomaton((prev) => ({
      states: prev.states.filter((state) => state.id !== stateId),
      connections: prev.connections.filter(
        (conn) => conn.sourceId !== stateId && conn.targetId !== stateId
      ),
    }));
  }, []);
  const onAddConnection = useCallback(
    (sourceId: string, targetId: string, symbol: string) => {
      console.log(
        `onAddConnection chamado. De: ${sourceId}, Para: ${targetId}, Símbolo: ${symbol}`
      );

      setAutomaton((prev) => {
        const existingConnection = prev.connections.find(
          (conn) => conn.sourceId === sourceId && conn.targetId === targetId
        );

        if (existingConnection) {
          console.log(`Conexão existente encontrada: ${existingConnection.id}`);
          const currentSymbols = existingConnection.label.split("|");
          if (!currentSymbols.includes(symbol)) {
            console.log(`Adicionando símbolo ${symbol} à conexão existente`);
            const newLabel = [...currentSymbols, symbol].join("|");
            return {
              ...prev,
              connections: prev.connections.map((conn) =>
                conn.id === existingConnection.id
                  ? { ...conn, label: newLabel }
                  : conn
              ),
            };
          }
          console.log(
            `Símbolo ${symbol} já existe na conexão, não foi adicionado`
          );
          return prev;
        } else {
          console.log(`Criando nova conexão: ${sourceId} -> ${targetId}`);
          const newConnection: Connection = {
            id: `connection-${uuidv4()}`,
            sourceId,
            targetId,
            label: symbol,
          };

          return {
            ...prev,
            connections: [...prev.connections, newConnection],
          };
        }
      });

      console.log("Conexão adicionada/atualizada com sucesso");
    },
    []
  );

  const onSelectState = useCallback(
    (stateId: string) => {
      console.log(
        `onSelectState chamado. Mode: ${mode}, Estado: ${stateId}, Estado selecionado anteriormente: ${selectedStateId}`
      );

      if (mode === "addConnection") {
        if (!selectedStateId) {
          setSelectedStateId(stateId);
          setStatusMessage(
            "Estado de origem selecionado. Clique em qualquer estado (inclusive este mesmo) para adicionar uma transição."
          );
        } else {
          const sourceId = selectedStateId;
          const targetId = stateId;

          const symbol = prompt("Digite o símbolo da transição:");

          if (symbol && symbol.trim() !== "") {
            onAddConnection(sourceId, targetId, symbol);
            setStatusMessage(
              `Transição adicionada: ${sourceId} --(${symbol})--> ${targetId}`
            );

            setStatusMessage(
              `Transição adicionada com símbolo "${symbol}". Pode continuar adicionando mais transições a partir do mesmo estado de origem ou clicar em "Adicionar Transição" para selecionar um novo estado de origem.`
            );
            setStatusMessage(
              `Transição adicionada com símbolo "${symbol}". Pode continuar adicionando mais transições a partir do mesmo estado de origem ou clicar em "Adicionar Transição" para selecionar um novo estado de origem.`
            );
          } else {
            // Cancelou ou símbolo inválido
            setStatusMessage(
              "Operação cancelada ou símbolo inválido. Clique em outro estado para tentar novamente."
            );
          }
        }
      } else if (mode === "delete") {
        // Modo de exclusão de estados
        onDeleteState(stateId);
        setStatusMessage(`Estado ${stateId} excluído`);
        setSelectedStateId(null);
      }
    },
    [mode, selectedStateId, onAddConnection, onDeleteState]
  );

  const onSetInitial = useCallback((stateId: string) => {
    setAutomaton((prev) => ({
      ...prev,
      states: prev.states.map((state) => ({
        ...state,
        isInitial: state.id === stateId,
      })),
    }));
  }, []);
  const onToggleFinal = useCallback((stateId: string) => {
    setAutomaton((prev) => ({
      ...prev,
      states: prev.states.map((state) =>
        state.id === stateId ? { ...state, isFinal: !state.isFinal } : state
      ),
    }));
  }, []);

  const onChangeMode = useCallback(
    (newMode: "addState" | "addConnection" | "move" | "delete") => {
      // Se estamos saindo do modo de adição de conexão e temos um estado selecionado,
      // resetamos o estado selecionado para limpar completamente o estado da interface
      if (mode === "addConnection" && selectedStateId !== null) {
        setSelectedStateId(null);
      }

      setMode(newMode);

      // Sempre reseta o estado selecionado ao mudar de modo
      setSelectedStateId(null);

      // Mostrar instruções conforme o modo selecionado
      if (newMode === "addState") {
        setStatusMessage(
          "Clique na área do autômato para adicionar um novo estado."
        );
      } else if (newMode === "addConnection") {
        setStatusMessage(
          "Clique em um estado para selecioná-lo como origem da transição."
        );
      } else if (newMode === "move") {
        setStatusMessage("Clique e arraste os estados para movê-los.");
      } else if (newMode === "delete") {
        setStatusMessage(
          "Clique em um estado para excluí-lo e todas as suas transições."
        );
      }
    },
    [mode, selectedStateId, setStatusMessage]
  );

  const onChangeWord = useCallback((newWord: string) => {
    setWord(newWord);
    setTestResult(null);
  }, []);

  const onTestWord = useCallback(() => {
    const initialState = automaton.states.find((state) => state.isInitial);
    if (!initialState) {
      setTestResult({ accepted: false, message: "Defina um estado inicial!" });
      return;
    }

    let currentStateId = initialState.id;
    const outputs: string[] = [];
    // Em Moore, primeiro vem o output do estado inicial (antes de ler qualquer símbolo)
    outputs.push(initialState.output ?? "");

    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      let found = false;

      // Encontrar uma conexão do currentStateId com símbolo char
      for (const connection of automaton.connections) {
        if (connection.sourceId === currentStateId) {
          const symbols = connection.label.split("|");
          if (symbols.includes(char)) {
            currentStateId = connection.targetId;
            const st = automaton.states.find(s => s.id === currentStateId);
            outputs.push(st?.output ?? "");
            found = true;
            break;
          }
        }
      }

      if (!found) {
        setTestResult({
          accepted: false,
          message: `Rejeitada: Não há transição do estado para o símbolo '${char}'! Saída parcial: ${outputs.join(", ")}`
        });
        return;
      }
    }

    // Aqui você tem a sequência de outputs (length = word.length + 1)
    // Se quiser manter aceitação por estados finais:
    const finalState = automaton.states.find(s => s.id === currentStateId);
    const accepted = !!finalState?.isFinal;
    setTestResult({
      accepted,
      message: `Outputs: [${outputs.join(" , ")}]${accepted ? " — Palavra aceita (estado final)." : " — Palavra rejeitada (estado final não é de aceitação)."}`
    });
  }, [automaton.connections, automaton.states, word]);

  const onClearAutomaton = useCallback(() => {
    setAutomaton({ states: [], connections: [] });
    setSelectedStateId(null);
    setTestResult(null);
    setWord("");
  }, []);
  const onSaveAutomaton = useCallback(() => {
    const json = JSON.stringify(automaton);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "automaton.json";
    a.click();

    URL.revokeObjectURL(url);
  }, [automaton]);

  const onLoadAutomaton = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result;
          if (typeof content === "string") {
            const parsedAutomaton = JSON.parse(content);
            setAutomaton(parsedAutomaton);
          }
        } catch (error) {
          console.error("Erro ao carregar o autômato:", error);
        }
      };
      reader.readAsText(file);
    },
    []
  );

  const onToggleOrSetStateOutput = useCallback((stateId: string, outputValue: string) => {
    setAutomaton(prev => ({
      ...prev,
      states: prev.states.map(s => s.id === stateId ? { ...s, output: outputValue } : s)
    }));
  }, []);

  return {
    automaton,
    mode,
    selectedStateId,
    word,
    testResult,
    statusMessage,
    onAddState,
    onSelectState,
    onDeleteState,
    onAddConnection,
    onSetInitial,
    onToggleFinal,
    onChangeMode,
    onChangeWord,
    onTestWord,
    onClearAutomaton,
    onSaveAutomaton,
    onLoadAutomaton,
    onToggleOrSetStateOutput
  };
};
