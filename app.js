const express = require('express');
const { engine } = require('express-handlebars');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();

// configure Handlebars view engine
app.engine('handlebars', engine({
    defaultLayout: 'main',
}))
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));

const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('2d009adb-1880-479f-b1aa-38c3c5e6bcb9'));
app.use(session({
    secret: 'cf3427ef-50cf-4b2d-afd6-63381610538b',
    resave: true,
    saveUninitialized: true
}));


app.get('/', (req, res) => res.render('login'));

app.post('/', (req, res) => {
    //console.log('-- [submit] session:',req.session);
    let email = req.body.email;
    let password = req.body.password;
    //console.log(`-- email: ${email} | password: ${password}`);
    if (email === 'test' && password === '123') {
        req.session.auth = true;
        if (req.session.page) {
            var page = req.session.page;
            req.session.page = null;
            res.render(page);

        } else {
            res.render('home');
        }
    } else {
        req.session.auth = false;
        res.render('login', { toast: true });
    }
});

function authRender(req, res, page) {
    //console.log('-- [authRender] session:',req.session);
    if (req.session.auth) {
        res.render(page);
    } else {
        req.session.page = page;
        res.render('login');
    }
}

app.all('/home', (req, res) => {
    authRender(req, res, 'home');
});

app.all('/screen1', (req, res) => {
    authRender(req, res, 'screen1');
});

app.all('/screen2', (req, res) => {
    authRender(req, res, 'screen2');
});

app.all('/logout', (req, res) => {
    req.session.auth = false;
    req.session.page = null;
    res.render('login');
});

// custom 404 page
app.use((req, res) => {
    res.status(404)
    res.render('404')
});

// custom 500 page
app.use((err, req, res, next) => {
    console.error(err.message)
    res.status(500)
    res.render('500')
});

app.listen(port, () => console.log(
    `Express started on http://localhost:${port}; ` +
    `press Ctrl-C to terminate.`));

