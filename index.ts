import express from "express";
import dotenv from "dotenv";

dotenv.config();
const port = process.env.PORT;

const app = express();
app.use(express.json());


//routers
const api = "api/";
app.use(`/${api}usuario`, );

app.listen(process.env.PORT, () => {
  console.log(`Application started on port ${port}`);
});