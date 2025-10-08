import { LetterState, State } from "@/types/wordle";
import "./Letter.scss";
import { useState } from "react";

export default function Letter(letterState: LetterState = { letter: "", state: State.Unsubmitted }) {
  const [l, setL] = useState(letterState.letter);
  
  return <div className={"letter " + letterState.state}>{letterState.letter.toUpperCase()}</div>;
}
