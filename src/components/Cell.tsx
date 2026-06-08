import { type CellData } from "../game/types";

type CellProps = {
  cell: CellData;
  onClick: () => void;
  onRightClick: () => void;
};

const numberColors = {
  1: "#0000ff",
  2: "#008000",
  3: "#ff0000",
  4: "#000080",
  5: "#800000",
  6: "#008080",
  7: "#000000",
  8: "#808080",
};

function Cell({ cell, onClick, onRightClick }: CellProps) {
  let content = "";

  if (cell.isFlagged) {
    content = "🚩";
  } else if (cell.isRevealed) {
    if (cell.isMine) {
      content = "💣";
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
