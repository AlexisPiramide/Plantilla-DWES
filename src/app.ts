import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import createMongoConnection from "../context/mongo.db";
//import usuarioRouter from "./usuarios/infraestructure/rest/usuarios.rest"


createMongoConnection();

dotenv.config();

const allowedOrigins = ["http://localhost:5173","http://localhost:5174",
  "http://44.212.1.19"];

  const options: cors.CorsOptions = {
  origin: allowedOrigins,
};

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

const app = express();
app.use(express.json());
app.use(cors(options));

//app.use(`/api/usuarios`, usuarioRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default app;