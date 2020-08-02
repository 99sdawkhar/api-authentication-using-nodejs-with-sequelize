const express = require("express");
// const router = express.Router() //alternative
const router = require("express-promise-router")();
const passport = require('passport')
const passportFile = require('../passport')

//methods
const passportLocal =  passport.authenticate('local', { session: false})
const passportJWT = passport.authenticate('jwt', { session: false})
const passportGoogle = passport.authenticate('googleToken', { session: false })

//validator from helper
const { validateBody, schemas, googleSchema } = require('../helpers/routeHelpers');

// Controllers
const userController = require('../controllers/user')

router.post('/signup', validateBody(schemas.authSchema), userController.signUp) //done

router.post('/oauth/google', passportGoogle, userController.googleOAuth)

router.post('/signin', validateBody(schemas.authSchema), passportLocal, userController.signIn)

router.post('/verify-email', userController.activateAccount)

router.get('/secret', passportJWT, userController.secret)

module.exports = router