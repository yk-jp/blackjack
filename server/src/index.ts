import express, { Application, Response, Request, NextFunction } from "express";
import mongoose from "mongoose";
import config from "./config/config";

const app: Application = express();

app.use(express.json())

mongoose.connect(config.db.URI).catch((e) => {
  console.error(e.message);
});

const db = mongoose.connection;

db.once('open',() => console.log("connected to database"));

app.get("/", async (req: Request, res: Response) => {

  res.send("enffvcffaffd");
});

app.listen(5000, () => {
  console.log("server is running");
});
