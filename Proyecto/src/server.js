const express = require("express");
const { findOneById, findAll, create, update, destroy } = require("./database/productos.manager.js");

require('dotenv').config();

const server = express();

/*********************************************************/
            // Middlewares
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

/*********************************************************/
            // Obtener todos los productos:  GET /productos


server.get('/productos', (req, res) => {
    findAll()
        .then((productos) => res.status(200).send(productos))
        .catch((error) => res.status(400).send(error.message));
});

/********************************************************/ 
            // Obtener producto específico: GET /productos/1


server.get('/productos/:id', (req, res) => {
    const { id } = req.params;

    findOneById(Number(id))
        .then((producto) => res.status(200).send(producto))
        .catch((error) => res.status(400).send(error.message));
});

/******************************************************/
            // Crear un nuevo producto: POST /productos
server.post('/productos', (req, res) => {
    const { fruta, color, tamaño } = req.body;

    create({ fruta, color, tamaño })
        .then((productos) => res.status(201).send(productos))
        .catch((error) => res.status(400).send(error.message));
});

/*****************************************************/
            // Actualizar un producto específico:  PUT /productos/1
server.put('/productos/:id', (req, res) => {
    const { id } = req.params;
    const { fruta, color, tamaño } = req.body;

    update({ id: Number(id), fruta, color, tamaño })
        .then((producto) => res.status(200).send(producto))
        .catch((error) => res.status(400).send(error.message));
});

/*****************************************************/
            // Eliminar un producto específico: DELETE /productos/1
server.delete('/productos/:id', (req, res) => {
    const { id } = req.params;

    destroy(Number(id))
        .then((producto) => res.status(200).send(producto))
        .catch((error) => res.status(400).send(error.message));
});

/****************************************************/
            // Rutas inexistentes
server.use('*', (req, res) => {
    res.status(404).send(`<h1>Error 404</h1><h3>La URL indicada que la pagina no existe</h3>`);
});

/****************************************************/
            //Server escuchando
server.listen(process.env.SERVER_PORT, process.env.SERVER_HOST, () => {
    console.log(`Ejecutandose en http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/productos`);
});