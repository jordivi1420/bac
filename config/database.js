const mongoose = require('mongoose');

const connectDataBase = () => {
    mongoose.connect(process.env.DB_URI, {
    }).then(con => {
        console.log(`Conectado al host ${con.connection.host}`);
        console.log(process.env.DB_URI)
    }).catch(err => {
        console.error('Error al conectar a la base de datos:', err.message);
        process.exit(1);
    });
}

module.exports = connectDataBase;
