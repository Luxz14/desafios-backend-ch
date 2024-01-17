//3er desafio entregable
//Servidores Web

/*
Consigna:

-Desarrollar un servidor basado en express donde podamos hacer consultas a nuestro archivo de productos.
*/

//Importamos (Utilizando el type: module en package.json) el ProductManager y el express
import { ProductManager } from './productManager.js';
import express from 'express';

//Hacemos una variable url que lleve el path del archivo de los productos
const url = './products.json';

//Generamos un nuevo ProducManager (Ver archivo) con el path colocado
const productManager = new ProductManager(url);

//Inicializamos la app con express
const app = express();



//Obtenemos los productos parseados y verificamos si existen, si es asi los presentamos, sino lanzamos un error
app.get('/products', async(req, res) => {
    try {
        const limit = parseInt(req.query.limit);
        const products = await productManager.getProducts(limit);
        let productsParsed = JSON.parse(products);

        if(!isNaN(limit) && limit > 0) {
            let productsLimited = productsParsed.slice(0, limit);
            
            if (productsLimited.length > 0) {
                res.json(productsLimited);
            } else {
                res.json(productsParsed);
            }
        }

    } catch (error) {
        res.json(error);
    }
})

//Obtenemos los productos en base a su id (Los buscamos desde el ProductManager)
app.get('/products/:pid', async(req, res) => {
    try {
        const id = parseInt(req.params.pid);
        const product = await productManager.getProductById(id);

        res.json(product);
    }
    catch (error) {
        res.json(error);
    }
})

//Conectamos el servidor online en el puerto 8080
app.listen(8080, () => console.log('Servidor con express online'))