import { type CellData } from "./types";

export function checkWin(board: CellData[][]): boolean {
   for (const row of board) {
      for (const cell of row) {
         if (!cell.isMine && !cell.isRevealed) {
            return false;
         }
      }
   }

   return true;
}