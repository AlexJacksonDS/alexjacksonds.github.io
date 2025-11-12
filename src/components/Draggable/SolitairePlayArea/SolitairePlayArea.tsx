import { Col, Placeholder, Row } from "react-bootstrap";
import DraggableStack from "../DraggableCardStack/DraggableCardStack";
import DroppableCardList from "../DroppableCardList/DroppableCardList";
import { Card, DropResult } from "@/types/draggableCards";

export default function SolitairePlayArea(props: {
  columns: Map<string, Card[]>;
  handleStackMove: (dropResult: DropResult, stackId: string) => void;
}) {
  return (
    <Row className="play-area">
      {[...props.columns.keys()].map((key) => {
        const column = props.columns.get(key)!;
        return (
          <Col key={key} className="column">
            <DroppableCardList dropZoneId={key}>
              {column.length !== 0 ? (
                <DraggableStack
                  cards={column}
                  stackId={key}
                  isDeck={false}
                  handleStackMove={props.handleStackMove}
                />
              ) : (
                <Placeholder />
              )}
            </DroppableCardList>
          </Col>
        );
      })}
    </Row>
  );
}
