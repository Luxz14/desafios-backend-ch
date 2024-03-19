import passport from "passport";
import passportLocal from "passport-local";
import { Strategy as GithubStrategy } from "passport-github2";
import userModel from "../dao/models/user.model.js";
import utils from "../../utils";

const LocalStrategy = passportLocal.Strategy;


const initializePassport = () => {
    //Local
    passport.use("signup", new LocalStrategy (
        { passReqToCallback: true, usernameField: "email" },
        async (req, email, password, done) => {
            const { first_name, last_name } = req.body;

            try {
                let user = await userModel.findOne({ email });
                if (user) {
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
            clientID: "Iv1.8ee85de024145455",
            clientSecret:"b2f1d77cc4bf5dcd08155c1cfbe21edb6f14e98d",
            callbackURL: "http://localhost:8080/api/sessions/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            console.log(profile._json);
            try {
                let user = await User.findOne({ email: profile._json.email })
                if (!user) {
                    let newUser = {
                        first_name: profile._json.name,
                        last_name: ' ',
                        email: profile._json.email,
                        password: ' '
                    }
                    let createdUser = await User.create(newUser);
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
        let user = await User.findById(id);
        done(null, user);
    });
};

export default initializePassport;