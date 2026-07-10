import Cell from "./components/Cell";
import { useState, useEffect } from "react";
import { createBoard } from "./game/createBoard";
import { revealCell } from "./game/revealCell";
import { revealAllMines } from "./game/revealAllMines";
import { toggleFlag } from "./game/toggleFlag";
import { checkWin } from "./game/checkWin";
import { type Difficulty, DIFFICULTIES } from "./game/difficulties";
// Импортируем иконки для мобильного переключателя
import { Pickaxe, Flag } from "lucide-react";

type Theme = "glass" | "cyberpunk" | "retro";
type GameTool = "dig" | "flag"; // Наш новый тип инструмента

function App() {
  const [gameOver, setGameOver] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [theme, setTheme] = useState<Theme>("glass");
  const [activeTool, setActiveTool] = useState<GameTool>("dig"); // По умолчанию копаем

  const settings = DIFFICULTIES[difficulty];
  const [board, setBoard] = useState(() =>
    createBoard(settings.rows, settings.cols, settings.mines),
  );

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  // Модифицируем клик: теперь он учитывает выбранный мобильный инструмент
  function handleCellClick(row: number, col: number) {
    if (gameOver || hasWon) return;

    // Если на телефоне выбран режим флага — перенаправляем на правый клик
    if (activeTool === "flag") {
      handleRightClick(row, col);
      return;
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

    // Не даем ставить флаг на уже открытую ячейку
    if (newBoard[row][col].isRevealed) return;

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
  const face = gameOver ? "😵" : hasWon ? "😎" : "🙂";

  return (
    <div className="app" data-theme={theme}>
      <div className="game-panel">
        <div className="counter">🚩 {minesLeft}</div>
        <button className="reset-button" onClick={() => resetGame()}>
          {face}
        </button>
        <div className="counter">⏱ 0</div>
      </div>

      <h2 className="status">
        {gameOver ? "💥 Game Over" : hasWon ? "🎉 You Won!" : "Playing"}
      </h2>

      {/* Панель выбора сложности и темы */}
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

      {/* НОВАЯ: Мобильная панель инструментов */}
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

      {/* Обертка для адаптивного скролла большой карты */}
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
