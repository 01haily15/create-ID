export function renderModal(container, spot) {
  if (!spot) {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = `
    <div class="modal-backdrop" data-action="close-modal">
      <article class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <button class="icon-button close" data-action="close-modal" aria-label="닫기">×</button>
        <p class="eyebrow">${spot.title}</p>
        <h2 id="modal-title">${spot.place} 명장면 매칭</h2>
        <div class="compare">
          <div class="compare-pane real">
            <span>현재 여행지</span>
          </div>
          <div class="compare-pane film" style="--spot-color: ${spot.color}">
            <span>작품 속 장면</span>
          </div>
        </div>
        <p>${spot.scene}</p>
      </article>
    </div>
  `;
}
