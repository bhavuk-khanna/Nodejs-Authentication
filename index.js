const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
//used for session cookie 
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportGoogle = require('./config/passport-google-oauth2-stratergy');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const customMware = require('./config/middleware');


//middlewares 
app.use(express.urlencoded());
app.use(cookieParser());


//use the assets folder for static files 
app.use(express.static('./assets'));



// use express layouts
app.use(expressLayouts);


//extrat style and scripts from sub pages into the layout

app.set('layout extractStyles', true);
app.set('layout extractScripts', true);


//set up the view engine
app.set('view engine','ejs');
app.set('views', './views');


//mongo store is used to store the session cookie in the db
app.use(session({
    name: 'codeial',
    //TODO change the secret before deployment in production mode
    secret: 'blahsomething',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000*60*100)
    },
    store: new MongoStore(
        {
            mongooseConnection: db,
            autoRemove: 'disabled'
        },
        function(err){
            console.log(err || 'connect-mongodb setup ok');
        }
    )
})
);

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);


//set up flash messages
app.use(flash());
app.use(customMware.setFlash);


//use express router 
app.use("/",require('./routes'));


app.listen(port,function(err){
    if(err)
        console.log("Error Starting the server");
    
    console.log('Server has been started');
});
