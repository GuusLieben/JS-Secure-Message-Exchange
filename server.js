const app = require('./app')
const keygen = require('./keygen')

keygen.init()
console.log(keygen.client.private)
app.start(8009, 8010, 'server')