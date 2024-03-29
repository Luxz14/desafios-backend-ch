import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import handlebars from 'express-handlebars';
import { fileURLToPath } from 'url'
import {dirname} from 'path'
import { Server } from "socket.io";
import { ProductManager } from './dao/fs/ProductManager.js';
import routerRealTimeProducts from "../routes/MN/realTimeProducts.js"
import routerProducts from "../routes/MN/products.routerMN.js";
import cartRouter from "../routes/fs/carts.router.js"
import {messagesRouter, messagesMN} from '../routes/MN/messages.routerMN.js'
import router from '../routes/MN/realTimeProducts.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { CartManagerMN } from './dao/MN/CartManagerMN.js';
import passport from 'passport';
import initializePassport from "../src/config/passport.config.js"
import routerSessions from '../routes/MN/sessions.routerMN.js';


const app = express();
const PORT = 8080;

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

mongoose.connect("mongodb+srv://hamiltonprop03:2BVWOVIyMW5j0pmY@cluster0.f5bo2kd.mongodb.net/sesiones?retryWrites=true&w=majority&appName=Cluster0")

app.use(session({
    store: new MongoStore({
        mongoUrl: "mongodb+srv://hamiltonprop03:2BVWOVIyMW5j0pmY@cluster0.f5bo2kd.mongodb.net/sesiones?retryWrites=true&w=majority&appName=Cluster0"
    }),
    secret: "123456789",
    resave: false,
    saveUninitialized: false
}))

app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
})

app.use("/", router)
app.use("/products", routerProducts)
app.use("/api/carts", cartRouter)
app.use("/realTimeProducts", routerRealTimeProducts)
app.use("/api/chat", messagesRouter)
app.use("/api/sessions", routerSessions);

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(`${__dirname}/public`))

app.use(express.static(__dirname + '/views'))
app.use(express.static(path.join(`${__dirname}/public`)));
app.engine("handlebars", handlebars.engine())
app.set('views', `${__dirname}/views`)
app.set('view engine', "handlebars")


initializePassport();
app.use(passport.initialize());
app.use(passport.session());


app.post("/signup", passport.authenticate("signup", {
    successRedirect: "/products",
    failureRedirect: "/failregister"
}));


app.post("/login", passport.authenticate("login", {
    successRedirect: "/products",
    failureRedirect: "/login",
    failureFlash: true
}));


app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/login");
});


const productManager = new ProductManager();
const cartMongo = new CartManagerMN();

const httpsServer = app.listen(PORT, () => {
    console.log(`Servidor con express online en el Port: ${PORT}`);
})

const socketServer = new Server(httpsServer);

socketServer.on("connection", (socket) => {
    console.log("Conectado correctamente");

    try {
        const products = productManager.getProducts();
        socketServer.emit("products", products);
    } catch (error) {
        socketServer.emit('response', { status: 'error', message: error.message });
    }

    socket.on("new-Product", async (newProduct) => {
        try {
            const objectProductNew = {
                    title: newProduct.title,
                    description: newProduct.description,
                    code: newProduct.code,
                    stock: newProduct.stock,
                    price: newProduct.price,
                    thumbnail: newProduct.thumbnail,
                    categoria: newProduct.categoria,
    
            }
            const pushProduct = productManager.addProduct(objectProductNew);
            const updatedListProduct = productManager.getProducts();
            socketServer.emit("products", updatedListProduct);
            socketServer.emit("response", { status: 'success' , message: pushProduct});

        } catch (error) {
            socketServer.emit('response', { status: 'error', message: error.message });
        }
    })

    socket.on("delete-product", async(id) => {
        try {
            const pid = parseInt(id)
            const deleteProduct = productManager.deleteProduct(pid)
            const updatedListProduct = productManager.getProducts()
            socketServer.emit("products", updatedListProduct)
            socketServer.emit('response', { status: 'success' , message: "Producto eliminado correctamente"}, deleteProduct);
        } catch (error) {
            socketServer.emit('response', { status: 'error', message: error.message });
        }
    })

    socket.on("addToCart", async(productId) => {
        try {
            const ObjectId = mongoose.Types.ObjectId;
            const cartId = new ObjectId();
            const result = await cartMongo.addToCart(cartId, productId);
            socket.emit("addToCartResponse", { status: "success", message: result });

        } catch (error) {
            console.error("No se pudo agregar el producto al carrito", error);
            socket.emit("addToCartResponse", { status: "error", message: error.message });
        }
    })
})

//Socket.io del chat

const io = new Server(httpsServer);
const users = {};

io.on ("connection", (socket) => {
    console.log("Un nuevo usuario se ha conectado")
    socket.on("newUser", (username) => {
        users[socket.id] = username
        io.emit("userConnected", username)
    })

    socket.on("chatMessage", async (data) => {
        const { username, message } = data;
        try {
            await messagesMN.addChat(username, message);
            io.emit("message", { username, message });
        } catch (error) {
            console.error("Error al procesar el mensaje del chat, intentalo de nuevo", error);
        }
    });

    socket.on("disconnect", ()=>{
        const username = users[socket.id]
        delete users[socket.id]
        io.emit("userDisconnected", username)
    })
})

// const enviroment = async() => {
//     await mongoose.connect("mongodb+srv://hamiltonprop03:2BVWOVIyMW5j0pmY@cluster0.f5bo2kd.mongodb.net/ecommerce?retryWrites=true&w=majority")
//     .then(() => {
//         console.log("Conectado a la base de datos");
//     })
//     .catch(error => {
//         console.log("Error al conectarse a la base de datos", error);
//     })
// }

// enviroment();