import mongoose from 'mongoose';
import dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error('Please define the MONGO_URI environment variable');
}

// 1. Check if we already have a connection stored in the global scope
let cached = global.mongoose;

// 2. If not, initialize the cache object
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  // 3. If a connection exists, return it immediately (Re-use!)
  if (cached.conn) {
    return cached.conn;
  }

  // 4. If no connection promise exists, create one
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Don't wait forever; fail fast if offline
    };

    cached.promise = mongoose.connect(MONGO_URI, opts).then((mongoose) => {
      console.log("✅ New MongoDB Connection Established");
      return mongoose;
    });
  }

  // 5. Await the promise and store the connection
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
