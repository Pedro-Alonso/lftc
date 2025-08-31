"use client";

import { useAutomaton } from "./automaton.hook";
import { AutomatonLayout } from "./automaton.layout";

const AutomatonPage = () => {
  const props = useAutomaton();
  return <AutomatonLayout {...props} />;
};

export default AutomatonPage;
