const path = require('path');
const express = require('express');
const routes = require('./controllers');
const sequelize = require('./config/connection');

const helpers = require('./utils/helpers');

const app = express();
const PORT = process.env.PORT || 3001;

const exphbs = require('express-handlebars');
const hbs = exphbs.create({ helpers });
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sess = {
    secret: process.env.DB_SECRET,
    cookie: {},
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize,
        checkExpirationInterval: 10 * 60 * 1000, // The interval at which to cleanup expired sessions in milliseconds. // 10 Minutes
        expiration: 20 * 60 * 1000 // The maximum age (in milliseconds) of a valid session. // 20 Minutes
    })
};
app.use(session(sess));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// turn on routes
app.use(routes);

// turn on connection to db and  API server
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('Now listening for API requests on port:' + PORT));
});