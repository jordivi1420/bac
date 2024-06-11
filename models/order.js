const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    informacion_compras: {
        direccion: 
            {
                type: String,
                required: true 
            },
        telefono:{
            type: String,
            required: true
        },
        barrio:{
            type: String,
            required: true
        }
        
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    order_item:[
        {
            nombre:{
                type: String,
                required: true
            },
            cantidad:{
                type: Number,
                required: true
            },
            imagen:{
                type: String,
                required: true
            },
            precio:{
                type: Number,
                required: true
            },
            modelProduct:{
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'modelProduct'
            }

        }
    ],
    informacion_pago: {
        id:{
            type: String,

        },
        status:{
            type: String
        }
    },
        precio_articulo:{
            type: Number,
            required: true,
            default: 0.0
        },
        impuesto_articulo:{
            type: Number,
            required: true,
            default: 0.0
        },
        pagar_en:{
            type: Date
        },
        precio_envio:{
            type: Number,
            required: true,
            default: 0.0
        },
        precio_total:{
            type: Number,
            required: true,
            default: 0.0
        },
        precio_compra:{
            type: Number,
            required: true,
            default: 0.0
        },
        estado_orden:{
            type: String,
            required: true,
            default: 'procesando'
        },
        entrega_en:{
            type: Date
        },
        creado_en: {
            type: Date,
            default: Date.now()
        }

});

module.exports = mongoose.model('Order', orderSchema);
