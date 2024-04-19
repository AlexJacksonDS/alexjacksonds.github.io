import { ColourCards, PlayedCards, PlayerColour } from "@/types/catInTheBox";
import { Col, Container, Row } from "react-bootstrap";
import "./PlayedCards.scss";

export default function PlayedCards({
  playedCards,
  isBasicBoard,
  handleClick,
}: {
  playedCards: PlayedCards;
  isBasicBoard: boolean;
  handleClick: any;
}) {
  

  return (
    <Container>
      <Row className="red-row">
        {isBasicBoard ? null : (
          <>
            <Col className="board-col"></Col>
            <Col className="board-col"></Col>
            <Col className="board-col"></Col>
          </>
        )}
        <BoardRow rowDetails={playedCards.Red} handleClick={handleClick} colour={1}/>
      </Row>
      <Row className="blue-row">
        {isBasicBoard ? null : (
          <>
            <Col className="board-col"></Col>
            <Col className="board-col"></Col>
          </>
        )}
        <BoardRow rowDetails={playedCards.Blue}  handleClick={handleClick} colour={2}/>
        {isBasicBoard ? null : (
          <>
            <Col className="board-col"></Col>
          </>
        )}
      </Row>
      <Row className="yellow-row">
        {isBasicBoard ? null : <Col className="board-col"></Col>}
        <BoardRow rowDetails={playedCards.Yellow}  handleClick={handleClick} colour={3}/>
        {isBasicBoard ? null : (
          <>
            <Col className="board-col"></Col>
            <Col className="board-col"></Col>
          </>
        )}
      </Row>
      <Row className="green-row">
        <BoardRow rowDetails={playedCards.Green}  handleClick={handleClick} colour={4}/>
        {isBasicBoard ? null : (
          <>
            <Col className="board-col"></Col>
            <Col className="board-col"></Col>
            <Col className="board-col"></Col>
          </>
        )}
      </Row>
    </Container>
  );
}

function BoardRow({ rowDetails, handleClick, colour }: { rowDetails: ColourCards, handleClick: any, colour: number }) {
  return (
    <>
      <Col className="board-col filled-col" onClick={() => handleClick(1, colour)}>
        <CellContents colour={rowDetails[1]} value={1} />
      </Col>
      <Col className="board-col filled-col" onClick={() => handleClick(2, colour)}>
        <CellContents colour={rowDetails[2]} value={2} />
      </Col>
      <Col className="board-col filled-col" onClick={() => handleClick(3, colour)}>
        <CellContents colour={rowDetails[3]} value={3} />
      </Col>
      <Col className="board-col filled-col" onClick={() => handleClick(4, colour)}>
        <CellContents colour={rowDetails[4]} value={4} />
      </Col>
      <Col className="board-col filled-col" onClick={() => handleClick(5, colour)}>
        <CellContents colour={rowDetails[5]} value={5} />
      </Col>
      {rowDetails[6] ? (
        <Col className="board-col filled-col" onClick={() => handleClick(6, colour)}>
          <CellContents colour={rowDetails[6]} value={6} />
        </Col>
      ) : null}
      {rowDetails[7] ? (
        <Col className="board-col filled-col" onClick={() => handleClick(7, colour)}>
          <CellContents colour={rowDetails[7]} value={7} />
        </Col>
      ) : null}
      {rowDetails[8] ? (
        <Col className="board-col filled-col" onClick={() => handleClick(8, colour)}>
          <CellContents colour={rowDetails[8]} value={8} />
        </Col>
      ) : null}
      {rowDetails[9] ? (
        <Col className="board-col filled-col" onClick={() => handleClick(9, colour)}>
          <CellContents colour={rowDetails[9]} value={9} />
        </Col>
      ) : null}
    </>
  );
}

function CellContents({ colour, value }: { colour: PlayerColour; value: number }) {
  function mapColour(playerColour: PlayerColour) {
    switch (playerColour) {
      case PlayerColour.Red:
        return "\uD83D\uDFE5";
      case PlayerColour.LightBlue:
        return "\uD83D\uDFE6";
      case PlayerColour.Yellow:
        return "\uD83D\uDFE8";
      case PlayerColour.Teal:
        return "\uD83D\uDFE9";
      case PlayerColour.Purple:
        return "\uD83D\uDFEA";
    }
  }

  return <div className="board-square">{colour === PlayerColour.Unselected ? value : mapColour(colour)}</div>;
}
