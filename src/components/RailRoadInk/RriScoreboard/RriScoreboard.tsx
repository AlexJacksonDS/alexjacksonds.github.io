"use client";
import { Table } from "react-bootstrap";

export function RriScoreboard({
  connectionScore, roadScore, railScore, centreScore, mistakeScore,
}: {
  connectionScore: number;
  roadScore: number;
  railScore: number;
  centreScore: number;
  mistakeScore: number;
}) {
  const totalScore = connectionScore + roadScore + railScore + centreScore - mistakeScore;
  return (
    <Table responsive bordered size="sm">
      <thead>
        <tr>
          <th>Connections</th>
          <th>Road</th>
          <th>Rail</th>
          <th>Centre</th>
          <th>Mistakes</th>
          <th>Total Score</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{connectionScore}</td>
          <td>{roadScore}</td>
          <td>{railScore}</td>
          <td>{centreScore}</td>
          <td>
            {mistakeScore ? "-" : ""}
            {mistakeScore}
          </td>
          <td>{totalScore}</td>
        </tr>
      </tbody>
    </Table>
  );
}
