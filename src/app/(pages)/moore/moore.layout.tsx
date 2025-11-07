"use client";

import { Button } from "@/components/button";
import { FileInput } from "@/components/file-input";
import { Input, InputTypes } from "@/components/input";
import { Link } from "@/components/link";
import { Screen } from "@/components/screen";
import { useEffect, useRef, useState } from "react";
import { IAutomatonPage, JsPlumbInstance } from "./moore.types";

export const AutomatonLayout = ({
  automaton,
  mode,
  selectedStateId,
  word,
  testResult,
  statusMessage,
  onAddState,
  onSelectState,
  onDeleteState,
  onSetInitial,
  onToggleFinal,
  onChangeMode,
  onChangeWord,
  onTestWord,
  onClearAutomaton,
  onSaveAutomaton,
  onLoadAutomaton,
  onToggleOrSetStateOutput,
}: IAutomatonPage) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const jsPlumbInstanceRef = useRef<JsPlumbInstance | null>(null);
  const [isRulesVisible, setIsRulesVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/jsplumb@2.15.0/dist/js/jsplumb.min.js";
    script.async = true;

    script.onload = () => {
      if (window.jsPlumb && containerRef.current) {
        const instance = window.jsPlumb.getInstance({
          Container: containerRef.current,
        });

        instance.importDefaults({
          Connector: ["Bezier", { curviness: 50 }],
          Endpoint: "Dot",
          EndpointStyle: { fill: "#456" },
          PaintStyle: { stroke: "#456", strokeWidth: 2 },
          HoverPaintStyle: { stroke: "#c61", strokeWidth: 3 },
          ConnectionOverlays: [["Arrow", { width: 10, length: 10, location: 1 }]],
        });

        jsPlumbInstanceRef.current = instance;
        renderAutomaton();
      }
    };

    document.body.appendChild(script);

    return () => {
      if (jsPlumbInstanceRef.current) jsPlumbInstanceRef.current.reset();
      if (document.body.contains(script)) document.body.removeChild(script);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    renderAutomaton();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [automaton, mode, selectedStateId]);

  const renderAutomaton = () => {
    if (!jsPlumbInstanceRef.current || !containerRef.current) return;

    const instance = jsPlumbInstanceRef.current;
    instance.reset();

    const container = containerRef.current;
    const existingStates = container.querySelectorAll(".state");
    existingStates.forEach((s) => container.removeChild(s));

    instance.batch(() => {
      automaton.states.forEach((state) => {
        let stateEl = document.getElementById(state.id) as HTMLElement | null;

        const upsertStateOutputBadge = (el: HTMLElement, outputValue: string | undefined) => {
          let badge = el.querySelector(".state-output") as HTMLElement | null;
          if (!badge) {
            badge = document.createElement("div");
            badge.className = "state-output";
            badge.style.position = "absolute";
            badge.style.right = "-8px";
            badge.style.top = "-8px";
            badge.style.padding = "2px 6px";
            badge.style.fontSize = "10px";
            badge.style.borderRadius = "8px";
            badge.style.background = "white";
            badge.style.color = "#333";
            badge.style.boxShadow = "0 1px 3px rgba(0,0,0,0.2)";
            badge.style.pointerEvents = "none";
            el.appendChild(badge);
          }
          badge.textContent = outputValue ?? "";
        };

        if (!stateEl) {
          stateEl = document.createElement("div");
          stateEl.id = state.id;
          stateEl.className = `state ${state.isInitial ? "initial" : ""} ${state.isFinal ? "final" : ""} ${selectedStateId === state.id ? "selected" : ""}`;
          stateEl.style.left = `${state.position.x}px`;
          stateEl.style.top = `${state.position.y}px`;
          stateEl.style.position = "absolute";
          stateEl.style.boxSizing = "border-box";

          const labelSpan = document.createElement("span");
          labelSpan.className = "state-label";
          labelSpan.textContent = state.label;
          stateEl.appendChild(labelSpan);

          stateEl.addEventListener("click", (e) => {
            e.stopPropagation();
            if (mode === "delete") {
              onDeleteState(state.id);
            } else {
              onSelectState(state.id);
            }
          });

          stateEl.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            const menu = document.createElement("div");
            menu.className = "context-menu";
            menu.style.position = "absolute";
            menu.style.left = `${e.pageX}px`;
            menu.style.top = `${e.pageY}px`;
            menu.style.backgroundColor = "white";
            menu.style.border = "1px solid #ccc";
            menu.style.borderRadius = "4px";
            menu.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.2)";
            menu.style.zIndex = "1000";

            const btnInitial = document.createElement("button");
            btnInitial.textContent = "Definir Inicial";
            btnInitial.style.display = "block";
            btnInitial.style.width = "100%";
            btnInitial.style.padding = "5px 10px";
            btnInitial.style.border = "none";
            btnInitial.style.background = "none";
            btnInitial.style.textAlign = "left";
            btnInitial.style.cursor = "pointer";
            btnInitial.addEventListener("mouseover", () => { btnInitial.style.backgroundColor = "#f0f0f0"; });
            btnInitial.addEventListener("mouseout", () => { btnInitial.style.backgroundColor = "transparent"; });
            btnInitial.addEventListener("click", () => {
              onSetInitial(state.id);
              if (document.body.contains(menu)) document.body.removeChild(menu);
            });

            const btnFinal = document.createElement("button");
            btnFinal.textContent = state.isFinal ? "Remover Final" : "Definir Final";
            btnFinal.style.display = "block";
            btnFinal.style.width = "100%";
            btnFinal.style.padding = "5px 10px";
            btnFinal.style.border = "none";
            btnFinal.style.background = "none";
            btnFinal.style.textAlign = "left";
            btnFinal.style.cursor = "pointer";
            btnFinal.addEventListener("mouseover", () => { btnFinal.style.backgroundColor = "#f0f0f0"; });
            btnFinal.addEventListener("mouseout", () => { btnFinal.style.backgroundColor = "transparent"; });
            btnFinal.addEventListener("click", () => {
              onToggleFinal(state.id);
              if (document.body.contains(menu)) document.body.removeChild(menu);
            });

            const btnOutput = document.createElement("button");
            btnOutput.textContent = `Output: ${state.output || "(vazio)"}`;
            btnOutput.style.display = "block";
            btnOutput.style.width = "100%";
            btnOutput.style.padding = "5px 10px";
            btnOutput.style.border = "none";
            btnOutput.style.background = "none";
            btnOutput.style.textAlign = "left";
            btnOutput.style.cursor = "pointer";
            btnOutput.addEventListener("mouseover", () => { btnOutput.style.backgroundColor = "#f0f0f0"; });
            btnOutput.addEventListener("mouseout", () => { btnOutput.style.backgroundColor = "transparent"; });
            btnOutput.addEventListener("click", () => {
              const out = prompt("Digite a saída (output) deste estado (Máquina de Moore):", state.output ?? "");
              if (out !== null) onToggleOrSetStateOutput(state.id, out);
              if (document.body.contains(menu)) document.body.removeChild(menu);
            });

            menu.appendChild(btnInitial);
            menu.appendChild(btnFinal);
            menu.appendChild(btnOutput);
            document.body.appendChild(menu);

            const clickHandler = () => {
              if (document.body.contains(menu)) document.body.removeChild(menu);
              document.removeEventListener("click", clickHandler);
            };

            setTimeout(() => {
              document.addEventListener("click", clickHandler);
            }, 0);
          });

          upsertStateOutputBadge(stateEl, state.output);

          if (container) container.appendChild(stateEl);
        } else {
          stateEl.className = `state ${state.isInitial ? "initial" : ""} ${state.isFinal ? "final" : ""} ${selectedStateId === state.id ? "selected" : ""}`;
          stateEl.style.left = `${state.position.x}px`;
          stateEl.style.top = `${state.position.y}px`;

          const labelSpan = stateEl.querySelector(".state-label") as HTMLElement | null;
          if (labelSpan) labelSpan.textContent = state.label;
          else {
            const newLabel = document.createElement("span");
            newLabel.className = "state-label";
            newLabel.textContent = state.label;
            stateEl.appendChild(newLabel);
          }

          upsertStateOutputBadge(stateEl, state.output);
        }

        if (mode === "move") {
          instance.draggable(stateEl, {
            containment: containerRef.current || undefined,
            stop: () => {},
          });
        }

        instance.makeSource(stateEl, {
          filter: ".state",
          anchor: "Continuous",
          connectorStyle: { stroke: "#456", strokeWidth: 2 },
          maxConnections: -1,
        });

        instance.makeTarget(stateEl, {
          dropOptions: { hoverClass: "dragHover" },
          anchor: "Continuous",
          allowLoopback: true,
        });
      });

      automaton.connections.forEach((conn) => {
        instance.connect({
          source: document.getElementById(conn.sourceId),
          target: document.getElementById(conn.targetId),
          connector: conn.sourceId === conn.targetId ? ["Bezier", { curviness: 80 }] : ["Bezier", { curviness: 50 }],
          overlays: [
            ["Arrow", { width: 10, length: 10, location: 1 }],
            ["Label", { label: conn.label, location: conn.sourceId === conn.targetId ? 0.25 : 0.5, cssClass: "transition-label" }],
          ],
        });
      });
    });
  };

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (mode !== "addState" || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    onAddState(x, y);
  };

  return (
    <Screen>
      <Link href="/" text="Voltar para a página inicial" className="!w-60 mb-5" />
      <h1 className="font-bold mb-10 text-2xl">Simulador de Máquina de Moore</h1>

      <div className="flex flex-col mb-5">
        <div className="flex gap-2 mb-4">
          <Button text="Adicionar Estado" onClick={() => onChangeMode("addState")} className={`${mode === "addState" ? "bg-blue-600" : "bg-gray-400"}`} />
          <Button text="Adicionar Transição" onClick={() => onChangeMode("addConnection")} className={`${mode === "addConnection" ? "bg-blue-600" : "bg-gray-400"} ${selectedStateId ? "border-2 border-yellow-400" : ""}`} />
          <Button text="Mover Estados" onClick={() => onChangeMode("move")} className={`${mode === "move" ? "bg-blue-600" : "bg-gray-400"}`} />
          <Button text="Excluir" onClick={() => onChangeMode("delete")} className={`${mode === "delete" ? "bg-red-600" : "bg-gray-400"}`} />

          {mode === "addConnection" && selectedStateId && (
            <Button text="Cancelar Transição" onClick={() => { onChangeMode("addConnection"); }} className="bg-yellow-500" />
          )}
        </div>

        <div className="flex gap-2 mb-4">
          <Input label="Palavra para testar" type={InputTypes.Text} value={word} onChange={onChangeWord} className="w-40" />
          <Button text="Testar Palavra" onClick={onTestWord} className="bg-green-600 mt-auto" />
        </div>

        {testResult && (
          <div className={`p-2 mb-4 rounded ${testResult.accepted ? "bg-green-200" : "bg-red-200"}`}>
            {testResult.message}
          </div>
        )}

        <div className="flex gap-2 mb-4">
          <Button text="Limpar Autômato" onClick={onClearAutomaton} className="bg-red-500" />
          <Button text="Salvar Autômato" onClick={onSaveAutomaton} className="bg-blue-500" />
          <FileInput accept=".json" onChange={onLoadAutomaton} className="mt-0" label="Carregar Autômato" />
        </div>
      </div>

      {statusMessage && (
        <div className="p-3 mb-4 rounded bg-blue-100 border-l-4 border-blue-500 text-blue-800">
          <strong>Instrução:</strong> {statusMessage}
        </div>
      )}

      <div ref={containerRef} className="border-2 rounded-2xl w-full h-[500px] relative overflow-hidden bg-gray-200" onClick={handleContainerClick} style={{ position: "relative" }} />

      <Button onClick={() => setIsRulesVisible((p) => !p)} className="mt-4 !w-60 bg-blue-400 hover:bg-blue-600" text={isRulesVisible ? "Esconder Regras" : "Mostrar Regras"} />

      {isRulesVisible && (
        <div className="mt-4 p-4 border-2 rounded-md bg-gray-100 w-full max-w-md">
          <h3 className="font-bold mb-2">Regras para Autômatos Finitos:</h3>
          <ul className="list-disc list-inside">
            <li>O simulador implementa apenas Autômatos Finitos Determinísticos (AFD).</li>
            <li>Cada estado deve ter um nome/rótulo único.</li>
            <li>Um AFD deve ter exatamente um estado inicial, marcado com uma seta de entrada.</li>
            <li>Um AFD deve ter pelo menos um estado final, marcado com borda dupla.</li>
            <li>Cada transição deve ter um único símbolo como rótulo (não são aceitos símbolos vazios ε).</li>
            <li>Para cada estado e cada símbolo do alfabeto, deve haver exatamente uma transição (determinismo).</li>
            <li>Para testar uma palavra, digite-a no campo Palavra para testar e clique em Testar Palavra.</li>
            <li>O processamento da palavra começa no estado inicial e segue as transições correspondentes aos símbolos da palavra.</li>
            <li>A palavra é aceita se, após ler todos os símbolos, o autômato estiver em um estado final.</li>
            <li>A palavra é rejeitada se não houver transição para algum símbolo ou se terminar em um estado não-final.</li>
          </ul>
        </div>
      )}

      <style jsx global>{`
        .state {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background-color: #4a90e2;
          color: white;
          text-align: center;
          line-height: 50px;
          position: absolute;
          cursor: pointer;
          user-select: none;
          z-index: 20;
          transition: all 0.2s ease;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .state .state-label {
          pointer-events: none;
          user-select: none;
        }
        .state.selected {
          border: 4px dashed #ff9800;
          box-shadow: 0 0 10px #ff9800, 0 0 5px #ff9800 inset;
          transform: scale(1.1);
          z-index: 30;
        }
        .state.initial {
          box-shadow: 0 0 0 4px #0e0d0d inset;
        }
        .state.initial.selected {
          box-shadow: 0 0 0 4px #0e0d0d inset, 0 0 10px #ff9800;
        }
        .state.final {
          border: 4px solid #e6101a;
          background-color: #f30808;
        }
        .state.final.selected {
          border: 4px dashed #ff9800;
          box-shadow: 0 0 10px #ff9800;
        }
        .transition-label {
          transform: translateY(-10px);
          font-weight: bold;
          background: white;
          padding: 2px 4px;
          border-radius: 4px;
          border: 1px solid #ccc;
          z-index: 10;
        }
        .state .state-output {
          pointer-events: none;
          user-select: none;
        }
      `}</style>
    </Screen>
  );
};
