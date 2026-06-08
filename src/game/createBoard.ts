import { type CellData } from "./types";
import { placeMines } from "./placeMines";
import { calculateNumbers } from "./calculateNumbers";

export function createBoard(rows: number, cols: number, minesCount: number): CellData[][] {
  const board: CellData[][] = [];

  for (let row = 0; row < rows; row++) {
    const currentRow: CellData[] = [];

    for (let col = 0; col < cols; col++) {
      currentRow.push({
        row,
        col,
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        adjacentMines: 0,
      });
    }

    board.push(currentRow);
  }

  placeMines(board, minesCount);
  calculateNumbers(board);

  return board;
}
