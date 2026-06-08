import { type CellData } from "../game/types";

type CellProps = {
  cell: CellData;
  onClick: () => void;
  onRightClick: () => void;
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
    >
      {content}
    </button>
  );
}

export default Cell;
