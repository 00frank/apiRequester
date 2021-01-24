const fetch = require('node-fetch');
const fs = require('fs');
const FormData = require('form-data');
//usual link: http://localhost:1234/articulos/{action?}

const GET = async () => {
    return new Promise((resolve, reject) => {
        fetch(`${process.env.URL}/articulos`)
            .then(res => res.json())
            .then(data => resolve(data))
            .catch(err => reject(err));
    });
}

const GETOne = async (id) => {
    return new Promise((resolve, reject) => {
        fetch(`${process.env.URL}/articulos/${id}`)
            .then(res => res.json())
            .then(data => resolve(data))
            .catch(err => reject(err));
    });
}

const POST = async (portada, url, titulo, intro, contenido) => {
    return new Promise((resolve, reject) => {
        let params = new FormData();
        params.append('portada', fs.createReadStream(portada));
        params.append('url', url);
        params.append('titulo', titulo);
        params.append('intro', intro);
        params.append('contenido', contenido);
        fetch(`${process.env.URL}/articulos/create`, {
            method: 'POST',
            body: params
        })
            .then(res => res.json())
            .then(data => resolve(data))
            .catch(err => reject(err))
    })
}

const PUT = async (id, portada, titulo, intro, contenido) => {
    return new Promise((resolve, reject) => {
        let params = new FormData();
        params.append('portada', fs.createReadStream(portada));
        params.append('titulo', titulo);
        params.append('intro', intro);
        params.append('contenido', contenido);
        fetch(`${process.env.URL}/articulos/update/${id}`, {
            method: 'PUT',
            body: params
        })
            .then(x => x.json())
            .then(data => resolve(data))
            .catch(err => reject(err));
    })
}

const DELETE = async (id) => {
    return new Promise((resolve, reject) => {
        fetch(`${process.env.URL}/articulos/delete/${id}`, { method: 'DELETE' })
            .then(res => res.json())
            .then(data => resolve(data))
            .catch(err => reject(err))
    })
}

module.exports = { GET, GETOne, POST, PUT, DELETE }