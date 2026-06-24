export function renderRoutePanel(container, routeSpots, isOpen) {
  container.classList.toggle("is-open", isOpen);
  const body = routeSpots.length
    ? routeSpots.map((spot, index) => `
        <li>
          <span>${index + 1}</span>
          <button data-action="select-spot" data-spot-id="${spot.id}">
            <strong>${spot.place}</strong>
            <small>${spot.city} · ${spot.title}</small>
          </button>
        </li>
      `).join("")
    : `<li class="route-empty">마음에 드는 촬영지를 루트에 추가해보세요.</li>`;

  container.innerHTML = `
    <div class="route-head">
      <div>
        <p class="eyebrow">Bucket route</p>
        <h2>나만의 성지순례 루트</h2>
      </div>
      <button class="icon-button" data-action="clear-route" title="루트 비우기" aria-label="루트 비우기">×</button>
    </div>
    <ol class="route-list">${body}</ol>
  `;
}
