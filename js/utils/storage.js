const ROUTE_KEY = "cinemap.route";

export async function loadRoute() {
  try {
    const saved = localStorage.getItem(ROUTE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.warn("루트 정보를 불러오지 못했습니다.", error);
    return [];
  }
}

export async function saveRoute(routeIds) {
  try {
    localStorage.setItem(ROUTE_KEY, JSON.stringify(routeIds));
  } catch (error) {
    console.warn("루트 정보를 저장하지 못했습니다.", error);
  }
}
