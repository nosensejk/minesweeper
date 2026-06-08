import { type CellData } from "./types";

const directions = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

export function revealCell(board: CellData[][], row: number, col: number) {
  const cell = board[row]?.[col];
  if (!cell) return;
  if (cell.isRevealed) return;
  if(cell.isFlagged) return;
  cell.isRevealed = true;
  if (cell.adjacentMines !== 0) return;

  for (const [dx, dy] of directions) {
   revealCell(board, row + dx, col + dy);
  }
}
