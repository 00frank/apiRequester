const enquirer = require('enquirer');
const Articulos = require('../routes/articulosR');
const chalk = require('chalk');
const name = chalk.magentaBright('Articulos');
const m = require('../helpers/methods');
const fs = require('fs');

const requesting = async (req) => {
    return new Promise(async (resolve, reject) => {
        switch (req) {
            case m.GET:
                Articulos.GET()
                    .then(async (articulos) => {
                        if (articulos.count == 0) throw `No se encontro ningun registro para ${name}`
                        var quantity = await askForQuantity(articulos.count);
                        quantity = quantity == '' ? articulos.count : quantity;
                        console.log(`Mostrando ${quantity} resultados:`);
                        for (let i = 0; i < quantity; i++) {
                            let e = articulos.data[i];
                            console.log(`-- Registro ${chalk.yellow(i + 1)}`);
                            console.log(printElement(e));
                            resolve(true)
                        }
                    })
                    .catch(err => { throw err })
                break;
            case m.GETOne:
                let idGet = await askForId().catch(err => { throw err });
                if(idGet == '' || idGet == undefined) return
                Articulos.GETOne(idGet)
                    .then(async (articulo) => {
                        if (articulo.status != 200) throw `${chalk.redBright(`(${articulo.status})`)} ${articulo.mensaje}`;
                        console.log(`-- Mostrando el registro encontrado`);
                        console.log(printElement(articulo.data));
                        resolve(true);
                    })
                    .catch(err => reject(err))
                break;
            case m.POST:
                let p = await askParameters()
                    .catch(err => {
                        if (err) {
                            console.log(err[0]) //si hay error se muestra
                            return err[1] //retornando el valor del objeto para que vuelva a completar
                        }
                        else throw err; //si el error esta vacio es que se cancela la operacion
                    });
                while (!isValid(p)) {
                    p = await askParameters(p).catch(err => {
                        if (err) {
                            console.log(err[0]) //si hubo error en el primer prompt vuelve a hacer la validacion
                            return err[1]
                        }
                        else throw err;
                    });
                }
                Articulos.POST(p.portada, p.url, p.titulo, p.intro, p.contenido)
                    .then(x => {
                        if (x.status != 200) throw x.mensaje;
                        console.log(`-- ${name} creado satisfactoriamente, mostrando resultados:`);
                        console.log(printElement(x.data));
                        resolve(true);
                    })
                    .catch(err => reject(err))
                break;
            case m.PUT:
                let idPut = await askForId(`Indique el id del objeto ${name} que quiere editar`).catch(err => { throw err });
                let articuloPut = await Articulos.GETOne(idPut).then(x => {
                    if (x.status != 200) throw `${chalk.redBright(`(${x.status})`)} ${x.mensaje}`;
                    console.log(`-- Muy bien, mostrando datos del ${name} con id ${chalk.greenBright(idPut)}`);
                    console.log(`-- En caso de querer editar el ${name} ${chalk.redBright('DEBE')} re-insertar la portada o añadir una nueva`);
                    console.log(`-- La url de ${name} ${chalk.redBright('NO')} se puede editar, para ello borre la actual y cree un registro nuevo`);

                    return x.data
                }).catch(err => console.log(err))
                if (articuloPut) {
                    let pm = await askParameters(articuloPut)
                        .catch(err => {
                            if (err) {
                                console.log(err[0])
                                return err[1]
                            }
                            else throw err;
                        });
                    while (!isValid(pm)) {
                        pm = await askParameters(pm).catch(err => {
                            if (err) {
                                console.log(err[0])
                                return err[1]
                            }
                            else throw err;
                        });
                    }
                    Articulos.PUT(idPut, pm.portada, pm.titulo, pm.intro, pm.contenido)
                        .then(x => {
                            if (x.status != 200) throw `${chalk.redBright(`(${x.status}) ${x.mensaje}`)}`
                            else {
                                console.log(`${chalk.greenBright(`(${x.status})`)} ${name} editado con exito, mostrando datos actualizados:`);
                                console.log(printElement(x.articulo));
                                resolve(true);
                            }
                        })
                        .catch(err => reject(err))
                }
                break;
            case m.DELETE:
                let idDelete = await askForId(`Indique el id del objeto ${name} que quiere eliminar`).catch(err => { throw err });
                let articuloDelete = await Articulos.GETOne(idDelete).then(x => {
                    if (x.status != 200) throw `${chalk.redBright(`(${x.status})`)} ${x.mensaje}`;
                    return x.data
                }).catch(err => reject(err))
                if (articuloDelete) {
                    if (await askConfirmation(articuloDelete).catch(err => console.log(err))) {
                        Articulos.DELETE(idDelete.trim())
                            .then(x => {
                                if (x.status != 200) throw `${chalk.redBright(`(${x.status})`)} ${x.mensaje}}`;
                                else console.log(`${chalk.greenBright(`(${x.status})`)} ${x.mensaje}`);
                                resolve(true);
                            })
                            .catch(err => reject(err))
                    }

                }
                break;
        }
    })
}

const printElement = (e) => {
    let titulo = e.titulo.trim() == '' ? chalk.underline('Sin titulo') : chalk.greenBright(e.titulo);
    let intro = e.intro.trim() == '' ? chalk.underline('Sin introduccion') : chalk.greenBright(e.intro);
    let url = e.url.trim() == '' ? chalk.underline('Sin url') : chalk.greenBright(e.url);
    let portada = e.portada.trim() == '' ? chalk.underline('Sin portada') : chalk.greenBright(e.portada);
    let contenido = e.contenido.trim() == '' ? chalk.underline('Sin contenido') : chalk.inverse(e.contenido);
    return `Id: ${chalk.greenBright(e._id)}\n${titulo} - Url: ${url}\nImagen: ${portada}\nIntroduccion: ${intro}\n${contenido}`;

}


async function askForQuantity(registers) {
    var prompt = await enquirer.prompt({
        type: 'input',
        name: 'quantity',
        message: `Existen ${chalk.yellow(registers)} registros de ${name}, cuantos desea mostrar? (o aprete ${chalk.bgWhite.black('Enter')} para mostrar todos.)`,
        validate: value => {
            if (value == '') return true
            if (!/^([0-9]$)/.test(value)) return `Error, solo se aceptan números`
            if (value < 0) return 'Error, el número de registros a mostrar debe ser mayor a 0';
            if (value == 0) return true;
            if (value > registers) return `Error, el maximo de registros disponibles es ${registers}`;
            return true
        }
    }).catch(err => console.log(err));
    return prompt.quantity.trim();
}

async function askForId(message = `Indique el id del objeto ${name} que quiere buscar`) {
    try {
        var prompt = await enquirer.prompt({
            type: 'input',
            name: 'id',
            message: message,
            validate: value => {
                if (value == '') return 'Error, el id no puede estar vacio';
                if (value.length <= 1) return `Error, el id del ${name} debe ser más largo`;
                return true
            }
        });
        return prompt.id.trim();
    } catch (err) {
        console.log(err);
    }
}

async function askParameters(p = {}) {
    return new Promise((resolve, reject) => {
        let portada, url, titulo, intro, contenido;
        if (p == undefined || p == {}) {
            portada = '';
            titulo = '';
            intro = '';
            url = '';
            contenido = '';
        } else {
            portada = p.portada == undefined ? '' : p.portada.trim();
            titulo = p.titulo == undefined ? '' : p.titulo.trim();
            intro = p.intro == undefined ? '' : p.intro.trim();
            url = p.url == undefined ? '' : p.url.trim();
            contenido = p.contenido == undefined ? '' : p.contenido.trim();
        }
        new enquirer.Form({
            name: 'parameters',
            message: `Por favor adjunte la siguiente informacion:\nLos campos marcados con ${chalk.red('*')} son requeridos`,
            choices: [
                { type: 'input', name: 'portada', message: `* Portada`, initial: portada },
                { name: 'titulo', message: '* Titulo', initial: titulo },
                { name: 'intro', message: '* Introduccion', initial: intro },
                { name: 'url', message: '* Url', initial: url },
                { name: 'contenido', message: '* Contenido', initial: contenido }
            ]
        }).run().then(x => {
            x.portada = getImage(x.portada.trim());
            if (x.portada == '' || x.portada.length < 5) {
                reject([`La portada ${chalk.red('NO')} puede estar vacia o la ruta no tiene un formato valido. Intentelo nuevamente`, x]);
            };
            if (!fs.existsSync(x.portada)) {
                reject([`La ruta de la portada ${chalk.red('NO')} es correcta o la portada no carga correctamente`, x])
            }
            x.titulo = x.titulo.trim();
            if (x.titulo == '' || x.titulo.length < 2) {
                reject([`El titulo ${chalk.red('NO')} puede estar vacio o no tiene más de 2 caracteres. Intentelo nuevamente`, x]);
            }
            x.intro = x.intro.trim();
            if (x.intro == '' || x.intro.length < 2) {
                reject([`La introduccion ${chalk.red('NO')} puede estar vacia o no tiene más de 2 caracteres. Intentelo nuevamente`, x]);
            }
            x.url = x.url.trim();
            if (x.url == '' || x.url.length < 2) {
                reject([`La url ${chalk.red('NO')} puede estar vacia o no tiene un formato valido. Intentelo nuevamente`, x]);
            }
            x.contenido = x.contenido.trim();
            if (x.contenido == '' || x.contenido.length < 2) {
                reject([`El contenido ${chalk.red('NO')} puede estar vacio o no tiene más de 2 caracteres. Intentelo nuevamente`, x]);
            }
            resolve(x)
        }).catch(err => reject(err))
    })
}

const getImage = (path) => {
    if ((path.slice(-1) == '"' || path.slice(-1) == "'") && (path.slice(0, 1) == '"' || path.slice(0, 1) == "'"))
        return path.slice(1, -1);
    else
        return path
}

const isValid = (articulo) => {
    articulo.portada = getImage(articulo.portada.trim());
    articulo.titulo = articulo.titulo.trim();
    articulo.intro = articulo.intro.trim();
    articulo.url = articulo.url.trim();
    articulo.contenido = articulo.contenido.trim();
    return (articulo.portada != '' || articulo.portada.length > 5) && fs.existsSync(articulo.portada)
        && (articulo.titulo != '' || articulo.titulo.length > 2)
        && (articulo.intro != '' || articulo.intro.length > 2)
        && (articulo.url != '' || articulo.url.length > 2)
        && (articulo.contenido != '' || articulo.contenido.length > 2)
}

const askConfirmation = (articulo) => {
    return new Promise((resolve, reject) => {
        new enquirer.Toggle({
            message: `Esta seguro que desea borrar el siguiente elemento de ${name}?\n${printElement(articulo)}\n`,
            enabled: chalk.greenBright('Si'),
            disabled: chalk.redBright('No')
        }).run().then(x => resolve(x)).catch(err => reject(err));
    })
}


module.exports = { name, requesting }