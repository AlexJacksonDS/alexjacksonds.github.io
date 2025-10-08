import { WordState } from "@/types/wordle";
import Letter from "../Letter/Letter";
import "./Word.scss";

export default function Word({ word, shake }: { word: WordState; shake: boolean }) {
  return (
    <div className={"word" + (shake ? " shake" : "")}>
      {word.letters.map((x, i) => {
        return <Letter key={i} {...x} />;
      })}
    </div>
  );
}
