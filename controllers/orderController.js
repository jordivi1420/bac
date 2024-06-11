const Order = require('../models/order')
const Product = require('../models/modelProduct')
const catchAsyncErrors = require('../middleware/CatchingAsyncErrors')
const ErrorHandler = require('../utils/errorHandler')

exports.newOrder = catchAsyncErrors(async(req,res,next)=>{
    const {
        order_item,
        informacion_pago,
        precio_articulo,
        impuesto_articulo,
        precio_compra,
        precio_total,
        informacion_compras
    } = req.body;

    for (const item of order_item) {
        const product = await Product.findById(item.modelProduct);
        if (!product || product.stock < item.cantidad) {
            return next(new ErrorHandler(`El producto ${item.nombre} no tiene suficiente stock disponible.`,400))
        }
    }


    const order = await Order.create({
        order_item,
        informacion_pago,
        precio_articulo,
        impuesto_articulo,
        precio_compra,
        precio_total,
        informacion_compras,
        pagar_en: Date.now(),
        user: req.user._id
    })

    for (const item of order_item) {
        await Product.findByIdAndUpdate(item.modelProduct, {
            $inc: { stock: -item.cantidad }
        });
    }

    res.status(200).json({
        success: true,
        order
    })

})
exports.getSingleOrder = catchAsyncErrors(async(req,res,next)=>{
    const order = await Order.findById(req.params.id).populate('user','nombre email');
    if(!order){
       return next(new ErrorHandler('esta orden no se encuentra ',404))
    }

    res.status(200).json({
        success: true,
        order
    })

})

exports.myOrders = catchAsyncErrors(async(req,res,next)=>{
    const orders = await Order.find({user:req.user.id})

    res.status(200).json({
        success: true,
        orders
    })

})

exports.getAllOrders = catchAsyncErrors(async(req,res,next)=>{
    const order =  await Order.find();
    let totalAlmount = 0;
    order.forEach(orders => {
        totalAlmount +=orders.precio_total;
    });
    res.status(200).json({
        success: true,
        totalAlmount,
        count: order.length,
        order
    })
})

exports.updateOrder = catchAsyncErrors(async(req,res,next)=>{
    const order =  await Order.findById(req.params.id);
    if(order.estado_orden==='entregado'){
        next(new ErrorHandler('su pedido ya ha sido entregado'),400)
    }
    order.order_item.forEach(async item=>{
        await updateStock(item.modelProduct,item.cantidad)
    })
    order.estado_orden = req.body.status,
    order.entrega_en = Date.now();
    await order.save();

    res.status(200).json({
        success: true,
    })
})

async function updateStock(id,cantidad) {
    const product = await Product.findById(id);
    product.stock = product.stock - cantidad
    await product.save({validateBeforeSave: false})

}

exports.deleteOrder = catchAsyncErrors(async(req,res,next)=>{
    const order = await Order.findById(req.params.id)
    if(!order){
       return next(new ErrorHandler('esta orden no se encuentra ',404))
    }

    await order.deleteOne();
    res.status(200).json({
        success: true
    })

})
