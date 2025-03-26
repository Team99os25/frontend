import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

let db: PostgresJsDatabase<typeof schema> | null = null;

const createDB = async () => {
    if (!db) {
        db = await drizzle(process.env.DATABASE_URL!);
    }
    return db;
};

export default createDB;
