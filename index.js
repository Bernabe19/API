
/*
Importación de módulos
*/
const express = require('express');
const cors = require('cors');
const fileUpload = require("express-fileupload");
const helmet = require("helmet");
const app = express();
const { dbConnection } = require('./configuracion/configdb.js');
const bodyParser = require('body-parser');

app.use(helmet());
// app.use(bodyParser.json())
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app.use(cors());
app.use(express.json());
app.use(fileUpload({
    fileSize: 5000000,
    fieldSize: 5000000,
    createParentPath: true,
    debug: true
}));

app.use('/api/login', require('./routes/auth'));
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/planes', require('./routes/planes'));
app.use('/api/suscripciones', require('./routes/suscripciones'));
app.use('/api/platos', require('./routes/platos'));


require('dotenv').config();
dbConnection();

app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en el puerto ' + process.env.PORT);
});
