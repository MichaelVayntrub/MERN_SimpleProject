import mongoose from 'mongoose';
import Product from '../models/productModel.js';
import  Items from '../Items.json' assert { type: "json" };

export const getProducts = async (req,res) => {
    try {
        const products = await Product.find({}).sort({ image: -1 });
        const suppliers = products.map(product => product.supplier);

        res.status(200).json({ success: true, data: products, suppliers: suppliers });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server internal error." });
    }
};

export const getFilteredProducts = async (req, res) => {
    try {
        const { searchTerms } = req.body;
        const { searchByBarcode, searchByName, searchBySupplier } = searchTerms;
        let filter = {};
        
        if (searchByBarcode) {
            filter.$expr = {
                $regexMatch: {
                    input: { $toString: "$_id" }, // Convert to string
                    regex: `^${searchByBarcode}`,  // Ensure it starts with the search term
                    options: "i"
                }
            };
        }
        if (searchByName) {
            filter.name = { $regex: `(^|\\s)${searchByName}`, $options: "i" }; // Match whole word start
        }
        if (searchBySupplier) {
            filter.supplier = { $regex: `(^|\\s)${searchBySupplier}`, $options: "i" };
        }
        const products = await Product.find(filter).sort({ image: -1 }); // Directly query MongoDB
        res.status(200).json({ success: true, data: products });
    } catch (error) {
        console.error("Error fetching filtered products:", error);
        res.status(500).json({ success: false, message: "Server internal error." });
    }
};

export const addFromJson = async (req, res) => {
    try {
        await Product.deleteMany({});
        await Product.insertMany(Items);
        await getProducts(req,res);
        res.status(201).json({ success: true, message: 'Reset went successfully', data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Reset failed', error: error.message });
    }
};

export const addProduct = async (req, res) => {
    try {
        const { _id, name, price, image, supplier, editable } = req.body;

        let product = await Product.create({
            _id: _id,
            name: name,
            price: price || 0,
            newPrice: 0,
            image: image || "",
            supplier: supplier,
            editable: editable || "yes",
            discount: ""
        });

        res.status(201).json({ success: true, message: 'Product added successfully', data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to add product', error: error.message });
    }
};

export const deleteProduct = async (req,res) => {
    const { id } =  req.params;

    try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        
        if (!deletedProduct) {
            return res.status(404).json({ success: false, message: "המוצר לא קיים" });
        }
        const products = await Product.find({}).sort({ image: -1 });
        const suppliers = products.map(product => product.supplier);
        res.status(200).json({ success: true, message: 'Product deleted successfully', data: products, suppliers: suppliers});
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete product', error: error.message });
    }
};

export const updatePrice = async (req, res) => {
    const { type, value, newPrice, discount } = req.body;

    try {
        let filter = {};
        
        if (type === "single") {
            const updatedProduct = await Product.findByIdAndUpdate(value, { newPrice: newPrice, discount: discount}, { new: true });
            if (updatedProduct) {
                res.status(200).json({ message: 'Product price updated successfully', product: updatedProduct });
            } else {
                res.status(404).json({ message: 'Product not found' });
            }
        } 
        else if (type === "supplier" || type === "all") {
            if (type === "supplier") {
                filter.supplier = value;
            }
            
            const updatedProducts = await Product.updateMany(
                filter,
                {
                  $set: { newPrice: newPrice, discount: discount }
                }
              );
          
            
            if (updatedProducts.modifiedCount > 0) {
                res.status(200).json({ message: `${updatedProducts.modifiedCount} product(s) updated successfully` });
            } else {
                res.status(404).json({ message: 'No products found matching the criteria' });
            }
        } else {
            res.status(400).json({ message: 'Invalid update type' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};