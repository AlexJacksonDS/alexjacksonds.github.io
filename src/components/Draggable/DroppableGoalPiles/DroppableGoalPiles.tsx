import { Col, Row } from "react-bootstrap";
import DraggableStack from "../DraggableCardStack/DraggableCardStack";
import DroppableCardList from "../DroppableCardList/DroppableCardList";
import { Card, DropResult } from "@/types/draggableCards";
import "./DroppableGoalPiles.scss";
import Placeholder from "../CardPlaceholder/Placeholder";

export default function DroppableGoalPiles(props: {
  piles: Map<string, Card[]>;
  handleStackMove: (dropResult: DropResult, stackId: string) => void;
}) {
  return (
    <Col>
      <Row>
        {[...props.piles.keys()].map((key) => {
          const pile = props.piles.get(key)!;
          return (
            <Col key={key} className="pile">
              <DroppableCardList dropZoneId={key}>
                {pile.length !== 0 ? (
                  <DraggableStack
                    cards={pile}
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
    </Col>
  );
}
