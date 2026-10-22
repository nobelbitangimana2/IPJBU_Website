/**
 * Thin helpers — operate on the live array from DataContext.
 * These exist so public page components stay simple.
 */
export async function getUpdates(liveUpdates) {
  return [...liveUpdates].sort((a, b) => new Date(b.date) - new Date(a.date))
}

export async function getUpdateById(id, liveUpdates) {
  return liveUpdates.find((u) => u.id === id) ?? null
}
