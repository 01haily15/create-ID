const landShapes = [
  "M158 248 C132 180 188 96 282 114 C344 78 420 116 410 188 C466 220 438 312 344 314 C292 366 184 330 158 248Z",
  "M398 208 C466 128 596 152 640 230 C714 244 750 330 690 382 C708 458 584 488 526 414 C438 448 356 350 398 272Z",
  "M588 122 C658 66 784 94 826 174 C896 198 904 286 838 328 C842 404 724 438 668 374 C596 382 546 300 584 226Z",
  "M338 384 C414 326 522 354 562 432 C630 464 616 548 542 564 C492 626 380 588 366 506 C306 482 284 426 338 384Z",
  "M664 382 C722 328 818 358 844 432 C906 476 878 554 798 558 C744 616 636 574 658 492 C604 454 612 410 664 382Z"
];

const cloudShapes = [
  "M102 194 C188 120 286 178 356 146 C474 94 570 156 678 126 C760 104 822 132 878 172",
  "M126 312 C218 254 304 334 410 292 C526 246 618 296 720 250 C792 220 852 248 888 292",
  "M214 430 C306 392 394 444 480 406 C584 360 672 396 760 360",
  "M306 214 C348 172 420 174 454 222 C410 242 354 252 306 214",
  "M516 186 C584 134 682 172 696 246 C626 236 558 228 516 186",
  "M430 330 C506 286 604 310 640 380 C562 402 484 390 430 330"
];

const stars = [
  [36, 58, 1], [84, 118, 1.4], [126, 34, .8], [176, 498, 1.2], [216, 70, 1],
  [264, 520, .9], [318, 36, 1.3], [744, 44, 1.1], [810, 92, .8], [868, 42, 1.5],
  [884, 494, 1], [806, 520, 1.2], [70, 418, .8], [128, 386, 1.2], [856, 344, .9],
  [728, 506, .7], [682, 76, 1], [54, 292, 1.1], [894, 224, 1.2], [238, 24, .7]
];

export function renderMap(container, spots, state) {
  const routeSpots = state.routeIds
    .map((id) => spots.find((spot) => spot.id === id))
    .filter(Boolean);

  container.innerHTML = `
    <svg viewBox="0 0 920 560" role="img" aria-label="촬영지 세계 지도">
      <defs>
        <filter id="softGlow">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="earthShadow">
          <feDropShadow dx="18" dy="26" stdDeviation="18" flood-color="#000711" flood-opacity=".56" />
        </filter>
        <filter id="cloudBlur">
          <feGaussianBlur stdDeviation="1.4" />
        </filter>
        <radialGradient id="spaceGlow" cx="38%" cy="35%" r="70%">
          <stop offset="0%" stop-color="#213a68" />
          <stop offset="58%" stop-color="#060a13" />
          <stop offset="100%" stop-color="#000000" />
        </radialGradient>
        <radialGradient id="earthWater" cx="34%" cy="26%" r="74%">
          <stop offset="0%" stop-color="#d8ecff" />
          <stop offset="22%" stop-color="#83b9f2" />
          <stop offset="62%" stop-color="#2f74c8" />
          <stop offset="100%" stop-color="#071326" />
        </radialGradient>
        <linearGradient id="landTexture" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#d6cba4" />
          <stop offset="48%" stop-color="#6f9f6d" />
          <stop offset="100%" stop-color="#1f5f55" />
        </linearGradient>
        <radialGradient id="earthShade" cx="30%" cy="26%" r="78%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity=".18" />
          <stop offset="48%" stop-color="#ffffff" stop-opacity="0" />
          <stop offset="72%" stop-color="#071326" stop-opacity=".26" />
          <stop offset="100%" stop-color="#01040a" stop-opacity=".94" />
        </radialGradient>
        <clipPath id="earthClip">
          <circle cx="448" cy="288" r="274" />
        </clipPath>
      </defs>
      <rect width="920" height="560" rx="28" class="earth-sky" />
      ${renderStars()}
      <g class="earth-view" filter="url(#earthShadow)">
        <circle cx="448" cy="288" r="274" fill="url(#earthWater)" />
        <g clip-path="url(#earthClip)">
          ${renderGrid()}
          ${landShapes.map((shape) => `<path d="${shape}" class="land" />`).join("")}
          ${cloudShapes.map((shape, index) => `<path d="${shape}" class="cloud-band cloud-${index}" />`).join("")}
          ${renderRoute(routeSpots)}
          ${spots.map((spot) => renderMarker(spot, state)).join("")}
          <circle cx="448" cy="288" r="274" fill="url(#earthShade)" class="earth-shade" />
          <ellipse cx="624" cy="318" rx="134" ry="248" class="night-falloff" />
        </g>
        <circle cx="448" cy="288" r="276" class="earth-rim" />
        <circle cx="448" cy="288" r="286" class="atmosphere" />
      </g>
    </svg>
  `;
}

function renderMarker(spot, state) {
  const isActive = spot.id === state.selectedId ? "is-active" : "";
  const isSaved = state.routeIds.includes(spot.id) ? "is-saved" : "";
  const { cx, cy } = projectSpot(spot);

  return `
    <g class="marker ${isActive} ${isSaved}" data-action="select-spot" data-spot-id="${spot.id}" tabindex="0" role="button" aria-label="${spot.title} ${spot.place}">
      <circle cx="${cx}" cy="${cy}" r="19" fill="${spot.color}" opacity=".2" filter="url(#softGlow)" />
      <circle cx="${cx}" cy="${cy}" r="8" fill="${spot.color}" />
      <text x="${cx + 16}" y="${cy - 13}">${spot.city}</text>
    </g>
  `;
}

function renderRoute(routeSpots) {
  if (routeSpots.length < 2) {
    return "";
  }

  const points = routeSpots.map((spot) => {
    const { cx, cy } = projectSpot(spot);
    return `${cx},${cy}`;
  });
  return `<polyline class="route-line" points="${points.join(" ")}" />`;
}

function projectSpot(spot) {
  return {
    cx: Math.round(174 + (spot.x / 100) * 548),
    cy: Math.round(70 + (spot.y / 100) * 436)
  };
}

function renderGrid() {
  const meridians = [214, 320, 426, 532, 638]
    .map((x) => `<path class="earth-grid" d="M${x} 42 C${x - 72} 184 ${x - 72} 390 ${x} 540" />`)
    .join("");
  const parallels = [134, 210, 288, 366, 442]
    .map((y) => `<path class="earth-grid" d="M178 ${y} C310 ${y - 58} 586 ${y - 58} 720 ${y}" />`)
    .join("");

  return meridians + parallels;
}

function renderStars() {
  return stars
    .map(([cx, cy, r]) => `<circle class="star" cx="${cx}" cy="${cy}" r="${r}" />`)
    .join("");
}
