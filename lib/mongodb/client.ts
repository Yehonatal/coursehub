import mongoose, { Connection, Model, Document, Schema } from "mongoose";

// Use a global cache to avoid creating multiple connections in development
declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace NodeJS {
        interface Global {
            mongoose?: typeof mongoose;
        }
    }
}

const uri = process.env.MONGODB_URI;
if (!uri) {
    // do not throw on import; allow callers to handle missing env during build
    // eslint-disable-next-line no-console
    console.warn(
        "MONGODB_URI not set — mongoose will not be initialized until connectMongo() is called"
    );
}

export async function connectMongo(): Promise<typeof mongoose> {
    if (mongoose.connection && mongoose.connection.readyState === 1)
        return mongoose;

    if (
        global.mongoose &&
        (global.mongoose.connection.readyState === 1 ||
            global.mongoose.connection.readyState === 2)
    ) {
        return global.mongoose;
    }

    if (!uri) throw new Error("MONGODB_URI is not set in environment");

    // recommended options
    await mongoose.connect(uri, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
    });

    global.mongoose = mongoose;
    return mongoose;
}

export interface TestDoc extends Document {
    name: string;
    createdAt: Date;
}

const TestSchema = new Schema<TestDoc>({
    name: { type: String, required: true },
    createdAt: { type: Date, default: () => new Date() },
});

export function getTestModel(): Model<TestDoc> {
    return mongoose.models.Test || mongoose.model<TestDoc>("Test", TestSchema);
}

export async function closeMongo(): Promise<void> {
    if (mongoose.connection && mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }
}
