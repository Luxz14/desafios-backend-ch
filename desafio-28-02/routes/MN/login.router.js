import { Router } from "express";
import { LoginManagerMN } from "../../src/dao/MN/LoginManagerMN.js";

const loginRouter = Router();
const newUserManager = new LoginManagerMN();

loginRouter.get("/signup", async(req, res) => {
    res.render("signup");
});

loginRouter.get("/login", async (req, res) => {
    res.redirect('login');
});

loginRouter.post("/signup", async (req, res) => {
    const { first_name, last_name, email, password } = req.body;

    if (!first_name || !last_name || !email || !password) {
        return res.status(400).json({ message: "Todos los campos son requeridos" });
    }

    try {
        await newUserManager.newUser(req.body);
        req.session.signupSuccess = true;
        res.redirect('/');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

loginRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({message: "Todos los campos son requeridos"});
    }

    try {
        const user = await newUserManager.byEmail(email);
        if (password !== user.password) {
            return res.status(400).json({message: "La contraseña no es válida, intentalo de nuevo"});
        }

        req.session.user = { email, first_name: user.first_name };
        req.session.loginSuccess = true; 
        res.redirect('/products');

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

loginRouter.get("/logout", async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

export default loginRouter;