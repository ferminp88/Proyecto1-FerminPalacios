const fs   = require("fs");
const path = require("path");

const ruta = path.join(__dirname, "data.json");



function escribir(contenido) {
    return new Promise((resolve, reject) => {
        fs.writeFile(ruta, JSON.stringify(contenido, null, "\t"), "utf8", (error) => {
            if (error) reject(new Error("Error. No se puede escribir"));

            resolve(true);
        });
    });
}


function leer() {
    return new Promise((resolve, reject) => {
        fs.readFile(ruta, "utf8", (error, result) => {
            if (error) reject(new Error("Error. No se puede leer"));

            resolve(JSON.parse(result));
        });
    });
}

function generarId(productos) {
    let mayorId = 0;

    productos.forEach((producto) => {
        if (Number(producto.id) > mayorId) {
            mayorId = Number(producto.id);
        }
    });

    return mayorId + 1;
}

async function findOneById(id) {
    if (!id) throw new Error("Error. El Id está indefinido.");

    const productos = await leer();
    const producto  = productos.find((element) => element.id === id);

    if (!producto) throw new Error("Error. El Id no corresponde a una fruta en existencia.");

    return producto;
}

async function findAll() {
    const productos = await leer();
    return productos;
}

async function create(producto) {
    if (!producto?.fruta || !producto?.color || !producto?.tamaño) throw new Error("Error. Faltan datos.");

    let productos = await leer();
    const productoConId = { id: generarId(productos), ...producto };

    productos.push(productoConId);
    await escribir(productos);

    return productoConId;
}

async function update(producto) {
    if (!producto?.id || !producto?.fruta || !producto?.color || !producto?.tamaño) throw new Error("Error. Faltan datos.");

    let productos   = await leer();
    const indice = productos.findIndex((element) => element.id === producto.id);

    if (indice < 0) throw new Error("Error. El Id no corresponde a una fruta en existencia.");

    productos[indice] = producto;
    await escribir(productos);

    return productos[indice];
}


async function destroy(id) {
    if (!id) throw new Error("Error. El Id está indefinido.");

    let productos   = await leer();
    const indice = productos.findIndex((element) => element.id === id);

    if (indice < 0) throw new Error("Error. El Id no corresponde a una fruta en existencia.");

    const producto = productos[indice];
    productos.splice(indice, 1);
    await escribir(productos);

    return producto;
}

module.exports = { findOneById, findAll, create, update, destroy };