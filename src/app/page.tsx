"use client";

import { Link } from "@/components/link";
import { Screen } from "@/components/screen";

export default function Home() {
  return (
    <Screen>
      <h1 className="font-bold text-2xl text-center">
        Selecione a funcionalidade que deseja acessar:
      </h1>
      <div className="flex flex-col mt-4 gap-2 p-3 w-fill items-center justify-center border rounded-lg border-gray-300">
        <Link href="/regex" text="Simulador de Regex" />
        <Link href="/grammar" text="Simulador de Gramática" />
        <Link href="/automaton" text="Simulador de Autômatos finitos" />
      </div>
    </Screen>
  );
}
