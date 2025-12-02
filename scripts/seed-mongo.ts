import "dotenv/config";
import { connectMongo, getTestModel, closeMongo } from "../lib/mongodb/client";

async function main() {
    console.log("Starting MongoDB (Mongoose) seed...");
    try {
        await connectMongo();
        const Test = getTestModel();
        const created = await Test.create({ name: "mongo-connect-test" });
        console.log("Inserted document id:", created._id.toString());
    } catch (e) {
        console.error("MongoDB seed failed:", (e as Error).message);
        process.exitCode = 1;
    } finally {
        await closeMongo();
    }
}

main()
    .then(() => console.log("MongoDB seed finished"))
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
