//Primera Pre-Entrega de Backend

/*
Consigna:

-Desarrollar el servidor basado en NodeJS y express, que escuche el puerto 8080 y disponga de dos grupos de rutas:
/products y /carts. Dichos endpoints estaran implementados con el router de express. con las siguientes especificaciones[...]
*/

//Hacemos todas las importaciones necesarias en la raiz del proyecto (App)
import express from 'express';
import {ProductManager} from './ProductManager.js';
import {CartManager} from './CartManager.js';
import routerCarts from '../routes/carts.router.js';
import routerProducts from '../routes/products.router.js'

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const pathProducts = './data/products.json';
const pathCarts = './data/carts.json';

export const productManager = new ProductManager(pathProducts);
export const cartManager = new CartManager(pathCarts);

app.use('/api/products', routerProducts);
app.use('/api/carts', routerCarts);

app.listen(PORT, () => console.log('Servidor con express online'));