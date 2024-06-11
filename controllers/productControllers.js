const Product = require('../models/modelProduct')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('../middleware/CatchingAsyncErrors')
const ApiFactures = require('../utils/apiFactures');
const User  = require('../models/user')
//crear producto api/v1/product/new
exports.newProduct = catchAsyncErrors (async (req,res,next) =>{
    req.body.user = req.user.id;
    const product = await Product.create(req.body);
    res.status(201).json({
        succes: true,
        product
    })
})
//obtener productos mediante la ruta api/v1/products
exports.getProducts = catchAsyncErrors (async (req,res,next) =>{
    const resPerPage = 6;
    const productCount = await Product.countDocuments()
    const apiFactures = new ApiFactures(Product.find(), req.query)
                    .search()
                    .filter()
                    .pagination(resPerPage)
    const products = await apiFactures.query;
    let filteredProductCount = products.length;
    setTimeout(() => {
        res.status(200).json({
            succes: true,
            products,
            resPerPage,
            productCount,
            filteredProductCount,
            message: 'esta ruta de productos es toda la base de datos'
        
        })
    }, 2000);
        


})


exports.getAdminProducts = catchAsyncErrors (async (req,res,next) =>{
    const products = await Product.find();
        res.status(200).json({
            success: true,
            products
        
        })
        


})

exports.getSingleProduct = catchAsyncErrors (async (req,res,next) =>{
    
        const products = await Product.findById(req.params.id)
        if (!products){    
            return next(new ErrorHandler('product not found',404))
        }
        // Enviar una respuesta exitosa con los productos encontrados
        res.status(200).json({
            success: true,
            products,
        });

}
)
 // api/v1/update
exports.updateProduct = catchAsyncErrors (async (req,res,next) =>{
    try {
        let products = await Product.findById(req.params.id)
        if (!products){    
            return next(new ErrorHandler('product not found',404))
        }

        products = await Product.findByIdAndUpdate(req.params.id,req.body,{
            new: true,
            runValidators: true,
            useFindByIdAndModify: false
        })
        res.status(200).json({
            succes: true,
            products
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error en la operación' });
        
    }
})

exports.deleteProduct = catchAsyncErrors (async (req,res,next) =>{
    try {
        const products = await Product.findById(req.params.id);
        if (!products){    
            return next(new ErrorHandler('product not found',404))
        }
        await products.deleteOne();
        res.status(200).json({
            succes: true,
            message: 'producto eliminado'
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error en la operación' });
    }

}
)

exports.createProductComentReview = catchAsyncErrors(async(req,res,next)=>{
    const {rango_resena,comentario,productId} = req.body;
    const user = await User.findById(req.user.id);
    const review ={
        user: req.user._id,
        nombre_resenor: user.nombre,
        rango_resena: Number(rango_resena),
        comentario
    }
    const product = await Product.findById(productId);
    const isReviewed = product.resenas.find(
        r => r.user.toString() === req.user._id.toString()
    );

    if(isReviewed){
        product.resenas.forEach(review => {
            if(review.user.toString()=== req.user._id.toString()){
                review.comentario = comentario
                review.rango_resena = rango_resena
            }
        });
    }
    else{
        product.resenas.push(review)
        product.numero_resenas = product.resenas.length
    }
    product.rango = product.resenas.reduce((acc,item)=> item.rango_resena+acc,0)/product.resenas.length

    await product.save({validateBeforeSave: false})
    res.status(200).json({
        success: true
    })
})

exports.getReviews = catchAsyncErrors(async(req,res,next)=>{
    const product =  await Product.findById(req.query.id);
    res.status(200).json({
        succes: true,
        review: product.resenas
    })
})

exports.deleteReview = catchAsyncErrors(async(req,res,next)=>{
    const product =  await Product.findById(req.query.productId);
    const resenas = product.resenas.filter(resena => resena._id.toString() !== req.query.id.toString());
    const numero_resenas = resenas.length
    const rango = product.resenas.reduce((acc,item)=> item.rango_resena+acc,0)/resenas.length;
    console.log(resenas);
    await Product.findByIdAndUpdate(req.query.productId,{
        resenas,
        rango,
        numero_resenas
    },{
        new: true,
        runValidators: true,
        useFindByIdAndModify: false
    })
    res.status(200).json({
        succes: true
    })
})



