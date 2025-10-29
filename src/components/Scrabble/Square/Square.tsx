import { SpaceType, Square } from "@/types/scrabble";
import "./Square.scss";
import ScrabbleTile from "../Tile/Tile";
import { useDrop } from "react-dnd";
import { Types } from "@/types/railRoadInk";

export default function ScrabbleSquare(props: { id: string; value: Square }) {
  const [, drop] = useDrop(
    () => ({
      accept: Types.TILE,
      canDrop: () => !props.value.tile,
      drop: () => ({ id: props.id }),
    }),
    [props.id, props.value.tile]
  );

  return (
    <div ref={drop} className={`gridsquare faux-borders ${getSquareType(props.value.spaceType)}`}>
      {props.value.tile ? (
        <ScrabbleTile {...{ value: props.value.tile, isDraggable: false }} />
      ) : (
        <div className={`gridsquare ${getSquareType(props.value.spaceType)}`}>
          {getSquareText(props.value.spaceType)}
        </div>
      )}
    </div>
  );
}

function getSquareType(type: SpaceType) {
  switch (type) {
    case SpaceType.Normal:
      return "normal";
    case SpaceType.DoubleLetter:
      return "dl";
    case SpaceType.TripleLetter:
      return "tl";
    case SpaceType.DoubleWord:
      return "dw";
    case SpaceType.TripleWord:
      return "tw";
  }
}

function getSquareText(type: SpaceType) {
  switch (type) {
    case SpaceType.Normal:
      return "";
    case SpaceType.DoubleLetter:
      return "Double Letter";
    case SpaceType.TripleLetter:
      return "Triple Letter";
    case SpaceType.DoubleWord:
      return "Double Word";
    case SpaceType.TripleWord:
      return "Triple Word";
  }
}
