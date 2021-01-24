const fetch = require('node-fetch');
const fs = require('fs');
const FormData = require('form-data');
//usual link: http://localhost:1234/galeria/{action?}

const GET = async () => {
    return new Promise((resolve, reject) => {
        fetch(`${process.env.URL}/galeria`)
            .then(res => res.json())
            .then(data => resolve(data))
            .catch(err => reject(err));
    });
}

const GETOne = async (id) => {
    return new Promise((resolve, reject) => {
        fetch(`${process.env.URL}/galeria/${id}`)
            .then(res => res.json())
            .then(data => resolve(data))
            .catch(err => reject(err));
    });
}

const POST = async (imagen) => {
    return new Promise((resolve, reject) => {
        let params = new FormData();
        params.append('imagen', fs.createReadStream(imagen));
        fetch(`${process.env.URL}/galeria/create`, {
            method: 'POST',
            body: params
        })
            .then(res => res.json())
            .then(data => resolve(data))
            .catch(err => reject(err))
    })
}

const PUT = async (id, imagen) => {
    return new Promise((resolve, reject) => {
        let params = new FormData();
        params.append('imagen', fs.createReadStream(imagen));
        fetch(`${process.env.URL}/galeria/update/${id}`, {
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
        fetch(`${process.env.URL}/galeria/delete/${id}`, { method: 'DELETE' })
            .then(res => res.json())
            .then(data => resolve(data))
            .catch(err => reject(err))
    })
}

module.exports = { GET, GETOne, POST, PUT, DELETE }