import { type CellData } from "./types";

export function revealAllMines(board: CellData[][]) {
    for (const row of board) {
      for (const cell of row) {
        if (cell.isMine) {
          cell.isRevealed = true;
        }
      }
    }
  }