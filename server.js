//Install express server
const express = require('express');
const path = require('path');

const app = express();

const allowCors = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
    res.header('Accept-Charset', 'utf-8');
    res.header('Access-Control-Allow-Credentials', true);
    next();
};
app.use(allowCors);

// Apontar o caminhos estáticos
app.use(express.static(path.resolve('dist')));

// Devolve arquivo index.html. O Angular irá tratar essas rotas.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// Start the app by listening on the default Heroku port
app.set('port', process.env.PORT || 8080);
app.listen(app.get('port'), function () {
    console.log("App running on port", app.get('port'));
});