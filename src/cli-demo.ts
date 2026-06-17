import {
  CINEMA_COLS,
  CINEMA_ROWS,
  countAvailableSeats,
  createSeating,
  findTwoAdjacentSeats,
  formatSeatingGrid,
  reserveCoupleSeats,
  reserveSeat,
  seatLabel,
} from "./seatManager";

const seating = createSeating();

console.log("Cinema Seat Manager - CLI Demonstration");
console.log("--------------------------------------");
console.log(`Total seats: ${CINEMA_ROWS * CINEMA_COLS}`);
console.log(`Available seats at start: ${countAvailableSeats(seating)}`);
console.log();
console.log(formatSeatingGrid(seating));
console.log();

const singleActions: [number, number][] = [
  [0, 0],
  [0, 1],
  [7, 9],
];

for (let i = 0; i < singleActions.length; i += 1) {
  const row = singleActions[i][0];
  const col = singleActions[i][1];
  const result = reserveSeat(seating, row, col);
  console.log(result[1]);
}

console.log();
console.log("Trying to buy an already reserved seat:");
console.log(reserveSeat(seating, 0, 0)[1]);

console.log();
console.log("Trying invalid couple request from the last column:");
console.log(reserveCoupleSeats(seating, 2, CINEMA_COLS - 1)[1]);

console.log();
const pair = findTwoAdjacentSeats(seating);

if (pair[0] === -1) {
  console.log("No adjacent seats available for a couple.");
} else {
  console.log(
    `First adjacent seats found: ${seatLabel(pair[0], pair[1])} and ${seatLabel(pair[0], pair[2])}`,
  );
  console.log(reserveCoupleSeats(seating, pair[0], pair[1])[1]);
}

console.log();
console.log(`Available seats after purchases: ${countAvailableSeats(seating)}`);
console.log();
console.log(formatSeatingGrid(seating));