export function renderDetailsPanel(container, spot, isSaved) {
  if (!spot) {
    container.innerHTML = `
      <div class="empty-state">
        <p class="eyebrow">Select a marker</p>
        <h2>지도 위 빛나는 촬영지를 눌러보세요.</h2>
        <p>장면, 이동 팁, 비교 보기, 나만의 루트 저장까지 한 번에 확인할 수 있습니다.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <article class="spot-card">
      <div class="spot-art" style="--spot-color: ${spot.color}">
        <span>${spot.genre}</span>
      </div>
      <div class="spot-copy">
        <p class="eyebrow">${spot.city}, ${spot.country}</p>
        <h2>${spot.place}</h2>
        <strong>${spot.title}</strong>
        <p>${spot.scene}</p>
        <blockquote>${spot.quote}</blockquote>
      </div>
      <dl class="spot-meta">
        <div><dt>무드</dt><dd>${spot.mood}</dd></div>
        <div><dt>이동</dt><dd>${spot.travelTime}</dd></div>
      </dl>
      <div class="panel-actions">
        <button data-action="open-modal" data-spot-id="${spot.id}">명장면 비교</button>
        <button class="secondary" data-action="toggle-bookmark" data-spot-id="${spot.id}">
          ${isSaved ? "루트에서 제거" : "루트에 추가"}
        </button>
      </div>
    </article>
  `;
}
