const { ImageKit } = require('@imagekit/nodejs')
const ik = new ImageKit({
  publicKey:   'test',
  privateKey:  'test',
  urlEndpoint: 'https://ik.imagekit.io/test',
})
console.log('upload type:', typeof ik.upload)
console.log('bulkDeleteFiles type:', typeof ik.bulkDeleteFiles)
console.log('methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(ik)).filter(m => m !== 'constructor').join(', '))
