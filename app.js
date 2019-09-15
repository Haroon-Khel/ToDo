// The body of the back end. 
// Imports
const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');

// Initialse express
const app = express();

const PORT = process.env.PORT || 5000;
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

// import passport config
require('./config/passport')(passport);

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Mongoose
const db = require('./config/mongoURI').MongoURI;
mongoose.connect(db, {useNewUrlParser: true}).then(() => {
    console.log('MongoDB connected');
})
.catch(err => {
    console.log(err);
}); 

// Express-session middleware
app.use(session({
    secret: 'secret',
    resave: 'true',
    saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());


// Routes
app.use('/', require('./routes/indexRoutes'));
app.use('/users', require('./routes/dashboardRoutes'));

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});