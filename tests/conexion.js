const fetch = require('node-fetch')

fetch('http://localhost:1234')
    .then(res => res.text())
    .then(data => console.log('conectado'))
    .catch(err => console.log('desconectado'))