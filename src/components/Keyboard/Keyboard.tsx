"use client";
import "./Keyboard.scss";

export default function Keyboard({
  onClick,
  incorrectLetters = [],
  correctLetters = [],
}: {
  onClick: (key: string) => void;
  incorrectLetters?: string[];
  correctLetters?: string[];
}) {
  return (
    <div className="keyboard-container">
      <div className="keyboard-row row-one">
        {"QWERTYUIOP".split("").map((l) => (
          <div
            className={
              "keyboard-letter" +
              (incorrectLetters.includes(l) ? " used" : "") +
              (correctLetters.includes(l) ? " correct" : "")
            }
            key={l}
            onClick={() => onClick(l)}
          >
            {l}
          </div>
        ))}
      </div>
      <div className="keyboard-row row-two">
        {"ASDFGHJKL".split("").map((l) => (
          <div
            className={
              "keyboard-letter" +
              (incorrectLetters.includes(l) ? " used" : "") +
              (correctLetters.includes(l) ? " correct" : "")
            }
            key={l}
            onClick={() => onClick(l)}
          >
            {l}
          </div>
        ))}
      </div>
      <div className="keyboard-row row-three">
        <div className="keyboard-letter special enter" key="Enter" onClick={() => onClick("Enter")}>
          ENTER
        </div>
        {"ZXCVBNM".split("").map((l) => (
          <div
            className={
              "keyboard-letter" +
              (incorrectLetters.includes(l) ? " used" : "") +
              (correctLetters.includes(l) ? " correct" : "")
            }
            key={l}
            onClick={() => onClick(l)}
          >
            {l}
          </div>
        ))}
        <div className="keyboard-letter special" key="Backspace" onClick={() => onClick("Backspace")}>
          {"<-"}
        </div>
      </div>
    </div>
  );
}
