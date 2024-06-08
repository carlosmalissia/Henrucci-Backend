"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _express = _interopRequireDefault(require("express"));
var _mongoose = _interopRequireDefault(require("mongoose"));
var _bodyParser = _interopRequireDefault(require("body-parser"));
var _authRoutes = _interopRequireDefault(require("./routes/auth.routes.js"));
var _userRoutes = _interopRequireDefault(require("./routes/user.routes.js"));
var _adminRoutes = _interopRequireDefault(require("./routes/admin.routes.js"));
var _productRoutes = _interopRequireDefault(require("./routes/product.routes.js"));
var _categoryRoutes = _interopRequireDefault(require("./routes/category.routes.js"));
var _paginateRoutes = _interopRequireDefault(require("./routes/paginate.routes.js"));
var _reviewRoutes = _interopRequireDefault(require("./routes/review.routes.js"));
var _searchRoutes = _interopRequireDefault(require("./routes/search.routes.js"));
var _purchaseHistoryRoutes = _interopRequireDefault(require("./routes/purchaseHistory.routes.js"));
var _filtersRoutes = _interopRequireDefault(require("./routes/filters.routes.js"));
var _photosRoutes = _interopRequireDefault(require("./routes/photos.routes.js"));
// Importa las dependencias
/* sin EC6
const express = require('express');
const mongoose = require('mongoose'); 

con EC6
*/

//Importar las Rutas

require('dotenv').config();

// Configura Express
var app = (0, _express["default"])();
var PORT = process.env.PORT || 9000;

// Middleware paara Configurar bodyParser para analizar solicitudes JSON
app.use(_bodyParser["default"].urlencoded({
  extended: true
}));
app.use(_bodyParser["default"].json());

// Conexión a la base de datos MongoDB
_mongoose["default"].connect(process.env.MONGODB_URI).then(function () {
  console.log('Conexión a MongoDB Atlas establecida');
})["catch"](function (err) {
  console.error('Error al conectar a MongoDB Atlas', err);
});

// Definir los modelos: se exportan en la carpeta controllers 

// Rutas
/* app.use("/", authRoutes);
app.use("/", userRoutes);
app.use("/", adminRoutes);
app.use("/", categoryRoutes); */
app.use("/", _productRoutes["default"]);
/* app.use("/", paginateRoutes);
app.use("/", reviewRoutes);
app.use("/", searchRoutes);
app.use("/", purchaseHistoryRoutes);
app.use("/", filterRoutes);
app.use("/", photosRoutes); */

// Iniciar el servidor
app.listen(PORT, function () {
  console.log("Servidor corriendo en el puerto ".concat(PORT));
});