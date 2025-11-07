"use client";

import { useAutomaton } from "./moore.hook";
import { AutomatonLayout } from "./moore.layout";

const AutomatonPage = () => {
  const props = useAutomaton();
  return <AutomatonLayout {...props} />;
};

export default AutomatonPage;