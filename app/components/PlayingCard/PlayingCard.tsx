import Image from 'next/image';
import "./PlayingCard.scss";

export default function PlayingCard(props: { cardValue: string; onClick: any }) {
  return (
    <Image
      className={`playingCard${props.cardValue === "BLUE_BACK_ROTATE" ? " side" : " normal"}`}
      src={`/cards/${props.cardValue}.svg`}
      alt={props.cardValue}
      onClick={() => props.onClick(props.cardValue)}
    />
  );
}
