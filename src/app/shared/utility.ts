export function isCorner(r: number, c: number, row: number, col: number) {
  return (r === 0 && c === 0) || (r === 0 && c === col - 1)
    || (r === row - 1 && c === 0) || (r === row - 1 && c === col - 1);
}

export function isValidCell(r: number, c: number, row: number, col: number) {
  return r >= 0 && r < row && c >= 0 && c < col;
}

export function isEdge(r: number, c: number, row: number, col: number) {
  return (r === 0 && c > 0 && c < col - 1) || (r === row - 1 && c > 0 && c < col - 1)
    || (c === 0 && r > 0 && r < row - 1) || (c === col - 1 && r > 0 && r < row - 1);
}
