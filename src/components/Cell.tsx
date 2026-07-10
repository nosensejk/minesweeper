import { type CellData } from "../game/types";
import { Flag, Bomb } from "lucide-react";

type CellProps = {
  cell: CellData;
  onClick: () => void;
  onRightClick: () => void;
};

// Цвета цифр для темных тем
const numberColors = {
  1: "#38bdf8", // Голубой
  2: "#4ade80", // Зеленый
  3: "#f87171", // Красный
  4: "#c084fc", // Фиолетовый
  5: "#fb923c", // Оранжевый
  6: "#2dd4bf",
  7: "#e2e8f0",
  8: "#94a3b8",
};

function Cell({ cell, onClick, onRightClick }: CellProps) {
  let content: React.ReactNode = "";

  if (cell.isFlagged) {
    content = <Flag size={18} fill="currentColor" className="text-red-500" />;
  } else if (cell.isRevealed) {
    if (cell.isMine) {
      content = <Bomb size={20} fill="currentColor" />;
    } else if (cell.adjacentMines > 0) {
      content = String(cell.adjacentMines);
    }
  }

  return (
    <button
      className={cell.isRevealed ? "cell revealed" : "cell"}
      onClick={onClick}
      onContextMenu={(e) => {
        e.preventDefault();
        onRightClick();
      }}
      style={{
        color:
          cell.isRevealed && cell.adjacentMines > 0
            ? numberColors[cell.adjacentMines as keyof typeof numberColors]
            : undefined,
      }}
    >
      {content}
    </button>
  );
}

export default Cell;