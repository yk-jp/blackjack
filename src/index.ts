import express,{Application,Response,Request,NextFunction} from 'express';

const app:Application = express();

app.get('/', (req:Request,res:Response) => { 
  res.send('hellfafaefefeao');
});

app.listen(5000,() => { 
  console.log("server is running");
})