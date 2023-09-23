import express from "express";
import cors from "../../middleware/cors";
import bodyParser from "body-parser";
import router from "../../routes";
import { connectToMongoDb } from "../../models/database/dbConfig";
import * as dotenv from "dotenv";

dotenv.config();

export default function createServer() {
  const app = express();

  // implement cors for CORS protection
  app.use(cors);

  // implement body-parser for parsing request body
  app.use(bodyParser.json());

  // implement routes for API endpoints
  app.use("/api", router);

  return app;
}

export async function createIntegrationServer() {
  const app = express();

  // implement cors for CORS protection
  app.use(cors);

  // implement body-parser for parsing request body
  app.use(bodyParser.json());

  // connect to the database
  connectToMongoDb();

  // implement routes for API endpoints
  app.use("/api", router);

  return app;
}
