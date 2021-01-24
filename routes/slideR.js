const fetch = require('node-fetch');
const fs = require('fs');
const FormData = require('form-data');
//usual link: http://localhost:1234/slide/{action?}

const GET = async () => {
    return new Promise((resolve, reject) => {
        fetch(`${process.env.URL}/slide`)
            .then(res => res.json())
            .then(data => resolve(data))
            .catch(err => reject(err));
    });
}

const GETOne = async (id) => {
    return new Promise((resolve, reject) => {
        fetch(`${process.env.URL}/slide/${id}`)
            .then(res => res.json())
            .then(data => resolve(data))
            .catch(err => reject(err));
    });
}

const POST = async (imagen, titulo, descripcion) => {
    return new Promise((resolve, reject) => {
        let params = new FormData();
        params.append('imagen', fs.createReadStream(imagen));
        params.append('titulo', titulo);
        params.append('descripcion', descripcion);
        fetch(`${process.env.URL}/slide/create`, {
            method: 'POST',
            body: params
        })
            .then(res => res.json())
            .then(data => resolve(data))
            .catch(err => reject(err))
    })
}

const PUT = async (id, imagen, titulo, descripcion) => {
    return new Promise((resolve, reject) => {
        let params = new FormData();
        params.append('imagen', fs.createReadStream(imagen));
        params.append('titulo', titulo);
        params.append('descripcion', descripcion);
        fetch(`${process.env.URL}/slide/update/${id}`, {
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
        fetch(`${process.env.URL}/slide/delete/${id}`, { method: 'DELETE' })
            .then(res => res.json())
            .then(data => resolve(data))
            .catch(err => reject(err))
    })
}

module.exports = { GET, GETOne, POST, PUT, DELETE }