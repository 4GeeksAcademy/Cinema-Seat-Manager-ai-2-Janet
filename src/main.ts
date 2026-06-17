import {
  CINEMA_COLS,
  CINEMA_ROWS,
  countAvailableSeats,
  createSeating,
  findTwoAdjacentSeats,
  reserveCoupleSeats,
  reserveSeat,
  seatLabel,
  seatValueToUiSymbol,
} from "./seatManager";

let seating = createSeating();
let purchaseMode = "single";
let highlightedRow = -1;
let highlightedColA = -1;
let highlightedColB = -1;

if (typeof document !== "undefined") {
  const app = document.querySelector<HTMLElement>("#app");

  if (app) {
    app.innerHTML = `
      <section class="mx-auto w-full max-w-6xl p-6">
        <header class="mb-6 rounded-2xl bg-slate-900 p-6 text-white shadow-lg">
          <h1 class="text-3xl font-bold">Cinema Seat Manager</h1>
          <p class="mt-2 text-slate-300">80 seats total (8 x 10), row 0 is closest to the screen.</p>
        </header>

        <section class="mb-5 rounded-2xl bg-white p-5 shadow-sm">
          <div class="flex flex-wrap gap-3">
            <button id="single-mode" class="rounded-lg border border-slate-300 px-4 py-2 font-semibold transition hover:bg-slate-50">Single Seat Mode</button>
            <button id="couple-mode" class="rounded-lg border border-slate-300 px-4 py-2 font-semibold transition hover:bg-slate-50">Couple Mode (2 Adjacent)</button>
            <button id="find-pair" class="rounded-lg bg-cyan-600 px-4 py-2 font-semibold text-white transition hover:bg-cyan-700">Find 2 Adjacent Seats</button>
            <button id="reset-all" class="rounded-lg bg-rose-600 px-4 py-2 font-semibold text-white transition hover:bg-rose-700">Reset Theater</button>
          </div>

          <div class="mt-4 grid gap-2 sm:grid-cols-2">
            <p id="mode-text" class="rounded-lg bg-slate-100 p-3 text-sm font-medium"></p>
            <p id="count-text" class="rounded-lg bg-emerald-100 p-3 text-sm font-semibold text-emerald-900"></p>
          </div>

          <p id="message-text" class="mt-3 rounded-lg bg-slate-100 p-3 text-sm text-slate-700"></p>
        </section>

        <section class="rounded-2xl bg-white p-5 shadow-sm">
          <div class="mx-auto mb-4 max-w-3xl rounded-full bg-slate-900 py-3 text-center text-sm font-bold tracking-widest text-white">
            SCREEN (ROW 0)
          </div>

          <div class="mb-3 text-sm text-slate-600">
            Legend: <span class="font-semibold text-emerald-700">L = Available</span> | <span class="font-semibold text-slate-800">X = Reserved</span> | <span class="font-semibold text-cyan-700">Suggested Pair</span>
          </div>

          <div id="seating-grid" class="overflow-x-auto"></div>
        </section>
      </section>
    `;

    const gridEl = document.querySelector<HTMLElement>("#seating-grid");
    const messageEl = document.querySelector<HTMLElement>("#message-text");
    const modeEl = document.querySelector<HTMLElement>("#mode-text");
    const countEl = document.querySelector<HTMLElement>("#count-text");
    const singleModeBtn = document.querySelector<HTMLButtonElement>("#single-mode");
    const coupleModeBtn = document.querySelector<HTMLButtonElement>("#couple-mode");
    const findPairBtn = document.querySelector<HTMLButtonElement>("#find-pair");
    const resetBtn = document.querySelector<HTMLButtonElement>("#reset-all");

    if (
      !gridEl ||
      !messageEl ||
      !modeEl ||
      !countEl ||
      !singleModeBtn ||
      !coupleModeBtn ||
      !findPairBtn ||
      !resetBtn
    ) {
      throw new Error("Failed to initialize the cinema UI.");
    }

    const clearSuggestion = () => {
      highlightedRow = -1;
      highlightedColA = -1;
      highlightedColB = -1;
    };

    const updateModeUI = () => {
      const isSingle = purchaseMode === "single";

      singleModeBtn.className = isSingle
        ? "rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white transition"
        : "rounded-lg border border-slate-300 px-4 py-2 font-semibold transition hover:bg-slate-50";
      coupleModeBtn.className = !isSingle
        ? "rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white transition"
        : "rounded-lg border border-slate-300 px-4 py-2 font-semibold transition hover:bg-slate-50";
      modeEl.textContent = isSingle
        ? "Mode: Single seat purchase"
        : "Mode: Couple purchase (must be 2 horizontal adjacent seats)";
    };

    const renderGrid = () => {
      const wrapper = document.createElement("div");
      wrapper.className = "inline-block min-w-full";

      const header = document.createElement("div");
      header.className = "mb-2 grid gap-2";
      header.style.gridTemplateColumns = `repeat(${CINEMA_COLS + 1}, minmax(0, 1fr))`;

      const cornerCell = document.createElement("span");
      cornerCell.className = "rounded-md bg-slate-200 p-2 text-center text-xs font-bold text-slate-600";
      cornerCell.textContent = "Row";
      header.append(cornerCell);

      for (let col = 0; col < CINEMA_COLS; col += 1) {
        const colLabel = document.createElement("span");
        colLabel.className = "rounded-md bg-slate-200 p-2 text-center text-xs font-bold text-slate-600";
        colLabel.textContent = String(col + 1);
        header.append(colLabel);
      }

      wrapper.append(header);

      for (let row = 0; row < CINEMA_ROWS; row += 1) {
        const rowWrap = document.createElement("div");
        rowWrap.className = "mb-2 grid gap-2";
        rowWrap.style.gridTemplateColumns = `repeat(${CINEMA_COLS + 1}, minmax(0, 1fr))`;

        const rowLabel = document.createElement("span");
        rowLabel.className = "rounded-md bg-slate-800 p-2 text-center text-xs font-bold text-white";
        rowLabel.textContent = String.fromCharCode(65 + row);
        rowWrap.append(rowLabel);

        for (let col = 0; col < CINEMA_COLS; col += 1) {
          const seatBtn = document.createElement("button");
          const taken = seating[row][col] === 1;
          const highlighted =
            highlightedRow === row && (highlightedColA === col || highlightedColB === col);

          seatBtn.type = "button";
          seatBtn.className = taken
            ? "rounded-md bg-slate-700 p-2 text-xs font-semibold text-white"
            : highlighted
              ? "rounded-md bg-cyan-500 p-2 text-xs font-semibold text-white"
              : "rounded-md bg-emerald-500 p-2 text-xs font-semibold text-white transition hover:bg-emerald-600";
          seatBtn.textContent = seatValueToUiSymbol(seating[row][col]);
          seatBtn.title = seatLabel(row, col);
          seatBtn.disabled = taken;
          seatBtn.addEventListener("click", () => {
            clearSuggestion();

            if (purchaseMode === "single") {
              const result = reserveSeat(seating, row, col);
              messageEl.textContent = result[1];
            } else {
              const result = reserveCoupleSeats(seating, row, col);
              messageEl.textContent = result[1];
            }

            refreshUI();
          });

          rowWrap.append(seatBtn);
        }

        wrapper.append(rowWrap);
      }

      gridEl.innerHTML = "";
      gridEl.append(wrapper);
    };

    const refreshUI = () => {
      countEl.textContent = `Available seats: ${countAvailableSeats(seating)} / ${CINEMA_ROWS * CINEMA_COLS}`;
      updateModeUI();
      renderGrid();
    };

    singleModeBtn.addEventListener("click", () => {
      purchaseMode = "single";
      clearSuggestion();
      messageEl.textContent = "Single seat mode activated.";
      refreshUI();
    });

    coupleModeBtn.addEventListener("click", () => {
      purchaseMode = "couple";
      clearSuggestion();
      messageEl.textContent =
        "Couple mode activated. Click the left seat of the pair to reserve 2 adjacent seats.";
      refreshUI();
    });

    findPairBtn.addEventListener("click", () => {
      const pair = findTwoAdjacentSeats(seating);

      if (pair[0] === -1) {
        clearSuggestion();
        messageEl.textContent = "No adjacent horizontal pair is available.";
      } else {
        highlightedRow = pair[0];
        highlightedColA = pair[1];
        highlightedColB = pair[2];
        messageEl.textContent = `Suggested adjacent seats: ${seatLabel(pair[0], pair[1])} and ${seatLabel(pair[0], pair[2])}.`;
      }

      refreshUI();
    });

    resetBtn.addEventListener("click", () => {
      seating = createSeating();
      clearSuggestion();
      messageEl.textContent = "Theater reset complete. All seats are available.";
      refreshUI();
    });

    messageEl.textContent = "Pick a seat or use Find 2 Adjacent Seats.";
    refreshUI();
  }
}
