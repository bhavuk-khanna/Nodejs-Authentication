const express = require('express');
const router = express.Router();
const passport = require('passport');

const usersController = require('../controllers/users_controller')

router.get("/",usersController.users);
router.get("/signup",usersController.signUp);
router.get("/signin",usersController.signIn);
router.post("/create", usersController.create);
router.get('/profile/',passport.checkAuthentication,usersController.profile);
router.post('/update/',passport.checkAuthentication,usersController.update);

//use passport as a middleware to authenticate 
router.post('/create-session',passport.authenticate(
    'local',
    {failureRedirect: '/users/signin'}),
    
usersController.createSession);

router.get('/sign-out',usersController.destroySession);

router.get('/forget-password',usersController.forgetPassword);
router.post('/reset',usersController.reset);

router.get('/resetPassword/:id',usersController.updatePassword);
router.post('/resetPassword/:id',usersController.changePassword);

router.get('/auth/google', passport.authenticate('google',{scope: ['profile','email']}));
router.get('/auth/google/callback/',passport.authenticate('google', {failureRedirect: 'users/sign-in'}), usersController.createSession);


module.exports = router;