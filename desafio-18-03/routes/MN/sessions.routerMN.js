import { Router } from "express";
import passport from "passport";

const routerSessions = Router();

routerSessions.post("/signup", passport.authenticate("signup", { 
    failureRedirect: "/failregister" 
}), async (req, res) => {
    res.redirect("/login"); 
});

routerSessions.get("/failregister", async (req, res) => {
    console.log("Registro fallido")
    res.status(400).send({ error: "Fallo en el registro" })
});

routerSessions.post("/login", passport.authenticate("login", {
    failureRedirect: "/faillogin"}), async (req, res) => {
        if (!req.user) return res.status(400).send({status:"error", error:"invalid credentials"})
        req.session.user = {
            first_name : req.user.first_name,
            last_name : req.user.last_name,
            email : req.user.email
        }
        res.redirect("/products");
});

routerSessions.get("/faillogin", async (req, res) => {
    console.log("Login fallido")
    res.status(400).send({ error: "Fallo en el login" })
});

//GitHub

routerSessions.get(
    "/github",
    passport.authenticate("github", { scope: ["user:email"]})
)

routerSessions.get(
    "/callback",
    passport.authenticate("github", { failureRedirect: '/login' }), async (req,res)=>{
        req.session.user = req.user
        res.redirect("/products");
    })


routerSessions.get("/signout", async (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login")
    })
});


export default routerSessions;