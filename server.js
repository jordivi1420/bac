const app = require('./app');
const connectDataBase = require('./config/database')
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config({ path: 'config/config.env' });

process.on('uncaughtException',err=>{
    console.log(`ERROR: ${err.stack}`);
    console.log('servidor bajado debido a algunas exepciones');
    process.exit(1)
})
//cargar la base de datos
connectDataBase();
// Imprimir información de depuración
console.log(`DEBUG: PORT=${process.env.PORT}, NODE_ENV=${process.env.NODE_ENV}`);

// Iniciar el servidor después de cargar las variables de entorno
const server =  app.listen(process.env.PORT, () => {
    console.log(`tu servidor esta corriendo en el puerto:${process.env.PORT} en el proceso ${process.env.NODE_ENV}`);
});

//manejador del handler
process.on('unhandledRejection',err=>{
    console.log(`ERROR: ${err.stack}`)
    console.log('Fallando debido al rechazo de cientos de promesas')
    server.close(()=>{
        process.exit(1)
    })
})