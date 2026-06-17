export const CINEMA_ROWS = 8;
export const CINEMA_COLS = 10;

export type SeatingGrid = number[][];

const AVAILABLE = 0;
const RESERVED = 1;

const toRowLetter = (row: number): string => String.fromCharCode(65 + row);

export const seatLabel = (row: number, col: number): string =>
  `${toRowLetter(row)}${col + 1}`;

export const seatValueToUiSymbol = (seatValue: number): string => {
  if (seatValue === AVAILABLE) {
    return "L";
  }

  if (seatValue === RESERVED) {
    return "X";
  }

  return "?";
};

export const createSeating = (): SeatingGrid => {
  const seating: SeatingGrid = [];

  for (let row = 0; row < CINEMA_ROWS; row += 1) {
    const rowSeats: number[] = [];
    for (let col = 0; col < CINEMA_COLS; col += 1) {
      rowSeats.push(AVAILABLE);
    }
    seating.push(rowSeats);
  }

  return seating;
};

export const isValidSeat = (row: number, col: number): boolean =>
  row >= 0 && row < CINEMA_ROWS && col >= 0 && col < CINEMA_COLS;

export const isSeatAvailable = (seating: SeatingGrid, row: number, col: number): boolean => {
  if (!isValidSeat(row, col)) {
    return false;
  }

  return seating[row][col] === AVAILABLE;
};

export const reserveSeat = (
  seating: SeatingGrid,
  row: number,
  col: number,
): [boolean, string] => {
  if (!isValidSeat(row, col)) {
    return [false, "Seat position is out of range."];
  }

  if (!isSeatAvailable(seating, row, col)) {
    return [false, `Seat ${seatLabel(row, col)} is already reserved.`];
  }

  seating[row][col] = RESERVED;
  return [true, `Seat ${seatLabel(row, col)} reserved successfully.`];
};

export const countAvailableSeats = (seating: SeatingGrid): number => {
  let available = 0;

  for (let row = 0; row < CINEMA_ROWS; row += 1) {
    for (let col = 0; col < CINEMA_COLS; col += 1) {
      if (seating[row][col] === AVAILABLE) {
        available += 1;
      }
    }
  }

  return available;
};

export const findTwoAdjacentSeats = (seating: SeatingGrid): [number, number, number] => {
  for (let row = 0; row < CINEMA_ROWS; row += 1) {
    for (let col = 0; col < CINEMA_COLS - 1; col += 1) {
      if (seating[row][col] === AVAILABLE && seating[row][col + 1] === AVAILABLE) {
        return [row, col, col + 1];
      }
    }
  }

  return [-1, -1, -1];
};

export const reserveCoupleSeats = (
  seating: SeatingGrid,
  row: number,
  leftCol: number,
): [boolean, string] => {
  const rightCol = leftCol + 1;

  if (!isValidSeat(row, leftCol) || !isValidSeat(row, rightCol)) {
    return [
      false,
      "Couple seats must start at a valid left position with one seat directly to the right.",
    ];
  }

  if (!isSeatAvailable(seating, row, leftCol) || !isSeatAvailable(seating, row, rightCol)) {
    return [
      false,
      `Cannot reserve couple seats. ${seatLabel(row, leftCol)} and ${seatLabel(row, rightCol)} must both be available.`,
    ];
  }

  seating[row][leftCol] = RESERVED;
  seating[row][rightCol] = RESERVED;

  return [
    true,
    `Couple seats reserved: ${seatLabel(row, leftCol)} and ${seatLabel(row, rightCol)}.`,
  ];
};

export const formatSeatingGrid = (seating: SeatingGrid): string => {
  const lines: string[] = [];
  lines.push("SCREEN -> ROW 0");

  let header = "    ";
  for (let col = 0; col < CINEMA_COLS; col += 1) {
    header += `${String(col + 1).padStart(2, " ")} `;
  }
  lines.push(header);

  for (let row = 0; row < CINEMA_ROWS; row += 1) {
    let rowLine = `${toRowLetter(row)} | `;

    for (let col = 0; col < CINEMA_COLS; col += 1) {
      rowLine += `${seatValueToUiSymbol(seating[row][col])}  `;
    }

    lines.push(rowLine.trimEnd());
  }

  return lines.join("\n");
};