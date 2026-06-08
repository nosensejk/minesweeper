import Cell from "./components/Cell";
import { useState } from "react";
import { createBoard } from "./game/createBoard";
import { revealCell } from "./game/revealCell";
import { revealAllMines } from "./game/revealAllMines";
import { toggleFlag } from "./game/toggleFlag";
import { checkWin } from "./game/checkWin";

function App() {
  const [board, setBoard] = useState(() => createBoard(9, 9, 10));
  const [gameOver, setGameOver] = useState(false);
  const [hasWon, setHasWon] = useState(false);

  function handleCellClick(row: number, col: number) {
    if (gameOver || hasWon) return;

    const newBoard = board.map((currentRow) =>
      currentRow.map((cell) => ({
        ...cell,
      })),
    );

    const clickedCell = newBoard[row][col];
    if (clickedCell.isFlagged) return;

    if (clickedCell.isMine) {
      revealAllMines(newBoard);

      setBoard(newBoard);
      setGameOver(true);
      return;
    }

    revealCell(newBoard, row, col);
    if (checkWin(newBoard)) {
      setHasWon(true);
    }
    setBoard(newBoard);
  }

  function handleRightClick(row: number, col: number) {
    if (gameOver || hasWon) return;

    const newBoard = board.map((currentRow) =>
      currentRow.map((cell) => ({
        ...cell,
      })),
    );

    toggleFlag(newBoard, row, col);
    setBoard(newBoard);
  }

  function resetGame() {
    setBoard(createBoard(9, 9, 10));

    setGameOver(false);
    setHasWon(false);
  }

  return (
    <div className="app">
      <h1>Сапёр</h1>
      <button onClick={resetGame}>New Game</button>
      <h2>
        {gameOver ? "💥 Game Over" : hasWon ? "🎉 You Won!" : "Playing"}
      </h2>
      <div className="board">
        {board.map((row) =>
          row.map((cell) => (
            <Cell
              key={`${cell.row}-${cell.col}`}
              cell={cell}
              onClick={() => handleCellClick(cell.row, cell.col)}
              onRightClick={() => handleRightClick(cell.row, cell.col)}
            />
          )),
        )}
      </div>
    </div>
  );
}

export default App;
