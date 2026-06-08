export type CellData = {
  row: number;
  col: number;

  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;

  adjacentMines: number;
};
