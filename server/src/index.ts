import express, { Application, Response, Request, NextFunction } from "express";
import mongoose from "mongoose";
import config from "./config/config";
import Table from "./class/Table";
import cors from 'cors';

const app: Application = express();

// cors

app.use(cors(
  {
    origin: "http://localhost:3000",
    credentials: true,
    allowedHeaders: ['Origin','X-Requested-With','Content-Type','Accept','Authorization']
  }
));

app.use(express.json())

mongoose.connect(config.db.URI).catch((e) => {
  console.error(e.message);
});

const db = mongoose.connection;

db.once('open',() => console.log("connected to database"));

app.get("/", async (req: Request, res: Response) => {
  const table:Table = new Table("blackjack","user");
  res.json(table);
});

app.listen(5000, () => {
  console.log("server is running");
});
