import Cell from "./components/Cell";
import { useState, useEffect } from "react";
import { createBoard } from "./game/createBoard";
import { revealCell } from "./game/revealCell";
import { revealAllMines } from "./game/revealAllMines";
import { toggleFlag } from "./game/toggleFlag";
import { checkWin } from "./game/checkWin";
import { type Difficulty, DIFFICULTIES } from "./game/difficulties";

// Import NEW icons and existing ones
import {
  Pickaxe,
  Flag,
  Smile,
  XCircle,
  PartyPopper,
  Timer,
} from "lucide-react";

type Theme = "glass" | "cyberpunk" | "retro";
type GameTool = "dig" | "flag";

function App() {
  const [gameOver, setGameOver] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [theme, setTheme] = useState<Theme>("glass");
  const [activeTool, setActiveTool] = useState<GameTool>("dig");

  const [time, setTime] = useState(0);
  const [isFirstMove, setIsFirstMove] = useState(true);

  const settings = DIFFICULTIES[difficulty];
  const [board, setBoard] = useState(() =>
    createBoard(settings.rows, settings.cols, settings.mines),
  );

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (isFirstMove || gameOver || hasWon) {
      return;
    }

    const interval = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime >= 999) {
          clearInterval(interval);
          return 999;
        }
        return prevTime + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isFirstMove, gameOver, hasWon]);

  function handleCellClick(row: number, col: number) {
    if (gameOver || hasWon) return;

    if (activeTool === "flag") {
      handleRightClick(row, col);
      return;
    }

    if (isFirstMove) {
      setIsFirstMove(false);
    }

    const newBoard = board.map((currentRow) =>
      currentRow.map((cell) => ({ ...cell })),
    );

    const clickedCell = newBoard[row][col];
    if (clickedCell.isFlagged || clickedCell.isRevealed) return;

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
      currentRow.map((cell) => ({ ...cell })),
    );

    if (newBoard[row][col].isRevealed) return;

    toggleFlag(newBoard, row, col);
    setBoard(newBoard);
  }

  function resetGame(newDifficulty = difficulty) {
    const config = DIFFICULTIES[newDifficulty];
    setBoard(createBoard(config.rows, config.cols, config.mines));
    setGameOver(false);
    setHasWon(false);

    setTime(0);
    setIsFirstMove(true);
  }

  const flagsPlaced = board.flat().filter((cell) => cell.isFlagged).length;
  const minesLeft = settings.mines - flagsPlaced;

  // 1. Calculate Face Icon component
  let faceIcon = <Smile size={32} className="text-white" />;
  if (gameOver) {
    faceIcon = <XCircle size={32} className="text-white" />;
  } else if (hasWon) {
    faceIcon = <PartyPopper size={32} className="text-white" />;
  }

  // 2. Define Status Content component
  let statusContent = (
    <>
      <span>Playing</span>
    </>
  );
  if (gameOver) {
    statusContent = (
      <>
        <span>Game Over</span>
      </>
    );
  } else if (hasWon) {
    statusContent = (
      <>
        <span>You Won!</span>
      </>
    );
  }

  return (
    <div className="app" data-theme={theme}>
      <div className="game-panel">
        <div className="counter">
          {/* REPLACE Flag emoji with Icon */}
          <Flag size={22} className="text-red-500" />
          <span>{String(minesLeft)}</span>
        </div>

        {/* REPLACE emoji face with dynamic icon */}
        <button className="reset-button" onClick={() => resetGame()}>
          {faceIcon}
        </button>

        <div className="counter">
          {/* REPLACE Timer emoji with Icon */}
          <Timer size={22} className="text-sky-400" />
          <span>{String(time)}</span>
        </div>
      </div>

      {/* REPLACE emoji and text with dynamic content */}
      <h2 className="status">{statusContent}</h2>

      <div style={{ display: "flex", gap: "10px" }}>
        <select
          value={difficulty}
          className="difficulty-select"
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

        <select
          value={theme}
          className="difficulty-select"
          onChange={(e) => setTheme(e.target.value as Theme)}
        >
          <option value="glass">💎 Glass</option>
          <option value="cyberpunk">🔮 Cyberpunk</option>
          <option value="retro">💾 Retro</option>
        </select>
      </div>

      <div className="mobile-tools">
        <button
          className={`tool-button ${activeTool === "dig" ? "active" : ""}`}
          onClick={() => setActiveTool("dig")}
        >
          <Pickaxe size={20} />
          <span>Открыть</span>
        </button>
        <button
          className={`tool-button ${activeTool === "flag" ? "active" : ""}`}
          onClick={() => setActiveTool("flag")}
        >
          <Flag size={20} />
          <span>Флаг</span>
        </button>
      </div>

      <div className="board-container">
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
    </div>
  );
}

export default App;
