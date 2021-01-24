const enquirer = require('enquirer');
const Galeria = require('../routes/galeriaR');
const chalk = require('chalk');
const name = chalk.cyanBright('Galeria');
const m = require('../helpers/methods');
const fs = require('fs');

const requesting = async (req) => {
    return new Promise(async (resolve, reject) => {
        switch (req) {
            case m.GET:
                Galeria.GET()
                    .then(async (gImagenes) => {
                        if (gImagenes.count == 0) throw `No se encontro ningun registro para ${name}`
                        var quantity = await askForQuantity(gImagenes.count);
                        quantity = quantity == '' ? gImagenes.count : quantity;
                        console.log(`Mostrando ${quantity} resultados:`);
                        for (let i = 0; i < quantity; i++) {
                            let e = gImagenes.data[i];
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
                Galeria.GETOne(idGet)
                    .then(async (gImagen) => {
                        if (gImagen.status != 200) throw `${chalk.redBright(`(${gImagen.status})`)} ${gImagen.mensaje}`;
                        console.log(`-- Mostrando el registro encontrado`);
                        console.log(printElement(gImagen.data));
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
                while (p.imagen == '' || p.imagen.length < 5 || !fs.existsSync(p.imagen)) {
                    p = await askParameters(p).catch(err => {
                        if (err) {
                            console.log(err[0]) //si hubo error en el primer prompt vuelve a hacer la validacion
                            return err[1]
                        }
                        else throw err;
                    });
                }
                Galeria.POST(p.imagen)
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
                let galeriaPut = await Galeria.GETOne(idPut).then(x => {
                    if (x.status != 200) throw `${chalk.redBright(`(${x.status})`)} ${x.mensaje}`;
                    console.log(`-- Muy bien, mostrando datos del ${name} con id ${chalk.greenBright(idPut)}`);
                    console.log(`-- En caso de querer editar el ${name} ${chalk.redBright('DEBE')} re-insertar la imagen o añadir una nueva`);
                    return x.data
                }).catch(err => console.log(err))
                if (galeriaPut) {
                    let pm = await askParameters(galeriaPut)
                        .catch(err => {
                            if (err) {
                                console.log(err[0])
                                return err[1]
                            }
                            else throw err;
                        });
                    while (p.imagen == '' || p.imagen.length < 5 || !fs.existsSync(p.imagen)) {
                        pm = await askParameters(pm).catch(err => {
                            if (err) {
                                console.log(err[0])
                                return err[1]
                            }
                            else throw err;
                        });
                    }
                    Galeria.PUT(idPut, pm.imagen)
                        .then(x => {
                            if (x.status != 200) throw `${chalk.redBright(`(${x.status}) ${x.mensaje}`)}`
                            else {
                                console.log(`${chalk.greenBright(`(${x.status})`)} ${name} editado con exito, mostrando datos actualizados:`);
                                console.log(printElement(x.galeria));
                                resolve(true);
                            }
                        })
                        .catch(err => reject(err))
                }
                break;
            case m.DELETE:
                let idDelete = await askForId(`Indique el id del objeto ${name} que quiere eliminar`).catch(err => { throw err });
                let galeriaDelete = await Galeria.GETOne(idDelete).then(x => {
                    if (x.status != 200) throw `${chalk.redBright(`(${x.status})`)} ${x.mensaje}`;
                    return x.data
                }).catch(err => reject(err))
                if (galeriaDelete) {
                    if (await askConfirmation(galeriaDelete).catch(err => console.log(err))) {
                        Galeria.DELETE(idDelete.trim())
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
    let imagen = e.imagen.trim() == '' ? chalk.underline('Sin imagen') : chalk.greenBright(e.imagen);
    return `Id: ${chalk.greenBright(e._id)}\n - Imagen: ${imagen}`;

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
        let imagen;
        if (p == undefined || p == {}) {
            imagen = '';
        } else {
            imagen = p.imagen == undefined ? '' : p.imagen.trim();
        }
        new enquirer.Form({
            name: 'parameters',
            message: `Por favor adjunte la siguiente informacion:\nLos campos marcados con ${chalk.red('*')} son requeridos`,
            choices: [
                { type: 'input', name: 'imagen', message: `* Imagen`, initial: imagen },
            ]
        }).run().then(x => {
            x.imagen = getImage(x.imagen.trim());
            if (x.imagen == '' || x.imagen.length < 5) {
                reject([`La imagen ${chalk.red('NO')} puede estar vacia o la ruta no tiene un formato valido. Intentelo nuevamente`, x]);
            };
            if (!fs.existsSync(x.imagen)) {
                reject([`La ruta de la imagen ${chalk.red('NO')} es correcta o la imagen no carga correctamente`, x])
            }
            resolve(x)
        }).catch(err => reject(err)) //cancela la ejecucion del programa (CTRL+C)
    })
}

const getImage = (path) => {
    if ((path.slice(-1) == '"' || path.slice(-1) == "'") && (path.slice(0, 1) == '"' || path.slice(0, 1) == "'"))
        return path.slice(1, -1);
    else
        return path
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