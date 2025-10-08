import { WordState } from "@/types/wordle";
import Letter from "../Letter/Letter";
import "./Word.scss";

export default function Word(word: WordState) {
  return (
    <div className="word">
      {word.letters.map((x, i) => {
        return <Letter key={i} {...x} />;
      })}
    </div>
  );
}
