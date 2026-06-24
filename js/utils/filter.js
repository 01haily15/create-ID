export function getFilteredSpots(spots, filters) {
  const keyword = filters.keyword.trim().toLowerCase();

  return spots.filter((spot) => {
    const matchesTitle = filters.title === "전체" || spot.title === filters.title;
    const matchesGenre = filters.genre === "전체" || spot.genre === filters.genre;
    const searchable = `${spot.title} ${spot.genre} ${spot.place} ${spot.city} ${spot.country} ${spot.scene}`.toLowerCase();
    return matchesTitle && matchesGenre && (!keyword || searchable.includes(keyword));
  });
}
