//3er desafio entregable
//Servidores Web

/*
Consigna:

-Desarrollar un servidor basado en express donde podamos hacer consultas a nuestro archivo de productos.
*/

//Importamos (Utilizando el type: module en package.json) el ProductManager, el express y el FileSystem
import { ProductManager } from './productManager.js';
import express from 'express';
import fs from 'fs';

//Hacemos una variable url que lleve el path del archivo de los productos
const url = './products.json';

//Generamos un nuevo ProducManager (Ver archivo) con el path colocado
const productManager = new ProductManager(url);

//Inicializamos la app con express
const app = express();



//Obtenemos los productos parseados y verificamos si existen, si es asi los presentamos, sino lanzamos un error
app.get('/products', async(req, res) => {
    try {
        let products = await fs.promises.readFile('./products.json', 'utf-8')
        let parsedProducts = JSON.parse(products)
        const limit = parseInt(req.query.limit);

        //Si el limite del req.query de la url no un numero, se devolverá el JSON de productos completo 
        if (!isNaN(limit) && limit > 0) {
            let limitedProducts = parsedProducts.slice(0, limit);
            if (limitedProducts) {
                res.json(limitedProducts);
            } 
        } else {
            res.json(parsedProducts);
        }
        } catch (error) {
            return res.send(error);
        }
})

//Obtenemos los productos en base a su id (Los buscamos desde el ProductManager)
app.get('/products/:id', async(req, res) => {
    try {
        let products = await fs.promises.readFile('./products.json', 'utf-8');
        const parsedProducts = JSON.parse(products)
        const id = parseInt(req.params.id);

        let product = parsedProducts.find((u) => u.id === id)

        if(!product) {
            return res.send({error: "El producto con ese Id especifico no fue encontrado"});
        } else {
            return res.send(product);
        }
    }
    catch (error) {
        return res.send(error);
    }
})

//Conectamos el servidor online en el puerto 8080
app.listen(8080, () => console.log('Servidor con express online'))