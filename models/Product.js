import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },  
    description:{
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min:[0.01, 'price must be greater than 0']
    },
    category:{
        type: String,
        required: true
    },
    inStock:{
        type: Boolean,
        default: true
    
    },

    tags:[String],
    createdAt:{
        type: Date,
        default: Date.now
    }

})

export default mongoose.model('product', productSchema);