import { spots, titles, genres } from "./utils/data.js";
import { getFilteredSpots } from "./utils/filter.js";
import { loadRoute, saveRoute } from "./utils/storage.js";
import { renderFilterButtons } from "./components/filters.js";
import { renderMap } from "./components/map.js";
import { renderDetailsPanel } from "./components/detailsPanel.js";
import { renderRoutePanel } from "./components/routePanel.js";
import { renderModal } from "./components/modal.js";

const state = {
  selectedId: spots[0].id,
  title: "전체",
  genre: "전체",
  keyword: "",
  routeIds: [],
  isRouteOpen: true,
  modalSpotId: null
};

const elements = {
  app: document.querySelector("#app"),
  search: document.querySelector("#search-input"),
  titleFilters: document.querySelector("#title-filters"),
  genreFilters: document.querySelector("#genre-filters"),
  map: document.querySelector("#map-root"),
  detail: document.querySelector("#detail-panel"),
  route: document.querySelector("#route-panel"),
  modal: document.querySelector("#modal-root"),
  routeCount: document.querySelector("#route-count"),
  resultCount: document.querySelector("#result-count")
};

async function init() {
  state.routeIds = await loadRoute();
  bindEvents();
  render();
}

function bindEvents() {
  elements.app.addEventListener("click", handleAction);
  elements.app.addEventListener("keydown", handleKeyboardAction);
  elements.search.addEventListener("input", handleSearch);
  elements.modal.addEventListener("click", handleAction);
  document.querySelector(".app-header").addEventListener("click", handleAction);
}

function handleSearch(event) {
  state.keyword = event.target.value;
  ensureSelectedSpot();
  render();
}

function handleKeyboardAction(event) {
  if (event.key !== "Enter" && event.key !== " ") {
    return;
  }

  const target = event.target.closest("[data-action], [data-filter-group]");
  if (target) {
    event.preventDefault();
    handleAction({ target });
  }
}

async function handleAction(event) {
  const target = event.target.closest("[data-action], [data-filter-group]");
  if (!target) {
    return;
  }

  const { action, spotId, filterGroup, filterValue } = target.dataset;

  if (action === "select-spot") {
    state.selectedId = spotId;
  }

  if (filterGroup) {
    state[filterGroup] = filterValue;
    ensureSelectedSpot();
  }

  if (action === "toggle-bookmark") {
    await toggleRouteSpot(spotId);
  }

  if (action === "clear-route") {
    state.routeIds = [];
    await saveRoute(state.routeIds);
  }

  if (action === "toggle-route") {
    state.isRouteOpen = !state.isRouteOpen;
  }

  if (action === "open-modal") {
    state.modalSpotId = spotId;
  }

  if (action === "close-modal") {
    if (target !== event.target && !target.classList.contains("close")) {
      return;
    }
    state.modalSpotId = null;
  }

  if (action === "reset-view") {
    resetView();
  }

  render();
}

async function toggleRouteSpot(spotId) {
  state.routeIds = state.routeIds.includes(spotId)
    ? state.routeIds.filter((id) => id !== spotId)
    : [...state.routeIds, spotId];
  await saveRoute(state.routeIds);
}

function resetView() {
  state.selectedId = spots[0].id;
  state.title = "전체";
  state.genre = "전체";
  state.keyword = "";
  elements.search.value = "";
}

function ensureSelectedSpot() {
  const filtered = getFilteredSpots(spots, state);
  if (!filtered.some((spot) => spot.id === state.selectedId)) {
    state.selectedId = filtered[0]?.id || null;
  }
}

function render() {
  const filtered = getFilteredSpots(spots, state);
  const selected = spots.find((spot) => spot.id === state.selectedId);
  const modalSpot = spots.find((spot) => spot.id === state.modalSpotId);
  const routeSpots = state.routeIds.map((id) => spots.find((spot) => spot.id === id)).filter(Boolean);

  renderFilterButtons(elements.titleFilters, titles, state.title, "title");
  renderFilterButtons(elements.genreFilters, genres, state.genre, "genre");
  renderMap(elements.map, filtered, state);
  renderDetailsPanel(elements.detail, selected, state.routeIds.includes(state.selectedId));
  renderRoutePanel(elements.route, routeSpots, state.isRouteOpen);
  renderModal(elements.modal, modalSpot);

  elements.routeCount.textContent = String(state.routeIds.length);
  elements.resultCount.textContent = `${filtered.length} spots`;
  document.querySelector("[data-action='toggle-route']").setAttribute("aria-expanded", String(state.isRouteOpen));
}

init();
