import express from 'express';
import Product from '../models/Product.js';

const router = express.Router()

//POST /api/products (Create a Product)

router.post('/', async(req, res) => {
    try{
        const product = new Product(req.body);
        const savedProduct = await product.save();
        res.status(201).json(savedProduct);

    }catch(err){
        res.status(400).json({message: err.message})
    }
});

//GET /api/products/:id (Read a Single Product)

router.get('/:id', async(req,res) => {
    try{
        const product = await Product.findById(req.param.id);

        if(!product){
            return res.status(404).json({message: "product not found"})
        }
        res.json(product);

    }catch(err){
        res.status(500).json({message: err.message});
    }
});

//PUT /api/products/:id (Update a Product)
router.put('/:id', async(req,res) => {
    try{
        const updateProduct = await Product.findByIdAndUpdate(
            req.params.id,   //find Id
            req.body,     //and change it with new id
            { new:true, runValidators:true }   //get new(updated ) data in response
        );
        if(!updateProduct) return res.status(404).json({message:"Product not found"});
        res.json(updateProduct);
    }catch(err){
        res.status(400).json({message: err.message});
    }
});
//DELETE /api/products/:id

router.delete('/:id',async(req,res) => {

    try{
        const product = await Product.findByIdAndDelete(req.param.id); //find product by using ID and Delete it
    if(!product){
        res.status(404).json({mess: "product not found"});
    }
    res.json({message:"product deleted successfully"})
    }catch(err){
        res.status(500).json({message: err.message})
    }
    
});

//GET /api/products (Read All Products with Advanced Querying)
router.get('/', async(req,res) => {
    try{

        //creating Query Object
        let QueryObj = {}
        const{ category, minPrice, maxPrice,sortBy,page=1, limit =10} = req.query;

        //FILTER According to category
        if (category){
            QueryObj.category =category;
        }

        //filter according to price
        if(minPrice || maxPrice){
            QueryObj.price = {};
            if(minPrice) QueryObj.price.$gte = Number(minPrice);
            if (maxPrice) QueryObj.price.$lte = Number(maxPrice);
        }

        //sort by asc and desc

        let sortOption = {};
        if (sortBy){
            const parts = sortBy.split('_');
            sortOption[parts[0]] = parts[1] === 'asc' ? 1 : -1;
        }else{
            sortOption.createdAt = -1
        }

        //pagination logic
        const skip = (Number(page) - 1) * Number(limit);


        //query in database
        const products = (await Product.find(QueryObj)).sort(sortOption).skip(skip).limit(Number(limit));

      res.status(200).json(products);

    }catch(err){
        res.status(500).json({message:err.message});
    }
});



export default router;