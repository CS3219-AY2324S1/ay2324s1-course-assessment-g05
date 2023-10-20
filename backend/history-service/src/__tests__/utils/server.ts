import express from "express";
import cors from "../../middleware/cors";
import bodyParser from "body-parser";
import router from "../../routes";

export default function createUnitTestServer() {
  const app = express();

  // implement cors for CORS protection
  app.use(cors);

  // implement body-parser for parsing request body
  app.use(bodyParser.json());

  const NODE_ENV = process.env.NODE_ENV || "test";
  // implement routes for API endpoints
  app.use(`/${NODE_ENV}/history/api`, router);

  return app;
}
