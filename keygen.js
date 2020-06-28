const sign = require('selfsigned')
const path = require('path')
const fs = require('fs')

var clientKeys = {
    private: null,
    public: null
}

var serverKeys = {
    private: null,
    public: null
}

module.exports = {
    init: () => {
        console.log('Initiated keygen')

        const attrs = [{ name: 'commonName', value: 'localhost' }]
        const pems = sign.generate(attrs, { days: 365, clientCertificate: true})

        if (!fs.existsSync('server')) fs.mkdirSync('server')
        if (!fs.existsSync('client')) fs.mkdirSync('client')

        if (!fs.existsSync('server/key.pub')) fs.writeFileSync('server/key.pub', pems.public)
        if (!fs.existsSync('server/key.pem')) fs.writeFileSync('server/key.pem', pems.private)

        if (!fs.existsSync('client/key.pub')) fs.writeFileSync('client/key.pub', pems.clientpublic)
        if (!fs.existsSync('client/key.pem')) fs.writeFileSync('client/key.pem', pems.clientprivate)
    },
    collect: () => {
        clientKeys.public = getKeyFromFile('client/key.pub')
        clientKeys.private = getKeyFromFile('client/key.pem')

        serverKeys.public = getKeyFromFile('server/key.pub')
        serverKeys.private = getKeyFromFile('server/key.pem')
    },
    client: clientKeys,
    server: serverKeys
}

getKeyFromFile = (file) => {
    const abp = path.resolve(file)
    return fs.readFileSync(abp, 'utf-8')
}