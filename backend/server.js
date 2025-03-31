import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import productRoutes from './routes/productRoute.js'
import cors from "cors";
import items from "./Items.json" assert { type: "json" };

dotenv.config();
const app = express();
app.use(cors());
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use("/products", productRoutes);

app.listen(PORT, () => {
    connectDB(items);
    console.log(`Server started at http://localhost:${PORT}`);
});