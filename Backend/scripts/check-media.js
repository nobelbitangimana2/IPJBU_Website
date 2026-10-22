try {
  require('../routes/media')
  console.log('media route loaded OK')
} catch (e) {
  console.error('media route error:', e.message)
}
