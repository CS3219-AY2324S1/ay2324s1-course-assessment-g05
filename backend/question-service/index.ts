import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import Question from '../../common/types/question';

dotenv.config();
const app = express();
const allowedOrigins = ['http://localhost:3000'];

const options: cors.CorsOptions = {
  origin: allowedOrigins
};
app.use(cors(options));
app.use(express.json());
app.use(morgan('combined'));

let port =  process.env.PORT;

app.get('/', (req: Request, res: Response) => {
    var q:Question[] = [
      {
        id: '121',
        title: 'test',
        complexity: 'test'
      }
    ]
    res.send(q);
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});