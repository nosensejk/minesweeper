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

export function calculateNumbers(board: CellData[][]) {
   for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
         const cell = board[row][col];
         if (cell.isMine) continue;

         let count = 0;

         for (const [dx, dy] of directions) {
            const newRow = row + dx;
            const newCol = col + dy;

            const neighbour = board[newRow]?.[newCol];
            if(neighbour?.isMine) {
               count++;
            }
         }
         cell.adjacentMines = count;
      }
   }
}
