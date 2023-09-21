import express from "express";
import cors from "../../middleware/cors";
import bodyParser from "body-parser";
import router from "../../routes";
import { connectToMongoDb } from "../../models/database/dbConfig";

export default function createServer(useDatabase: boolean = false) {
  const app = express();

  // implement cors for CORS protection
  app.use(cors);

  // implement body-parser for parsing request body
  app.use(bodyParser.json());

  if (useDatabase) {
    connectToMongoDb();
  }

  // implement routes for API endpoints
  app.use("/api", router);

  return app;
}
