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

let port = process.env.PORT;

var dummy: Question[] = [{
  id: '1',
  title: 'test',
  complexity: 'test'
},
{
  id: '2',
  title: 'test',
  complexity: 'test'
}, {
  id: '3',
  title: 'test',
  complexity: 'test'
}]

app.get('/', (req: Request, res: Response) => {
  res.send(dummy);
});

app.delete("/:id", (req: Request, res: Response) => {
  const id = req.params.id;

  const toBeDeleted = dummy.findIndex((object) => {
    return object.id === id;
  });

  if (toBeDeleted !== -1) {
    dummy.splice(toBeDeleted, 1);
    res.status(200).json({
      message: 'deleted',
    })
  } else {
    res.status(500).json({
      message: 'error',
    })
  }

  
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});