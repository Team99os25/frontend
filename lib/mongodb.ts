import { MongoClient } from "mongodb";

const MONGO_DB_URL = process.env.MONGO_DB_URL;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!MONGO_DB_URL) {
  throw new Error("Please add your Mongo URI to .env.local");
}

if (process.env.NODE_ENV === "development") {
  //global variable to prevent multiple connections in dev mode
  if (!global._mongoClientPromise) {
    client = new MongoClient(MONGO_DB_URL, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
  console.log("Connected to MongoDB: development");
} else {
  // In production, create a new client without global variables
  client = new MongoClient(MONGO_DB_URL, options);
  clientPromise = client.connect();
  console.log("Connected to MongoDB: production");
}

export default clientPromise;
