const chalk = require('chalk');
const fetch = require('node-fetch');

const tryConnection = async () => {
    try {
        var hasValue;
        await fetch('http://localhost:1234')
            .then(res => res.text())
            .then(data => hasValue = true)
        return (hasValue == true)
    } catch (err) {
        return false;
    }
}

const BACK = chalk.blackBright('../');
const GET = chalk.yellowBright('GET');
const GETOne = chalk.yellowBright('GETOne');
const POST = chalk.yellowBright('POST');
const PUT = chalk.yellowBright('PUT');
const DELETE = chalk.yellowBright('DELETE');


module.exports = { tryConnection, BACK, GET, GETOne, POST, PUT, DELETE }