"use client";

import { Button } from "@/components/button";
import { FileInput } from "@/components/file-input";
import { Input, InputTypes } from "@/components/input";
import { Link } from "@/components/link";
import { Screen } from "@/components/screen";
import { useEffect, useRef } from "react";
import { IAutomatonPage, JsPlumbInstance } from "./automaton.types";

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
  onAddConnection,
  onSetInitial,
  onToggleFinal,
  onChangeMode,
  onChangeWord,
  onTestWord,
  onClearAutomaton,
  onSaveAutomaton,
  onLoadAutomaton,
}: IAutomatonPage) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const jsPlumbInstanceRef = useRef<JsPlumbInstance | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && containerRef.current) {
      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/npm/jsplumb@2.15.0/dist/js/jsplumb.min.js";
      script.async = true;

      script.onload = () => {
        if (window.jsPlumb && containerRef.current) {
          const instance = window.jsPlumb.getInstance({
            Container: containerRef.current,
          });

          // Configurações padrão
          instance.importDefaults({
            Connector: ["Bezier", { curviness: 50 }],
            Endpoint: "Dot",
            EndpointStyle: { fill: "#456" },
            PaintStyle: { stroke: "#456", strokeWidth: 2 },
            HoverPaintStyle: { stroke: "#c61", strokeWidth: 3 },
            ConnectionOverlays: [
              ["Arrow", { width: 10, length: 10, location: 1 }],
            ],
          });

          jsPlumbInstanceRef.current = instance;
          renderAutomaton();
        }
      };

      document.body.appendChild(script);

      return () => {
        // Limpar jsPlumb quando o componente for desmontado
        if (jsPlumbInstanceRef.current) {
          jsPlumbInstanceRef.current.reset();
        }
        // Remover o script
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log("Autômato atualizado ou modo alterado, re-renderizando...");
    renderAutomaton();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [automaton, mode, selectedStateId]);
  const renderAutomaton = () => {
    if (!jsPlumbInstanceRef.current || !containerRef.current) return;

    const instance = jsPlumbInstanceRef.current;
    instance.reset();

    // Limpar os elementos existentes no container
    if (containerRef.current) {
      // Manter uma cópia do container para evitar problemas com removeChild
      const container = containerRef.current;
      // Remover todos os elementos com classe 'state'
      const states = container.querySelectorAll(".state");
      states.forEach((state) => {
        container.removeChild(state);
      });
    }

    instance.batch(() => {
      // Renderizar estados
      automaton.states.forEach((state) => {
        let stateEl = document.getElementById(state.id);

        if (!stateEl) {
          // Criar um novo elemento para o estado
          stateEl = document.createElement("div");
          stateEl.id = state.id;
          stateEl.className = `state ${state.isInitial ? "initial" : ""} ${
            state.isFinal ? "final" : ""
          } ${selectedStateId === state.id ? "selected" : ""}`;
          stateEl.style.left = `${state.position.x}px`;
          stateEl.style.top = `${state.position.y}px`;
          stateEl.textContent = state.label;

          // Adicionar evento de clique para selecionar o estado
          stateEl.addEventListener("click", (e) => {
            e.stopPropagation();
            console.log(`Clicou no estado ${state.id}, modo: ${mode}`);

            if (mode === "delete") {
              // Em modo de exclusão, chame diretamente a função de exclusão
              onDeleteState(state.id);
            } else {
              // Nos outros modos, use o onSelectState normalmente
              onSelectState(state.id);
            }
          });

          // Adicionar evento de menu de contexto
          stateEl.addEventListener("contextmenu", (e) => {
            e.preventDefault();

            // Exibir menu de contexto
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

            // Botão para definir como inicial
            const btnInitial = document.createElement("button");
            btnInitial.textContent = "Definir Inicial";
            btnInitial.style.display = "block";
            btnInitial.style.width = "100%";
            btnInitial.style.padding = "5px 10px";
            btnInitial.style.border = "none";
            btnInitial.style.background = "none";
            btnInitial.style.textAlign = "left";
            btnInitial.style.cursor = "pointer";

            btnInitial.addEventListener("mouseover", () => {
              btnInitial.style.backgroundColor = "#f0f0f0";
            });

            btnInitial.addEventListener("mouseout", () => {
              btnInitial.style.backgroundColor = "transparent";
            });

            btnInitial.addEventListener("click", () => {
              onSetInitial(state.id);
              document.body.removeChild(menu);
            });

            // Botão para alternar estado final
            const btnFinal = document.createElement("button");
            btnFinal.textContent = state.isFinal
              ? "Remover Final"
              : "Definir Final";
            btnFinal.style.display = "block";
            btnFinal.style.width = "100%";
            btnFinal.style.padding = "5px 10px";
            btnFinal.style.border = "none";
            btnFinal.style.background = "none";
            btnFinal.style.textAlign = "left";
            btnFinal.style.cursor = "pointer";

            btnFinal.addEventListener("mouseover", () => {
              btnFinal.style.backgroundColor = "#f0f0f0";
            });

            btnFinal.addEventListener("mouseout", () => {
              btnFinal.style.backgroundColor = "transparent";
            });

            btnFinal.addEventListener("click", () => {
              onToggleFinal(state.id);
              document.body.removeChild(menu);
            });

            menu.appendChild(btnInitial);
            menu.appendChild(btnFinal);
            document.body.appendChild(menu);

            // Remover menu ao clicar em qualquer lugar
            const clickHandler = () => {
              if (document.body.contains(menu)) {
                document.body.removeChild(menu);
              }
              document.removeEventListener("click", clickHandler);
            };

            // Usar setTimeout para evitar que o evento de clique atual feche o menu imediatamente
            setTimeout(() => {
              document.addEventListener("click", clickHandler);
            }, 0);
          });

          if (containerRef.current) {
            containerRef.current.appendChild(stateEl);
          }
        } else {
          // Atualizar estado existente
          stateEl.className = `state ${state.isInitial ? "initial" : ""} ${
            state.isFinal ? "final" : ""
          } ${selectedStateId === state.id ? "selected" : ""}`;
          stateEl.style.left = `${state.position.x}px`;
          stateEl.style.top = `${state.position.y}px`;
          stateEl.textContent = state.label;
        }

        // Configurar estado como draggable se estiver no modo 'move'
        if (mode === "move") {
          instance.draggable(stateEl, {
            containment: containerRef.current || undefined,
            stop: () => {
              // Atualizar posição do estado no modelo - implementado na hook
            },
          });
        }

        // Configurar endpoints para conexões
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

      // Renderizar conexões
      automaton.connections.forEach((conn) => {
        instance.connect({
          source: document.getElementById(conn.sourceId),
          target: document.getElementById(conn.targetId),
          connector:
            conn.sourceId === conn.targetId
              ? ["Bezier", { curviness: 80 }]
              : ["Bezier", { curviness: 50 }],
          overlays: [
            ["Arrow", { width: 10, length: 10, location: 1 }],
            [
              "Label",
              {
                label: conn.label,
                location: conn.sourceId === conn.targetId ? 0.25 : 0.5,
                cssClass: "transition-label",
              },
            ],
          ],
        });
      });
    });
  };

  // Handler para adicionar estados ao clicar no container
  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (mode === "addState" && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      onAddState(x, y);
    }
  };

  return (
    <Screen>
      <Link
        href="/"
        text="Voltar para a página inicial"
        className="!w-60 mb-5"
      />
      <h1 className="font-bold mb-10 text-2xl">
        Simulador de Autômatos Finitos
      </h1>
      <div className="flex flex-col mb-5">
        <div className="flex gap-2 mb-4">
          <Button
            text="Adicionar Estado"
            onClick={() => onChangeMode("addState")}
            className={`${mode === "addState" ? "bg-blue-600" : "bg-gray-400"}`}
          />
          <Button
            text="Adicionar Transição"
            onClick={() => onChangeMode("addConnection")}
            className={`${
              mode === "addConnection" ? "bg-blue-600" : "bg-gray-400"
            } ${selectedStateId ? "border-2 border-yellow-400" : ""}`}
          />
          <Button
            text="Mover Estados"
            onClick={() => onChangeMode("move")}
            className={`${mode === "move" ? "bg-blue-600" : "bg-gray-400"}`}
          />
          <Button
            text="Excluir"
            onClick={() => onChangeMode("delete")}
            className={`${mode === "delete" ? "bg-red-600" : "bg-gray-400"}`}
          />

          {mode === "addConnection" && selectedStateId && (
            <Button
              text="Cancelar Transição"
              onClick={() => {
                onChangeMode("addConnection"); // Isso vai resetar o estado selecionado
              }}
              className="bg-yellow-500"
            />
          )}
        </div>

        <div className="flex gap-2 mb-4">
          <Input
            label="Palavra para testar"
            type={InputTypes.Text}
            value={word}
            onChange={onChangeWord}
            className="w-40"
          />
          <Button
            text="Testar Palavra"
            onClick={onTestWord}
            className="bg-green-600 mt-auto"
          />
        </div>

        {testResult && (
          <div
            className={`p-2 mb-4 rounded ${
              testResult.accepted ? "bg-green-200" : "bg-red-200"
            }`}
          >
            {testResult.message}
          </div>
        )}

        <div className="flex gap-2 mb-4">
          <Button
            text="Limpar Autômato"
            onClick={onClearAutomaton}
            className="bg-red-500"
          />
          <Button
            text="Salvar Autômato"
            onClick={onSaveAutomaton}
            className="bg-blue-500"
          />
          <FileInput
            accept=".json"
            onChange={onLoadAutomaton}
            className="mt-0"
            label="Carregar Autômato"
          />
        </div>
      </div>

      {statusMessage && (
        <div className="p-3 mb-4 rounded bg-blue-100 border-l-4 border-blue-500 text-blue-800">
          <strong>Instrução:</strong> {statusMessage}
        </div>
      )}

      <div
        ref={containerRef}
        className="border-2 rounded-2xl w-full h-[500px] relative overflow-hidden bg-gray-200"
        onClick={handleContainerClick}
        style={{ position: "relative" }}
      />

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
      `}</style>
    </Screen>
  );
};
