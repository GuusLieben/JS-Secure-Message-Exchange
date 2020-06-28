const express = require('express')
const axios = require('axios')
const keygen = require('./keygen')

const crypto = require('crypto')

const app = express()
var listenOnPort;
var respondToPort;
var appType;
var remoteType;

app.get('/', (req, res) => {
    axios.post(`http://localhost:${respondToPort}/hello/bob`, {
        name: 'Bob'
    })
    .then(ares => {
        console.log
        const data = decryptWithKey(ares.data)
        res.send(data)
    })
})

app.post('/hello/:name', (req, res) => {
    res.send(encryptWithKey(`Hello ${req.params.name}`))
})

module.exports = {
    start: (listenOn, respondTo, type) => {
        listenOnPort = listenOn
        respondToPort = respondTo
        appType = type
        remoteType = (type === 'server') ? 'client' : 'server'
        keygen.collect()
        app.listen(listenOnPort, () => console.log(`Listening on port ${listenOnPort}..`))
    }
}

encryptWithKey = (content) => {
    const key = keygen[appType].private
    console.log(`Encrypting with private key from ` + appType + ':\n\n' + key + '\n')
    const buf = Buffer.from(content)
    const encryptedContent = crypto.privateEncrypt(key, buf)
    return encryptedContent.toString('base64')
}

decryptWithKey = (content, public = true) => {
    const key = keygen[remoteType].public
    console.log(`Decrypting with ${public ? 'public' : 'private'} key from ` + remoteType + ':\n\n' + key + '\n')
    const buf = Buffer.from(content, 'base64')
    const decryptedContent = crypto.publicDecrypt(key, buf)
    return decryptedContent.toString('utf-8')
}