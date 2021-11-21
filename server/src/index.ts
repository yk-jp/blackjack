import express, { Application, Response, Request, NextFunction } from "express";
import mongoose from "mongoose";
import config from "./config/config";

const app: Application = express();

mongoose.connect(config.db.URI).catch((e) => {
  console.error(e.message);
});

const db = mongoose.connection;

app.get("/", async (req: Request, res: Response) => {
  db.collection("users").insertOne({
    name: "Eddard Stark",
    title: "Warden of the North",
  });

  const result = db.collection("users").find({});

  console.log(result);

  res.send(JSON.stringify(result) + "enfffd");
});

app.listen(5000, () => {
  console.log("server is running");
});
