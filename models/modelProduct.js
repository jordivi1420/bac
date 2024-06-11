const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'Por favor ingrese el nombre del producto'],
        trim: true,
        maxLength: [100, 'El nombre del producto no puede superar los 100 caracteres']
    },
    descripcion: {
        type: String,
        trim: true,
        required: [true, 'ingrese descripcion del producto']
    },
    precio: {
        type: Number,
        required: [true, 'Por favor ingrese el precio del producto'],
        min: [0, 'El precio no puede ser inferior a 0']
    },
    categoria: {
        type: String,
        trim: true,
        maxLength: [50, 'El nombre de la categoría no puede superar los 50 caracteres'],
        enum:{
            values:[
                'computadores',
                'portatiles',
                'comida',
                'accesorios',
                'celular',
                'ropa',
                'lobros',
                'motos',
                'carros',
                'bicicletas',
                'colonias'
            ]
        }
    },
    disponible: {
        type: Boolean,
        default: true
    },
    fechaCreacion: {
        type: Date,
        default: Date.now
    },
    imagenes: [
        {
            public_id:{
                type: String,
                required: true,
            },
            url:{
                type: String,
                required: true,
            }

        }
    ],
    vendedor: {
        type: String,
        required: [true,'ingresar vendedor']

    },
    user:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    stock: {
        type: Number,
        required: [true, 'ingresar cantidad de productos'],
        maxLength: [5, 'numero maximo exedido']

    },

    rango: {
        type: Number,
        defaul: 0
    },

    numero_resenas:{
        type: Number,
        default: 0

    },
    resenas:[
    {
        user:{
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true
        },
        nombre_resenor:{
            type: String,
            required: true

        },
        rango_resena: {
            type: Number,
            required: true
        },
        comentario:{
            type: String,
            required: true

        }
    }
    ]


});

module.exports = mongoose.model('modelProduct', productSchema);
