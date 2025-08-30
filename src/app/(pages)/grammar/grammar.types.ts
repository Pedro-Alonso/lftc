import { Dispatch, SetStateAction } from "react";

export interface GrammarState {
  id: number;
  symbol: string;
  isSymbolValid: boolean;
  value: string;
  isValid: boolean;
}

export interface IGrammarProps {
  grammarStates: GrammarState[];
  text: string;
  isTextValid: boolean;
  isRulesVisible: boolean;
  onDownloadGrammar: () => void;
  onUploadGrammar: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeGrammarStates: Dispatch<SetStateAction<GrammarState[]>>;
  onChangeText: Dispatch<SetStateAction<string>>;
  onChangeIsRulesVisible: Dispatch<SetStateAction<boolean>>;
}
