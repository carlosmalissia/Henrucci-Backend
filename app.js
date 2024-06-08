// Importa las dependencias
/* sin EC6
const express = require('express');
const mongoose = require('mongoose'); 

con EC6
*/
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

//Importar las Rutas
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import productRoutes from "./routes/product.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import paginateRoutes from "./routes/paginate.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import searchRoutes from "./routes/search.routes.js";
import purchaseHistoryRoutes from "./routes/purchaseHistory.routes.js";
import filterRoutes from "./routes/filters.routes.js";
import photosRoutes from "./routes/photos.routes.js";

require('dotenv').config()

// Configura Express
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware paara Configurar bodyParser para analizar solicitudes JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Conexión a la base de datos MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Conexión a MongoDB Atlas establecida');
    }).catch((err) => {
        console.error('Error al conectar a MongoDB Atlas', err);
    });

// Definir los modelos: se exportan en la carpeta controllers 

// Rutas
app.use("/", authRoutes);
app.use("/", userRoutes);
app.use("/", adminRoutes);
app.use("/", categoryRoutes);
app.use("/", productRoutes);
app.use("/", paginateRoutes);
app.use("/", reviewRoutes);
app.use("/", searchRoutes);
app.use("/", purchaseHistoryRoutes);
app.use("/", filterRoutes);
app.use("/", photosRoutes);


// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
