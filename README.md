# Cinema Seat Manager (TypeScript + HTML + Tailwind CDN)

This project implements an interactive purchasing app for a small theater with 80 seats in an 8 x 10 matrix.

## Features

- Reserve a seat.
- Display count of available seats.
- Find 2 horizontally adjacent available seats.
- Display seat grid with theater-style labels (A1 to H10).
- Keep internal seat states as `0` (available) and `1` (occupied), then map to UI symbols `L` and `X`.
- Display screen indicator aligned to row 0.
- Validate seat availability before purchase.
- Validate adjacency when reserving 2 seats for couples.

The seat logic is implemented with arrays + functions only (no classes).

## Run the web app

```bash
npm install
npm run dev
```

Open the local Vite URL in your browser.

## Run CLI logic demonstration

```bash
npm run console
```

This command prints a non-interactive sequence that demonstrates:

- seat reservation
- unavailable seat validation
- adjacent pair search
- couple purchase adjacency validation
- final seat grid and available seat count

## TypeScript validation

```bash
npm run typecheck
```

## Main files

- `index.html`: HTML shell + Tailwind CDN.
- `src/seatManager.ts`: pure seat-management logic.
- `src/main.ts`: fully interactive browser UI.
- `src/cli-demo.ts`: non-interactive CLI logic demo.
