import express, { Application, Response, Request, NextFunction } from "express";
import mongoose from "mongoose";
import config from "./config/config";

const app: Application = express();

mongoose.connect(config.db.URI).catch((e) => {
  console.error(e.message);
});

const db = mongoose.connection;

app.get("/", async (req: Request, res: Response) => {
  // db.collection("users").insertOne({
  //   name: "Eddard Stark",
  //   title: "Warden of the North",
  // });

  // db.collection("")

  res.send("enffvcffaffd");
});

app.listen(5000, () => {
  console.log("server is running");
});
