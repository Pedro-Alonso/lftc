import { Button } from "@/components/button";
import { FileInput } from "@/components/file-input";
import { Input, InputTypes } from "@/components/input";
import { Link } from "@/components/link";
import { Screen } from "@/components/screen";
import { IGrammarProps } from "./grammar.types";

export const GrammarLayout = ({
  grammarStates,
  text,
  isTextValid,
  isRulesVisible,
  onDownloadGrammar,
  onUploadGrammar,
  onChangeGrammarStates,
  onChangeText,
  onChangeIsRulesVisible,
}: IGrammarProps) => {
  const renderGrammarInput = () => {
    return grammarStates.map((grammar, index) => (
      <div className="flex gap-2" key={grammar.id}>
        <Input
          key={`${grammar.id}-symbol`}
          type={InputTypes.Text}
          value={grammar.symbol}
          className={`w-10 ${grammar.isSymbolValid ? "" : "bg-red-200"}`}
          onChange={(value) => {
            onChangeGrammarStates((prev) =>
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
            onChangeGrammarStates((prev) =>
              prev.map((g, i) => (i === index ? { ...g, value } : g))
            );
          }}
        />
      </div>
    ));
  };

  return (
    <Screen>
      <Link
        href="/"
        text="Voltar para a página inicial"
        className="!w-60 mb-5"
      />
      <h1 className="font-bold mb-10 text-2xl">Simulador de Gramática</h1>
      <h2 className="text-lg">Gramática</h2>
      <div className="flex flex-col gap-4 border-2 rounded-md p-4 mb-4">
        {renderGrammarInput()}
      </div>
      <Input
        label="Sentença para validar"
        type={InputTypes.Text}
        value={text}
        className={`w-60 ${isTextValid ? "bg-green-200" : "bg-red-200"}`}
        onChange={onChangeText}
      />
      <Button
        onClick={onDownloadGrammar}
        className="mt-4 !w-60"
        text="Baixar Gramática"
      />
      <FileInput
        accept=".json"
        onChange={onUploadGrammar}
        className="mt-4 !w-60"
        label="Carregar Gramática"
      />
      <Button
        onClick={() => onChangeGrammarStates([])}
        className="mt-4 !w-60 bg-red-400 hover:bg-red-600"
        text="Limpar Gramática"
      />
      <Button
        onClick={() => onChangeIsRulesVisible((prev) => !prev)}
        className="mt-4 !w-60 bg-blue-400 hover:bg-blue-600"
        text={isRulesVisible ? "Esconder Regras" : "Mostrar Regras"}
      />
      {isRulesVisible && (
        <div className="mt-4 p-4 border-2 rounded-md bg-gray-100 w-full max-w-md">
          <h3 className="font-bold mb-2">Regras para a Gramática:</h3>
          <ul className="list-disc list-inside">
            <li>Símbolos não-terminais devem ser letras maiúsculas (A-Z).</li>
            <li>
              Símbolos terminais devem ser letras minúsculas (a-z), números
              (0-9) ou espaços.
            </li>
            <li>Produções podem ser vazias.</li>
            <li>Exemplo de produção válida: S → aA</li>
            <li>Exemplo de produção inválida: S → a1B (contém número)</li>
          </ul>
        </div>
      )}
    </Screen>
  );
};
