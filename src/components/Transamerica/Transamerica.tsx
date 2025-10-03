"use client";

import { useState, useRef, useEffect } from "react";
import { Button, Container } from "react-bootstrap";
import "./Transamerica.scss";
import _ from "lodash";
import Hex, { HexConnections } from "./Hex/Hex";
import { blankBoard, Tile } from "@/services/transamerica.service";

export default function Transamerica() {
    const [rowOffset, setRowOffset] = useState(0);
    const [colOffset, setColOffset] = useState(0);
    const [height, setheight] = useState(0);
    const [width, setWidth] = useState(0);

    const [gameGenerated, setGameGenerated] = useState(false);
    const [board2, setBoard2] = useState<Tile[][]>([]);
    const [hexCoords, setHexCoords] = useState<number[][]>([]);

    // const hexCoords = [];
    // for (let i = 0; i < height; i++) {
    //     for (let j = 0; j < width; j++) {
    //         hexCoords.push([i, j]);
    //     }
    // }

    //const rowOffset = _.max(hexCoords.filter((x) => x[0] < 0).map((x) => Math.abs(x[0]))) ?? 0;
    //const colOffset = _.max(hexCoords.filter((x) => x[1] < 0).map((x) => Math.abs(x[1]))) ?? 0;

    function generateBoard() {
        const boardDetails = blankBoard();

        setGameGenerated(true);
        setBoard2(boardDetails.board);
        setRowOffset(boardDetails.rowOffset);
        setColOffset(boardDetails.colOffset);
        setWidth(boardDetails.width);
        setheight(boardDetails.height);
        setHexCoords(boardDetails.hexCoords);
    }

    // function shuffle<T>(array: T[]) {
    //     for (let i = array.length - 1; i > 0; i--) {
    //         let j = Math.floor(Math.random() * (i + 1));
    //         [array[i], array[j]] = [array[j], array[i]];
    //     }
    //     return array;
    // }

    // function getAdjacentValues(board: Tile[][], coords: number[]) {
    //     const boardHeight = board.length;
    //     const boardWidth = board[0].length;
    //     const adjTransforms = [
    //         [
    //             [0, 1],
    //             [-1, 1],
    //             [-1, 0],
    //             [0, -1],
    //             [1, 0],
    //             [1, 1],
    //         ],
    //         // odd rows
    //         [
    //             [0, 1],
    //             [-1, 0],
    //             [-1, -1],
    //             [0, -1],
    //             [1, -1],
    //             [1, 0],
    //         ],
    //     ];
    //     const relevantTransforms = adjTransforms[Math.abs(coords[0]) % 2];
    //     const adjCoords = relevantTransforms
    //         .map((mod) => [coords[0] + mod[0], coords[1] + mod[1]])
    //         .filter((coord) => coord[0] >= 0 && coord[0] < boardHeight && coord[1] >= 0 && coord[1] < boardWidth);

    //     return adjCoords.map((coord) => ({ i: coord[0], j: coord[1], tile: board[coord[0]][coord[1]] }));
    // }

    // function handleClick(e: MouseEvent<HTMLElement>, i: number, j: number) {
    //     e.preventDefault();
    //     if (isGameFinished) return;
    //     if (e.nativeEvent.button === 0) {
    //         leftClickTile(i, j);
    //     } else {
    //         rightClickTile(i, j);
    //     }
    //     if (
    //         board.current
    //             .flat()
    //             .filter((t) => t.value !== -1)
    //             .every((t) => t.isRevealed)
    //     ) {
    //         setShow(true);
    //         setIsGameFinished(true);
    //     }
    //     setClicks(clicks + 1);
    // }

    // function leftClickTile(i: number, j: number) {
    //     const tile = board.current[i][j];
    //     if (tile.hasFlag || tile.hasQ) {
    //         return;
    //     }
    //     if (tile.value === -1) {
    //         board.current[i][j].isRevealed = true;
    //         if (clicks === 0) {
    //             setShowFail(true);
    //         }
    //         setIsGameFinished(true);
    //         setIsLost(true);
    //     } else {
    //         openSquares([i, j]);
    //     }
    // }

    // function openSquares(startCoord: number[]) {
    //     const visited: string[] = [];
    //     const coordStack = [startCoord];

    //     while (coordStack.length) {
    //         let currentCoord = coordStack.pop();

    //         if (currentCoord !== undefined) {
    //             const stringCoord = `${currentCoord[0]}-${currentCoord[1]}`;
    //             if (!visited.includes(stringCoord)) {
    //                 visited.push(stringCoord);
    //                 board.current[currentCoord[0]][currentCoord[1]].isRevealed = true;

    //                 if (board.current[currentCoord[0]][currentCoord[1]].value === 0) {
    //                     const adjs = getAdjacentValues(board.current, currentCoord);
    //                     coordStack.push(...adjs.map((adj) => [adj.i, adj.j]));
    //                 }
    //             }
    //         }
    //     }
    // }

    // function rightClickTile(i: number, j: number) {
    //     const tile = board.current[i][j];
    //     if (tile.hasFlag) {
    //         board.current[i][j].hasFlag = false;
    //         board.current[i][j].hasQ = true;
    //     } else if (tile.hasQ) {
    //         board.current[i][j].hasFlag = false;
    //         board.current[i][j].hasQ = false;
    //     } else {
    //         board.current[i][j].hasFlag = true;
    //         board.current[i][j].hasQ = false;
    //     }
    // }

    // const buttonsDisabled = !(
    //     controlIsValid(widthString) &&
    //     controlIsValid(heightString) &&
    //     controlIsValid(mineCountString) &&
    //     mineCount <= width * height &&
    //     (!gameGenerated || isGameFinished)
    // );

    // function hideToast() {
    //     setShowFail(false);
    //     setShow(false);
    // }

    const radius = 70;
    const hexContainerStyle = { height: radius * (height-1), width: radius * width * 2.9 };

    return (
        <Container>
            <Button
                variant="secondary"
                className="ms-2"
                onClick={generateBoard}
            >
                Reset Board
            </Button>
            {gameGenerated ? (<div className="hex-container" style={hexContainerStyle}>
                {hexCoords.map((x) => {
                    const tile = board2[x[0]][x[1]];

                    if (!tile) return;

                    return (
                        <Hex key={`pz${x[0]}-${x[1]}`}
                            row={x[0]}
                            column={x[1]}
                            rowOffset={rowOffset}
                            columnOffset={colOffset}
                            radius={radius}
                            connections={tile.connections} />
                    );
                })}
            </div>) : null}
        </Container>
    );
}
