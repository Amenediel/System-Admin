require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');


const app = express();
const PORT = process.env.PORT || 4000;
//DB connection
mongoose.connect(process.env.DB_URI);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('Connected to DB!'));

//middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

app.use((req,res,next) => {
    res.locals.session = req.session.message;
    delete req.session.message;
    next();
})

app.use(express.static('assets/images'));

//template engine
app.set('view engine', 'ejs');

//route prefixes
app.use('', require('./routes/routes'));

app.listen(PORT, () => console.log(`Server started on port http://localhost:${PORT}`));