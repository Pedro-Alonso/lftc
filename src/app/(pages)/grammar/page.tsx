"use client";

import { Input, InputTypes } from "@/components/input";
import { Link } from "@/components/link";
import { Screen } from "@/components/screen";
import { useEffect, useState } from "react";

interface GrammarState {
  id: number;
  symbol: string;
  isSymbolValid: boolean;
  value: string;
  isValid: boolean;
}

const GrammarPage = () => {
  const [text, setText] = useState("");
  const [isTextValid, setIsTextValid] = useState(true);
  const [grammarStates, setGrammarStates] = useState<GrammarState[]>([
    {
      id: 1,
      symbol: "",
      isSymbolValid: true,
      value: "",
      isValid: true,
    },
  ]);

  const validateGrammarSymbol = (symbol: string) => {
    return /^([A-Z]{0,1})$/.test(symbol);
  };

  const validateGrammarValue = (value: string) => {
    return /^[a-zA-Z0-9 ]*$/.test(value);
  };

  const onValidateGrammar = (grammar: GrammarState) => {
    return {
      ...grammar,
      isSymbolValid: validateGrammarSymbol(grammar.symbol),
      isValid: validateGrammarValue(grammar.value),
    };
  };

  const onValidateGrammars = (grammars: GrammarState[]) => {
    return grammars.map((grammar) => onValidateGrammar(grammar));
  };

  const onValidateText = (text: string) => {
    let currentTextIndex = 0;
    const initialSymbol = grammarStates[0].symbol;
    let currentGrammarValue = grammarStates[0].value.slice(-1);
    let grammarsForSymbol = grammarStates.filter(
      (g) => g.symbol === initialSymbol && g.isValid && g.symbol !== ""
    );
    while (grammarsForSymbol.length > 0) {
      if (currentTextIndex >= text.length) break;
      if (
        currentGrammarValue ===
        text.slice(currentTextIndex, currentGrammarValue.length)
      ) {
        currentTextIndex += currentGrammarValue.length;
        currentGrammarValue = grammarsForSymbol[0].value.slice(-1);
        grammarsForSymbol = grammarStates.filter(
          (g) =>
            g.symbol === currentGrammarValue && g.isValid && g.symbol !== ""
        );
      } else {
        grammarsForSymbol.shift();
        currentGrammarValue = grammarsForSymbol.length
          ? grammarsForSymbol[0].value.slice(-1)
          : "";
      }
    }
    return currentTextIndex === text.length;
  };

  const renderGrammarInput = () => {
    return grammarStates.map((grammar, index) => (
      <div className="flex gap-2" key={grammar.id}>
        <Input
          key={`${grammar.id}-symbol`}
          type={InputTypes.Text}
          value={grammar.symbol}
          className={`w-10 ${grammar.isSymbolValid ? "" : "bg-red-200"}`}
          onChange={(value) => {
            setGrammarStates((prev) =>
              prev.map((g, i) => (i === index ? { ...g, symbol: value } : g))
            );
          }}
        />
        <p>→</p>
        <Input
          key={grammar.id}
          type={InputTypes.Text}
          value={grammar.value}
          className={`w-60 ${grammar.isValid ? "" : "bg-red-200"}`}
          onChange={(value) => {
            setGrammarStates((prev) =>
              prev.map((g, i) => (i === index ? { ...g, value } : g))
            );
          }}
        />
      </div>
    ));
  };

  useEffect(() => {
    if (
      grammarStates.every(
        (grammar) => grammar.symbol.trim() !== "" && grammar.value.trim() !== ""
      )
    ) {
      setGrammarStates((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          symbol: "",
          isSymbolValid: true,
          value: "",
          isValid: true,
        },
      ]);
    }
  }, [grammarStates]);

  useEffect(() => {
    setIsTextValid(onValidateText(text));
  }, [text]);
  return (
    <Screen>
      <Link
        href="/"
        text="Voltar para a página inicial"
        className="!w-60 mb-5"
      />
      <h1>Simulador de Gramática</h1>
      <div className="flex flex-col gap-4">{renderGrammarInput()}</div>
      <Input
        label="Sentença para validar"
        type={InputTypes.Text}
        value={text}
        className="w-60"
        onChange={setText}
      />
      <p>{isTextValid ? "VALID" : "NOT VALID"}</p>
    </Screen>
  );
};

export default GrammarPage;
