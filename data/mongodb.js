import { MongoClient } from "mongodb";

const globalForMongo = globalThis;

export async function getDatabase() {
  const uri = process.env.MONGODB_URI;
  const databaseName = process.env.MONGODB_DB_NAME;

  if (!uri || !databaseName) {
    throw new Error("MongoDB is not configured.");
  }
  if (
    databaseName.length > 64 ||
    /[\s/\\."$*<>:|?\u0000]/.test(databaseName)
  ) {
    throw new Error(
      "MONGODB_DB_NAME must be at most 64 characters and cannot contain spaces or MongoDB-reserved characters."
    );
  }

  if (!globalForMongo.mongoClientPromise) {
    const client = new MongoClient(uri);
    globalForMongo.mongoClientPromise = client.connect();
  }

  const client = await globalForMongo.mongoClientPromise;
  return client.db(databaseName);
}
