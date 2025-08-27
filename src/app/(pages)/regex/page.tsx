"use client";

import { Input, InputTypes } from "@/components/input";
import { Link } from "@/components/link";
import { Screen } from "@/components/screen";
import { useEffect, useState } from "react";

interface TextState {
  id: string;
  value: string;
  isValid: boolean;
}

const RegexPage = () => {
  const [regex, setRegex] = useState("^$");
  const [isRegexValid, setIsRegexValid] = useState(true);
  const [texts, setTexts] = useState<TextState[]>([
    { id: "text1", value: "", isValid: true },
    { id: "text2", value: "", isValid: true },
    { id: "text3", value: "", isValid: true },
  ]);

  const handleRegexChange = (value: string) => setRegex(value);

  const handleTextChange = (value: string, index: number) => {
    setTexts((prev) =>
      prev.map((item, i) => (i === index ? { ...item, value } : item))
    );
  };

  const validateTexts = (pattern: RegExp, currentTexts: TextState[]) => {
    return currentTexts.map((text) => ({
      ...text,
      isValid: pattern.test(text.value),
    }));
  };

  const combinedTexts = texts.map((t) => t.value).join(", ");

  useEffect(() => {
    try {
      const pattern = new RegExp(regex);
      setTexts((prev) => validateTexts(pattern, prev));
      setIsRegexValid(true);
    } catch {
      setIsRegexValid(false);
    }
  }, [regex, combinedTexts]);

  return (
    <Screen>
      <Link
        href="/"
        text="Voltar para a página inicial"
        className="!w-60 mb-5"
      />
      <div className="flex flex-col gap-4">
        <Input
          label="Regex"
          type={InputTypes.Text}
          onChange={handleRegexChange}
          value={regex}
          className={isRegexValid ? "bg-green-400" : "bg-red-400"}
        />

        {texts.map((text, index) => (
          <Input
            key={text.id}
            label={`Sentença para validar ${index + 1}`}
            type={InputTypes.Text}
            onChange={(value) => handleTextChange(value, index)}
            value={text.value}
            className={text.isValid ? "bg-green-400" : "bg-red-400"}
          />
        ))}
      </div>
    </Screen>
  );
};

export default RegexPage;
