#!/usr/bin/env node
//modules and dependencies
require('dotenv').config()
const enquirer = require('enquirer');
const chalk = require('chalk');
const ora = require('ora');

//methods colors
const m = require('./helpers/methods')

//handlers require
const Slide = require('./handlers/slideH');
const Articulos = require('./handlers/articulosH');
const Galeria = require('./handlers/galeriaH');

async function connectToServices() {
    return new Promise((resolve, reject) => {
        let spinner = ora({ text: 'Conectando con la api', type: 'point' }).start();
        setTimeout(async () => {
            try {
                await m.tryConnection().then(async (connected) => {
                    if (connected) {
                        spinner.stop();
                    }
                    else {
                        spinner.fail('No se pudo conectar con la api, porfavor compruebe que este encendido e intentelo nuevamente');
                        process.exit(0);
                    }
                    resolve();
                })
            } catch (err) {
                console.log(err);
            }
        }, 600)
    })
}

async function start() {
    try {
        var model = await askModel();
        var method = await askMethod(model);
        if (method == m.BACK) return await start();

        let spinner;
        await doRequest(model, method)
        if (method != m.GET && method != m.GETOne)
            spinner = ora({ text: 'Guardando cambios en la api', type: 'point' }).start();
        setTimeout(async () => {
            if (method != m.GET && method != m.GETOne)
                spinner.stop();
            let again = await askAgain().catch(err => console.log(err));
            if (again) return await start();
        }, 1000)

    } catch (err) {
        console.log(err);
        let again = await askAgain().catch(err => console.log(err));
        if (again) return await start()
    }
}

const askModel = () => {
    return new Promise((resolve, reject) => {
        new enquirer.Select({
            name: 'model',
            message: `Seleccione un ${chalk.blueBright('modelo')} para realizar una peticion http`,
            choices: [Slide.name, Galeria.name, Articulos.name]
        }).run().then(x => resolve(x)).catch(err => reject(err));
    })
}

const askMethod = (model) => {
    return new Promise((resolve, reject) => {
        new enquirer.Select({
            name: 'method',
            message: `Seleccione un metodo http para hacer al modelo ${model}, o seleccione "${m.BACK}" para volver atras`,
            choices: [m.BACK, m.GET, m.GETOne, m.POST, m.PUT, m.DELETE],
            initial: 1
        }).run().then(x => resolve(x)).catch(err => reject(err));
    })
}

const askAgain = () => {
    return new Promise((resolve, reject) => {
        new enquirer.Toggle({
            message: 'Desea hacer otra petición?',
            enabled: chalk.greenBright('Si'),
            disabled: chalk.redBright('No')
        }).run().then(x => resolve(x)).catch(err => reject(err));
    })
}

const doRequest = async (model, method) => {
    try {
        let ok = false;
        switch (model) {
            case Slide.name:
                ok = await Slide.requesting(method);
                break;
            case Galeria.name:
                ok = await Galeria.requesting(method);
                break;
            case Articulos.name:
                ok = await Articulos.requesting(method);
                break;
        }
        return ok;
    } catch (err) {
        throw err;
    }
}

(async () => {
    try {
        await connectToServices().then(async x => {
            await start();
        })
    } catch (err){
        console.log(err)
    }
})()



