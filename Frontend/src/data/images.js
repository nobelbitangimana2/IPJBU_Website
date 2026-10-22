export async function getImages(liveImages, category) {
  return category ? liveImages.filter((i) => i.category === category) : liveImages
}

export async function getImageCategories(liveImages) {
  return [...new Set(liveImages.map((i) => i.category))]
}
