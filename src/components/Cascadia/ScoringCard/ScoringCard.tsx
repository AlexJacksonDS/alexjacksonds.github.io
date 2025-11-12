import { ScoringCard } from "@/types/cascadia";
import "./ScoringCard.scss";

export default function ScoringCardDisplay({ card }: { card: ScoringCard }) {
  return (
    <div className="scoring-card">
      <p className="title">{card.title}</p>
      <p>{card.scoringCriteria}</p>
      <p>{card.scores}</p>
    </div>
  );
}
