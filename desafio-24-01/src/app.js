import express from 'express';
import path from 'path'
import handlebars from 'express-handlebars';
import {Server} from 'socket.io';

import routerCarts from './routes/carts.router.js';
import routerProducts from './routes/products.router.js';
import productManager from './controllers/products.controllers.js';
import viewsRouter from './routes/views.router.js';
import realTimeProducts from './routes/realTimeProducts.router.js'

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import { fileURLToPath } from 'url'
import {dirname} from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

app.use(express.static(path.join(__dirname, '/public')))

app.use('/api/products', routerProducts);
app.use('/api/carts', routerCarts);

app.engine("handlebars", handlebars.engine())
app.set("views", __dirname + '/views')
app.set('view engine', 'handlebars')

const httpsServer = app.listen(PORT, () => {
    console.log(`Servidor con express online en el Port: ${PORT}`);
})

const socketServer = new Server(httpsServer);
app.use('/', viewsRouter)
app.use('/realTimeProducts', realTimeProducts)

socketServer.on('connection',  (socket) => {
    console.log('Nuevo cliente conectado!');
    try {
        const products =  productManager.getProducts();
        socketServer.emit('products', products);
    } catch (error) {
        socketServer.emit('response', { status: 'error', message: error.message });
    }

    
    socket.on('new-product',  (newProduct) => {
        try {
            const newProductObject = {
                title: newProduct.title,
                description: newProduct.description,
                code: newProduct.code,
                price: newProduct.price,
                stock: newProduct.stock,
                thumbnail: newProduct.thumbnail,
            }
            const response = productManager.addProduct(newProductObject);
            const products =  productManager.getProducts();

            socketServer.emit('products', products);
            socketServer.emit('response', { status: 'success' , message: response});
        } catch (error) {
            socketServer.emit('response', { status: 'error', message: error.message });
        }
    });
        

    socket.on('delete-product',  async(id) => {
        try {
            const response = await productManager.deleteProduct(id);
            const products =  productManager.getProducts();

            socketServer.emit('products', products);
            socketServer.emit('response', { status: 'success', message: response });
        } catch (error) {
            socketServer.emit('response', { status: 'error', message: error.message });
        }
    })})
