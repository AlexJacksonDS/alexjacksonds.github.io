"use client";

import { State, VALID_GUESSES, WORDS, WordState } from "@/types/wordle";
import { useEffect, useRef, useState } from "react";
import Word from "../Word/Word";
import "./Wordle.scss";
import Keyboard from "../../Keyboard/Keyboard";

export default function Wordle() {
  const [clicks, setClicks] = useState(0);

  const word = useRef<string>(WORDS[Math.floor(Math.random() * WORDS.length)]);

  const guesses = useRef<WordState[]>([
    {
      letters: [
        { letter: "", state: State.Unsubmitted },
        { letter: "", state: State.Unsubmitted },
        { letter: "", state: State.Unsubmitted },
        { letter: "", state: State.Unsubmitted },
        { letter: "", state: State.Unsubmitted },
      ],
      submitted: false,
    },
    {
      letters: [
        { letter: "", state: State.Unsubmitted },
        { letter: "", state: State.Unsubmitted },
        { letter: "", state: State.Unsubmitted },
        { letter: "", state: State.Unsubmitted },
        { letter: "", state: State.Unsubmitted },
      ],
      submitted: false,
    },
    {
      letters: [
        { letter: "", state: State.Unsubmitted },
        { letter: "", state: State.Unsubmitted },
        { letter: "", state: State.Unsubmitted },
        { letter: "", state: State.Unsubmitted },
        { letter: "", state: State.Unsubmitted },
      ],
      submitted: false,
    },
    {
      letters: [
        { letter: "", state: State.Unsubmitted },
        { letter: "", state: State.Unsubmitted },
        { letter: "", state: State.Unsubmitted },
        { letter: "", state: State.Unsubmitted },
        { letter: "", state: State.Unsubmitted },
      ],
      submitted: false,
    },
    {
      letters: [
        { letter: "", state: State.Unsubmitted },
        { letter: "", state: State.Unsubmitted },
        { letter: "", state: State.Unsubmitted },
        { letter: "", state: State.Unsubmitted },
        { letter: "", state: State.Unsubmitted },
      ],
      submitted: false,
    },
    {
      letters: [
        { letter: "", state: State.Unsubmitted },
        { letter: "", state: State.Unsubmitted },
        { letter: "", state: State.Unsubmitted },
        { letter: "", state: State.Unsubmitted },
        { letter: "", state: State.Unsubmitted },
      ],
      submitted: false,
    },
  ]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (/^[a-zA-Z]$/.test(e.key) || e.key === "Backspace" || e.key === "Enter") {
        e.preventDefault();
      }
      handleKey(e.key);
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });

  function handleKey(key: string) {
    if (/^[a-zA-Z]$/.test(key)) {
      const guessNum = guesses.current.filter((x) => !x.submitted).length;
      const letterNum = guesses.current.filter((x) => !x.submitted)[0].letters.filter((x) => x.letter === "").length;

      if (guessNum === 0 || letterNum === 0) {
        return;
      }

      guesses.current[6 - guessNum].letters[5 - letterNum].letter = key.toLowerCase();
    } else if (key === "Backspace") {
      const guessNum = guesses.current.filter((x) => !x.submitted).length;
      const letterNum = guesses.current.filter((x) => !x.submitted)[0].letters.filter((x) => x.letter === "").length;

      if (guessNum === 0 || letterNum === 5) {
        return;
      }

      guesses.current[6 - guessNum].letters[4 - letterNum].letter = "";
    } else if (key === "Enter") {
      const guessNum = guesses.current.filter((x) => !x.submitted).length;

      const guess = guesses.current[6 - guessNum].letters
        .map((x) => x.letter)
        .join("")
        .trim();
      if (guess.length !== 5) {
        return;
      }

      if (VALID_GUESSES.includes(guess)) {
        const usedWordIndices = [];
        for (var i = 0; i < 5; i++) {
          if (guess[i] === word.current[i]) {
            usedWordIndices.push(i);
            guesses.current[6 - guessNum].letters[i].state = State.Correct;
          } else if (!word.current.includes(guess[i])) {
            guesses.current[6 - guessNum].letters[i].state = State.Incorrect;
          }
        }
        if (usedWordIndices.length < 5) {
          for (var i = 0; i < 5; i++) {
            if (guesses.current[6 - guessNum].letters[i].state === State.Unsubmitted) {
              if (word.current.includes(guess[i]) && !usedWordIndices.includes(word.current.indexOf(guess[i]))) {
                usedWordIndices.push(word.current.indexOf(guess[i]));
                guesses.current[6 - guessNum].letters[i].state = State.Partial;
              } else {
                guesses.current[6 - guessNum].letters[i].state = State.Incorrect;
              }
            }
          }
        }
        guesses.current[6 - guessNum].submitted = true;
      }
    }

    setClicks(clicks + 1);
  }

  return (
    <div className="wordle-container">
      <div className="wordle">
        <div className="word-container">
          {guesses.current.map((x, i) => {
            return <Word key={i} {...x} />;
          })}
        </div>
        <Keyboard
          onClick={handleKey}
          incorrectLetters={guesses.current
            .filter((x) => x.submitted)
            .flatMap((x) => x.letters)
            .filter((y) => y.state === State.Incorrect)
            .map((y) => y.letter.toUpperCase())
            .filter((z) => z)}
          correctLetters={guesses.current
            .filter((x) => x.submitted)
            .flatMap((x) => x.letters)
            .filter((y) => y.state === State.Correct)
            .map((y) => y.letter.toUpperCase())
            .filter((z) => z)}
        />
      </div>
    </div>
  );
}
