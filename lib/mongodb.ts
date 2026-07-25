import "server-only";

import { MongoClient, type Db } from "mongodb";

// NEXT_MONGODB_URI is the name provisioned by the Vercel MongoDB Atlas
// integration, so it wins; MONGODB_URI is kept as a manual fallback.
const uri = process.env.NEXT_MONGODB_URI ?? process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB ?? "wallet-history";

if (!uri) {
  throw new Error("NEXT_MONGODB_URI (or MONGODB_URI) is not set. Add it to .env.local");
}

// Reuse the client across HMR reloads in dev and across lambda invocations in
// production, so we don't open a new connection pool on every request.
const globalForMongo = globalThis as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
};

const clientPromise =
  globalForMongo._mongoClientPromise ?? new MongoClient(uri).connect();

if (process.env.NODE_ENV !== "production") {
  globalForMongo._mongoClientPromise = clientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db(dbName);
}
