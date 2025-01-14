import { MongoClient, Collection, Db } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const url = process.env.MONGO_URL || "mongodb://localhost:27017";
const dbName = process.env.MONGO_DB_NAME || "myDatabase";
const collections: { [key: string]: Collection } = {};

async function createMongoConnection() {
  try {
    const client = await MongoClient.connect(url);
    const db = client.db(dbName);
    addCollections(db);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

const addCollections = (db: Db) => {
  collections.users = db.collection("users");
  db.command({
    collMod: "users",
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["name", "email", "password"],
        properties: {
          name: {
            bsonType: "string",
            description: "must be a string and is required",
          },
          email: {
            bsonType: "string",
            description: "must be a string and is required",
          },
          password: {
            bsonType: "string",
            description: "must be a string and is required",
          },
        },
      },
    },
  });
  collections.users.createIndex({ email: 1 }, { unique: true });
};

export default createMongoConnection;
export { collections };