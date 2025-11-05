import { ScoutCard } from "@/types/scout";
import "./ScoutCard.scss";

export default function Card(props: {card: ScoutCard}) {
  return (
    <div className="card">
      <div className="number top-number">
        {props.card.isFlipped ? props.card.numberTwo : props.card.numberOne}
      </div>
      <div className="number bottom-number">
        {props.card.isFlipped ? props.card.numberOne : props.card.numberTwo}
      </div>
    </div>
  );
}
