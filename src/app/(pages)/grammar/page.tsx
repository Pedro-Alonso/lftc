"use client";

import { useGrammar } from "./grammar.hook";
import { GrammarLayout } from "./grammar.layout";

const GrammarPage = () => {
  const props = useGrammar();
  return <GrammarLayout {...props} />;
};

export default GrammarPage;
