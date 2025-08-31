"use client";

import { AutomatonNode } from "@/components/automaton-node";
import { Button } from "@/components/button";
import { Link } from "@/components/link";
import { Screen } from "@/components/screen";
import { IAutomatonPage } from "./automaton.types";

export const AutomatonLayout = ({
  automatons,
  isAddAutomatonToggled,
  onAddAutomaton,
  onClearAutomatons,
  onToggleAddAutomaton,
}: IAutomatonPage) => {
  return (
    <Screen>
      <Link
        href="/"
        text="Voltar para a página inicial"
        className="!w-60 mb-5"
      />
      <h1 className="font-bold mb-10 text-2xl">
        Simulador de Autômatos finitos
      </h1>
      <div className="flex">
        <div className="flex flex-col items-center justify-center mr-5">
          <Button
            text={isAddAutomatonToggled ? "Cancelar" : "Adicionar Autômato"}
            onClick={onToggleAddAutomaton}
            className={`mb-5 ${
              isAddAutomatonToggled ? "bg-red-600 hover:bg-red-700" : ""
            }`}
          />
          <Button
            text="Limpar Autômatos"
            onClick={onClearAutomatons}
            className="bg-gray-400 hover:bg-gray-500 px-0.5"
          />
        </div>
        <div
          className="border-2 rounded-2xl w-[80vw] h-[80vh] relative overflow-hidden bg-gray-200 mx-auto"
          onClick={onAddAutomaton}
        >
          {automatons.map((automaton) => (
            <AutomatonNode key={automaton.id} automaton={automaton} />
          ))}
        </div>
      </div>
    </Screen>
  );
};
