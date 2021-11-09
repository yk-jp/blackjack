import express, { Application, Response, Request, NextFunction } from "express";
import mongoose from "mongoose";

const app: Application = express();

const URI: string = "mongodb://mongo:27017/blackjack";

mongoose.connect(URI).catch((e) => {
  console.error(e.message);
});

const db = mongoose.connection;

app.get("/", async (req: Request, res: Response) => {
  db.collection("users").insertOne({
    name: "Eddard Stark",
    title: "Warden of the North",
  });

  const result = db.collection("users").findOne({
    name: "Eddard Stark"
  });

  res.send(JSON.stringify(result) + "enfffd");
});

app.listen(5000, () => {
  console.log("server is running");
});
