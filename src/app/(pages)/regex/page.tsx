"use client";

import { Input, InputTypes } from "@/components/input";
import { Link } from "@/components/link";
import { Screen } from "@/components/screen";
import { useEffect, useState } from "react";

const RegexPage = () => {
  const [regex, setRegex] = useState("^$");
  const [text, setText] = useState("");
  const [isTextValid, setIsTextValid] = useState(true);
  const [isRegexValid, setIsRegexValid] = useState(true);
  const handleRegexChange = (regex: string) => setRegex(regex);
  const handleTextChange = (text: string) => setText(text);
  useEffect(() => {
    try {
      const pattern = new RegExp(regex);
      setIsTextValid(pattern.test(text));
      setIsRegexValid(true);
    } catch {
      setIsRegexValid(false);
    }
  }, [regex, text]);
  return (
    <Screen>
      <Link
        href="/"
        text="Voltar para a página inicial"
        className="!w-60 mb-5"
      />
      <div className="flex gap-4">
        <Input
          label="Regex"
          type={InputTypes.Text}
          onChange={handleRegexChange}
          value={regex}
          className={isRegexValid ? "bg-green-400" : "bg-red-400"}
        />
        <Input
          label="Sentença para validar"
          type={InputTypes.Text}
          onChange={handleTextChange}
          value={text}
          className={isTextValid ? "bg-green-400" : "bg-red-400"}
        />
      </div>
    </Screen>
  );
};

export default RegexPage;
