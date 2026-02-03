import express from "express";
import { bootstrap } from "./src/app.controller.js";
import chalk from "chalk"
import dotenv from "dotenv";
dotenv.config({path : "./src/config/.env.dev"})

const app = express();
const port = process.env.PORT || 5000;

await bootstrap(app,express);

app.listen(port , ()=>{
    console.log(chalk.bgBlue(chalk.black(`Server is running on port : ${port}`)));
})