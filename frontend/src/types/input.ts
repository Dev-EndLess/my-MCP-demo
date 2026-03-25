import { SyntheticEvent } from "react";

export interface InputAreaProps {
  input: string;
  setInput: (input: string) => void;
  handleSend: (e?: SyntheticEvent) => void;
  isLoading: boolean;
}
