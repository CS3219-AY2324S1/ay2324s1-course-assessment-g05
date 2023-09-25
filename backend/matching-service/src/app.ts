import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import router from "./routes";
import bodyParser from "body-parser";
import HttpStatusCode from "./lib/enums/HttpStatusCode";
import cors, {corsOptions} from "./middleware/cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { SocketHandler } from "./controllers";

dotenv.config();

const app = express();

// implement cors for CORS protection
app.use(cors);

// implement body-parser for parsing request body
app.use(bodyParser.json());

// implement routes for API endpoints
app.use("/api", router);

app.all("*", (req: Request, res: Response) => {
  res.status(HttpStatusCode.NOT_FOUND).json({
    error: "NOT FOUND",
    message: "The requested resource could not be found.",
  });
});

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: corsOptions,
  path:'/socket/matching/'
});

io.on("connection", SocketHandler);
io.on("connection_error", (error) => {
  console.log(error);
});

httpServer.listen(process.env.SERVICE_PORT, () => {
  console.log(`Server running on port ${process.env.SERVICE_PORT}`);
});