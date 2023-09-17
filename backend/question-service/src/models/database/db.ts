
import { MongoClient } from 'mongodb'
import * as dotenv from 'dotenv';
import * as path from 'path';

const envFilePath = path.join(__dirname, '..', '..', '..', '.env'); 
dotenv.config({ path: envFilePath });

const connectionString: string = process.env.CONNECTION_STRING!

// Connect to MongoDB
const client = new MongoClient(connectionString);
const db = client.db("peer_prep");
const coll = db.collection("questions");

export default coll;
