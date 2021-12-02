import dotenv from "dotenv";

if (process.env.NODE_ENV === "dev") dotenv.config({ path: __dirname + "/dev.env" }); //environment variables for development

else if(process.env.NODE_ENV === "prod") dotenv.config({ path:__dirname +  "/prod.env" }); //override a configuration for production

const db = {
  URI: process.env.MONGO_URI || "mongodb://localhost:27017/blackjackDB",
};

const config = {
  db: db,
};

export default config;
