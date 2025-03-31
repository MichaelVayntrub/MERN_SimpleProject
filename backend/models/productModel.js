import { mongoose, Schema } from 'mongoose';

const productSchema = new mongoose.Schema({
    _id:{
        type: Number,
        required: true
    },
    name:{
        type: String,
        required: true 
    },
    price:{
        type: Number,
        required: true
    },
    newPrice:{
        type: Number,
        required: true
    },
    image:{
        type: String,
        required: false
    },
    supplier:{
        type: String,
        required: true
    },
    editable:{
        type: String,
        required: true
    },
    discount:{
        type: String,
        required: false
    }
});

const Product = mongoose.model('Product', productSchema, "products");

export default Product;