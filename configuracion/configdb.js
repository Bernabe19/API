
const mongoose = require('mongoose');

const dbConnection = async() => {
    try {
        //Inserta en base de datos solamente los elementos definidos en cada Schema
        mongoose.set("strictQuery",false);
        await mongoose.connect(process.env.DBCONNECTION, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('DB online');
    } catch (error) {
        console.log(error);
        throw new Error('Error al iniciar la BD');
    }
}

module.exports = {
    dbConnection
}