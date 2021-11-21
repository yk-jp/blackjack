import dotenv from'dotenv';

dotenv.config({path:'./dev.env'}); //environment variables for development

if(process.env.NODE_ENV === "prod") dotenv.config({path:'./prod.env'}); //override a configuration for production

const db = { 
  URI: process.env.URI || "mongodb://localhost:27017/blackjack"
}


const config = {
  db:db
}

export default config;