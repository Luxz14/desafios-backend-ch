import passport from "passport";
import passportLocal from "passport-local";
import { Strategy as GithubStrategy } from "passport-github2";
import userModel from "../dao/models/user.model.js";
import utils from "../../utils.js"

const LocalStrategy = passportLocal.Strategy;

const initializePassport = () => {
    //Local
    passport.use("signup", new LocalStrategy(
        { passReqToCallback: true, usernameField: "email" },
        async (req, email, password, done) => {
            const { first_name, last_name } = req.body;

            try {
                let user = await userModel.findOne({ email });
                if (user) {
                    console.log("Usuario existente");
                    return done(null, false);
                }

                const newUser = {
                    first_name,
                    last_name,
                    email,
                    password: utils.createHash(password),
                };

                let result = await userModel.create(newUser);
                return done(null, result);

            } catch (error) {
                return done(`Error al obtener usuario: ${error}`);
            }
        }
    ));


    passport.use("login", new LocalStrategy(
        { usernameField: "email" },
        async (email, password, done) => {
            try {
                let user = await userModel.findOne({ email });
                if (!user) {
                    return done(null, false, { message: "Usuario no encontrado" });
                }

                if (!utils.isValidatePassword(user, password)) {
                    return done(null, false, { message: "Contraseña incorrecta" });
                }

                return done(null, user);

            } catch (error) {
                return done(error);
            }
        }
    ));
    //Github
    passport.use("github", new GithubStrategy(
        { 
            clientID: "Iv1.c74ffb9390d3474c",
            clientSecret:"024f2816febfb98cd7ff49fa0d871ad92572d4a2",
            callbackURL: "http://localhost:8080/api/sessions/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            console.log(profile._json);
            try {
                let user = await userModel.findOne({ email: profile._json.email })
                if (!user) {
                    let newUser = {
                        first_name: profile._json.name,
                        last_name: ' ',
                        email: profile._json.email,
                        password: ' '
                    }
                    let createdUser = await userModel.create(newUser);
                    done(null, createdUser);
                } else {
                    done(null, user);
                }
            } catch (error) {
                return done(error);
            }
        }
            
    ));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        let user = await userModel.findById(id);
        done(null, user);
    });
};

export default initializePassport;