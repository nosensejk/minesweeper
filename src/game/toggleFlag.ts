import { type CellData } from "./types";

export function toggleFlag(board: CellData[][], row: number, col: number) {
   const cell = board[row][col];
   if(cell.isRevealed) return;
   cell.isFlagged = !cell.isFlagged;
}