import { PlayerPlayerScores } from "@/types/cascadia";
import "./ScoreBoard.scss";
import { Table } from "react-bootstrap";

export default function ScoreBoard({ playerScores }: { playerScores: PlayerPlayerScores[] }) {
  return (
    <Table striped bordered size="sm" responsive>
      <thead>
        <tr>
          <th>Name</th>
          <th>Bear</th>
          <th>Elk</th>
          <th>Hawk</th>
          <th>Salmon</th>
          <th>Fox</th>
          <th>Wildlife Total</th>
          <th>Mountains</th>
          <th>Forest</th>
          <th>Prarie</th>
          <th>River</th>
          <th>Wetlands</th>
          <th>Habitat Total</th>
          <th>Nature</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        {playerScores.map((ps, i) => (
          <PlayerRow key={i} ps={ps} />
        ))}
      </tbody>
    </Table>
  );
}

function PlayerRow({ ps }: { ps: PlayerPlayerScores }) {
  const animalScore = ps.bearScore + ps.elkScore + ps.hawkScore + ps.salmonScore + ps.foxScore;
  const habitatScore =
    ps.mountainScore +
    ps.mountainBonusScore +
    ps.forestScore +
    ps.forestBonusScore +
    ps.prarieScore +
    ps.prarieBonusScore +
    ps.riverScore +
    ps.riverBonusScore +
    ps.wetlandsScore +
    ps.wetlandsBonusScore;

  return (
    <tr>
      <th>{ps.name}</th>
      <th>{ps.bearScore}</th>
      <th>{ps.elkScore}</th>
      <th>{ps.hawkScore}</th>
      <th>{ps.salmonScore}</th>
      <th>{ps.foxScore}</th>
      <th>{animalScore}</th>
      <th>
        {ps.mountainScore} / {ps.mountainBonusScore}
      </th>
      <th>
        {ps.forestScore} / {ps.forestBonusScore}
      </th>
      <th>
        {ps.prarieScore} / {ps.prarieBonusScore}
      </th>
      <th>
        {ps.riverScore} / {ps.riverBonusScore}
      </th>
      <th>
        {ps.wetlandsScore} / {ps.wetlandsBonusScore}
      </th>
      <th>{habitatScore}</th>
      <th>{ps.natureScore}</th>
      <th>{ps.natureScore + animalScore + habitatScore}</th>
    </tr>
  );
}
