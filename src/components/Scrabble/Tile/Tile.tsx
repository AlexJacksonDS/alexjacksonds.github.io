import { Tile } from "@/types/scrabble";
import "./Tile.scss";
import { DragSourceMonitor, useDrag } from "react-dnd";
import { DropResult, Types } from "@/types/railRoadInk";

export default function ScrabbleTile(props: {
  isDraggable: boolean;
  value: Tile;
  handleTileMove?: (dropResult: DropResult, item: { tile: Tile }) => void;
}) {
  const [, drag] = useDrag(
    () => ({
      type: Types.TILE,
      item: { tile: props.value },
      canDrag: props.isDraggable,
      end: (item, mon) => {
        const dropResult = mon.getDropResult<DropResult>();
        if (dropResult) {
          props.handleTileMove!(dropResult, item);
        }
      },
      collect: (monitor: DragSourceMonitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [props.value, props.isDraggable, props.handleTileMove]
  );

  return (
    <div ref={drag} className="tile">
      <div className="letter">{props.value.actualLetter.toUpperCase()}</div>
      <div className="points">{props.value.points}</div>
    </div>
  );
}
