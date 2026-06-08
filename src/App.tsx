import Cell from "./components/Cell";
import { useState } from "react";
import { createBoard } from "./game/createBoard";
import { revealCell } from "./game/revealCell";
import { revealAllMines } from "./game/revealAllMines";
import { toggleFlag } from "./game/toggleFlag";
import { checkWin } from "./game/checkWin";
import { type Difficulty, DIFFICULTIES } from "./game/difficulties";

function App() {
  const [gameOver, setGameOver] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");

  const settings = DIFFICULTIES[difficulty];
  const [board, setBoard] = useState(() =>
    createBoard(settings.rows, settings.cols, settings.mines),
  );

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

  function resetGame(newDifficulty = difficulty) {
    const config = DIFFICULTIES[newDifficulty];
    setBoard(createBoard(config.rows, config.cols, config.mines));

    setGameOver(false);
    setHasWon(false);
  }

  const flagsPlaced = board.flat().filter((cell) => cell.isFlagged).length;
  const minesLeft = settings.mines - flagsPlaced;

  const face = gameOver
  ? "😵"
  : hasWon
  ? "😎"
  : "🙂";

  return (
    <div className="app">
      <div className="game-panel">
        <div className="counter">🚩 {minesLeft}</div>

        <button className="reset-button" onClick={() => resetGame()}>
          {face}
        </button>

        <div className="counter">⏱ 0</div>
      </div>
      <h2 className="status">{gameOver ? "💥 Game Over" : hasWon ? "🎉 You Won!" : "Playing"}</h2>
      <select
        value={difficulty}
        className="difficulty"
        onChange={(e) => {
          const value = e.target.value as Difficulty;
          setDifficulty(value);
          resetGame(value);
        }}
      >
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
      <div
        className="board"
        style={{ gridTemplateColumns: `repeat(${settings.cols}, 40px)` }}
      >
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
