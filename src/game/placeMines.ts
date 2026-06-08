import { type CellData } from "./types";

export function placeMines(
   board: CellData[][],
   minesCount: number
) {
   let placed = 0;

   while( placed < minesCount){
      const row = Math.floor(
         Math.random() * board.length
      );

      const col = Math.floor(
         Math.random() * board[0].length
      );

      const cell = board[row][col];

      if(!cell.isMine) {
         cell.isMine = true;
         placed++;
      }
   }
}