import { Card, DropResult, ItemTypes } from "@/types/solitaire";
import { useDrag, DragSourceMonitor } from "react-dnd";

export default function DraggableStack({
  stackId,
  cards,
  isDeck,
  handleStackMove,
}: {
  stackId: string;
  cards: Card[];
  isDeck: boolean;
  handleStackMove: (dropResult: DropResult, stackId: string) => void;
}) {
  const allCards = [...cards];
  const selfCard = allCards.shift();
  const id = `${stackId}|${cards.map((c) => c.id).join(",")}`;

  const [, drag] = useDrag(
    () => ({
      type: ItemTypes.STACK,
      item: { id },
      canDrag: isDeck ? !id.includes(",") : selfCard?.isFaceUp,
      end: (item, mon) => {
        const dropResult = mon.getDropResult<DropResult>();
        if (dropResult) {
          handleStackMove(dropResult, item.id);
        }
      },
      collect: (monitor: DragSourceMonitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [isDeck, selfCard, id]
  );

  if (cards.length === 0) {
    return null;
  }

  return (
    <div ref={drag} className="card-list">
      {selfCard ? <DisplayCard card={selfCard} /> : null}
      {allCards.length >= 0 ? (
        <DraggableStack cards={allCards} stackId={stackId} isDeck={isDeck} handleStackMove={handleStackMove} />
      ) : null}
    </div>
  );
}

function DisplayCard(props: { card: Card }) {
  return (
    <img
      id={`${props.card.id}-img`}
      className={`normal${props.card.isFaceUp ? " draggable" : ""}`}
      src={`/cards/${props.card.isFaceUp ? props.card.id : "BLUE_BACK"}.svg`}
      alt={props.card.isFaceUp ? props.card.id : "BLUE_BACK"}
      draggable={false}
    />
  );
}
