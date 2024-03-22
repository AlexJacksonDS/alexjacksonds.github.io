import { AnimalTypes } from "@/types/cascadia";
import "./AnimalToken.scss";

export default function AnimalToken({
  possibleAnimals,
  animal,
}: {
  possibleAnimals: AnimalTypes[];
  animal?: AnimalTypes;
}) {
  function animalToUnicode(animal: AnimalTypes) {
    switch (animal) {
      case AnimalTypes.BEAR:
        return "\uD83D\uDC3B";
      case AnimalTypes.ELK:
        return "\uD83E\uDD8C";
      case AnimalTypes.FOX:
        return "\uD83E\uDD8A";
      case AnimalTypes.HAWK:
        return "\uD83E\uDD85";
      case AnimalTypes.SALMON:
        return "\uD83D\uDC1F";
    }
  }

  return animal ? (
    <div className={`animal ${animal}`}>{animalToUnicode(animal)}</div>
  ) : (
    <div className={`animal allowedAnimals${possibleAnimals.length === 3 ? " three" : ""}`}>
      {possibleAnimals.map((x) => animalToUnicode(x)).join(" ")}
    </div>
  );
}
