import "./PlayingCard.scss";

export default function PlayingCard(props: { cardValue: string; onClick: any }) {
  return (
    <img
      className={`playingCard${props.cardValue === "BLUE_BACK_ROTATE" ? " side" : " normal"}`}
      src={`/cards/${props.cardValue}.svg`}
      alt={props.cardValue}
      onClick={() => props.onClick(props.cardValue)}
    />
  );
}
