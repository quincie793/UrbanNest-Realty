const FAVORITES_KEY = "urbannest_favorites";

export function getFavorites(): number[] {
  const saved = localStorage.getItem(FAVORITES_KEY);
  return saved ? JSON.parse(saved) : [];
}

export function toggleFavorite(id: number) {
  const favorites = getFavorites();

  let updated;

  if (favorites.includes(id)) {
    updated = favorites.filter((favId) => favId !== id);
  } else {
    updated = [...favorites, id];
  }

  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  return updated;
}

export function isFavorite(id: number) {
  return getFavorites().includes(id);
}