import 'dotenv/config'
import express from 'express';
import connectDB  from "./config/connection.js";
import productRoutes from './routes/productRoutes.js';

const app = express();

//middleware
app.use(express.json()); // server will understand data sent from frontend

//database connection
connectDB();

//routes
app.use('/api/products', productRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
