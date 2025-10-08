"use client";

import { State, VALID_GUESSES, WORDS, WordState, blankBoard } from "@/types/wordle";
import { useEffect, useRef, useState } from "react";
import Word from "../Word/Word";
import "./Wordle.scss";
import Keyboard from "../../Keyboard/Keyboard";
import { ToastContainer, Toast, Button } from "react-bootstrap";

export default function Wordle() {
  const [clicks, setClicks] = useState(0);
  const [show, setShow] = useState(false);
  const [showFail, setShowFail] = useState(false);
  const [shakeIndex, setShakeIndex] = useState(-1);

  const word = useRef<string>(WORDS[Math.floor(Math.random() * WORDS.length)]);

  const guesses = useRef<WordState[]>(blankBoard());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (/^[a-zA-Z]$/.test(e.key) || e.key === "Backspace" || e.key === "Enter") {
        e.preventDefault();
      }
      handleKey(e.key);
    };

    window.scrollTo(0, 1);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });

  function resetBoard() {
    word.current = WORDS[Math.floor(Math.random() * WORDS.length)];
    guesses.current = blankBoard();
    hideToast();
  }

  function handleKey(key: string) {
    if (/^[a-zA-Z]$/.test(key)) {
      const guessNum = guesses.current.filter((x) => !x.submitted).length;
      const letterNum = guesses.current.filter((x) => !x.submitted)[0].letters.filter((x) => x.letter === "").length;

      if (guessNum === 0 || letterNum === 0) {
        return;
      }

      guesses.current[6 - guessNum].letters[5 - letterNum].letter = key.toLowerCase();
      setShakeIndex(-1);
    } else if (key === "Backspace") {
      const guessNum = guesses.current.filter((x) => !x.submitted).length;
      const letterNum = guesses.current.filter((x) => !x.submitted)[0].letters.filter((x) => x.letter === "").length;

      if (guessNum === 0 || letterNum === 5) {
        return;
      }

      guesses.current[6 - guessNum].letters[4 - letterNum].letter = "";
      setShakeIndex(-1);
    } else if (key === "Enter") {
      const guessNum = guesses.current.filter((x) => !x.submitted).length;

      const guess = guesses.current[6 - guessNum].letters
        .map((x) => x.letter)
        .join("")
        .trim();
      if (guess.length !== 5) {
        setShakeIndex(6 - guessNum);
        setTimeout(() => {
          setShakeIndex(-1);
        }, 500);
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
      } else {
        setShakeIndex(6 - guessNum);
        setTimeout(() => {
          setShakeIndex(-1);
        }, 500);
      }

      if (guess === word.current) {
        setShow(true);
      }

      if (guesses.current[5].submitted === true && guess !== word.current) {
        setShowFail(true);
      }
    }

    setClicks(clicks + 1);
  }

  function hideToast() {
    setShowFail(false);
    setShow(false);
  }

  return (
    <div className="wordle-container">
      <div className="wordle">
        <div className="word-container">
          {guesses.current.map((x, i) => {
            return <Word key={i} word={x} shake={shakeIndex === i} />;
          })}
        </div>
        <Keyboard
          onClick={handleKey}
          incorrectLetters={guesses.current
            .filter((x) => x.submitted)
            .flatMap((x) => x.letters)
            .filter((y) => y.state === State.Incorrect)
            .map((y) => y.letter.toUpperCase())
            .filter((z) => z)
            .filter(
              (x) =>
                !guesses.current
                  .filter((x) => x.submitted)
                  .flatMap((x) => x.letters)
                  .filter((y) => y.state === State.Correct || y.state === State.Partial)
                  .map((y) => y.letter.toUpperCase())
                  .includes(x)
            )}
          correctLetters={guesses.current
            .filter((x) => x.submitted)
            .flatMap((x) => x.letters)
            .filter((y) => y.state === State.Correct)
            .map((y) => y.letter.toUpperCase())
            .filter((z) => z)}
        />
        <ToastContainer position="middle-center">
          <Toast bg={"success"} show={show} onClick={hideToast} onClose={() => hideToast()}>
            <Toast.Header>
              <strong className="me-auto">Wordle</strong>
              <small className="text-muted">Just now</small>
            </Toast.Header>
            <Toast.Body>
              <p>Victory!</p>
              <Button onClick={resetBoard}>Play Again?</Button>
            </Toast.Body>
          </Toast>
          <Toast bg={"danger"} show={showFail} onClick={hideToast} onClose={() => hideToast()}>
            <Toast.Header>
              <strong className="me-auto">Wordle</strong>
              <small className="text-muted">Just now</small>
            </Toast.Header>
            <Toast.Body>
              <p>Unlucky, the word was &quot;{word.current}&quot;</p>
              <Button onClick={resetBoard}>Play Again?</Button>
            </Toast.Body>
          </Toast>
        </ToastContainer>
      </div>
    </div>
  );
}
