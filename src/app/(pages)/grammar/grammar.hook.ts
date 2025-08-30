import { useCallback, useEffect, useState } from "react";
import { GrammarState, IGrammarProps } from "./grammar.types";

export const useGrammar = (): IGrammarProps => {
  const [isRulesVisible, setIsRulesVisible] = useState(true);
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

  const onValidateGrammar = useCallback(
    (grammar: GrammarState): GrammarState => {
      const isSymbolValid = validateGrammarSymbol(grammar.symbol);
      const isValid =
        validateGrammarValue(grammar.value) && grammar.symbol !== "";
      // const value = grammar.symbol ? grammar.value || "ε" : grammar.value;
      return { ...grammar, isSymbolValid, isValid };
    },
    []
  );

  const onValidateText = useCallback(
    (text: string) => {
      // Não-terminal: gramática[]
      const grammarMap: Record<string, string[]> = {};
      for (const g of grammarStates) {
        if (g.symbol && g.isSymbolValid && g.isValid) {
          if (!grammarMap[g.symbol]) grammarMap[g.symbol] = [];
          grammarMap[g.symbol].push(g.value);
        }
      }

      // Derivação à direita
      function derive(symbol: string, input: string): boolean {
        if (!grammarMap[symbol]) return false;
        for (const production of grammarMap[symbol]) {
          if (production.length === 0) {
            // Epsilon
            if (input.length === 0) return true;
          } else if (production.length === 1) {
            // Terminal unitário
            if (input[0] === production[0] && input.length === 1) return true;
          } else {
            // Produção com mais de um símbolo
            const terminal = production[0];
            const nextSymbol = production.slice(1);
            if (input[0] === terminal) {
              if (nextSymbol.match(/^[A-Z]$/)) {
                // Próximo é um não-terminal (e.g., 'A')
                if (derive(nextSymbol, input.slice(1))) return true;
              } else {
                // Próximo é um terminal não-unitário (e.g., 'ab')
                if (
                  input.slice(1).startsWith(nextSymbol) &&
                  input.length === 1 + nextSymbol.length
                ) {
                  return true;
                }
              }
            }
          }
        }
        return false;
      }

      const startSymbol = grammarStates[0]?.symbol || "S";
      return derive(startSymbol, text);
    },
    [grammarStates]
  );

  const onDownloadGrammar = () => {
    const json = JSON.stringify(grammarStates);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "grammar.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const onUploadGrammar = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result;
        if (typeof content === "string") {
          const parsed: GrammarState[] = JSON.parse(content);
          if (Array.isArray(parsed)) {
            setGrammarStates(
              parsed.map((g, index) => ({
                id: index + 1,
                symbol: g.symbol || "",
                isSymbolValid: true,
                value: g.value || "",
                isValid: true,
              }))
            );
          }
        }
      } catch (error) {
        console.error("Erro ao ler o arquivo de gramática:", error);
      }
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    const lastGrammar = grammarStates[grammarStates.length - 1];
    const secondLastGrammar = grammarStates[grammarStates.length - 2];
    if (
      lastGrammar &&
      lastGrammar.symbol.trim() === "" &&
      secondLastGrammar &&
      secondLastGrammar.symbol.trim() === ""
    ) {
      setGrammarStates((prev) => prev.slice(0, -1));
    } else if (grammarStates.every((grammar) => grammar.symbol.trim() !== "")) {
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
    // TODO: Corrigir infinit loop ao validar
    // setGrammarStates((prev) => prev.map(onValidateGrammar));
  }, [grammarStates, onValidateGrammar]);

  useEffect(() => {
    // setGrammarStates((prev) => prev.map(onValidateGrammar));
    setIsTextValid(onValidateText(text));
  }, [text, onValidateText, onValidateGrammar]);

  return {
    grammarStates,
    text,
    isTextValid,
    isRulesVisible,
    onDownloadGrammar,
    onUploadGrammar,
    onChangeGrammarStates: setGrammarStates,
    onChangeText: setText,
    onChangeIsRulesVisible: setIsRulesVisible,
  };
};
