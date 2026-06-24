export function renderFilterButtons(container, values, activeValue, groupName) {
  container.innerHTML = values
    .map((value) => {
      const isActive = value === activeValue ? "is-active" : "";
      return `<button class="${isActive}" data-filter-group="${groupName}" data-filter-value="${value}">${value}</button>`;
    })
    .join("");
}
