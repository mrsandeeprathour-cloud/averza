import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log(
      `MongoDB connected: ${conn.connection.host}`
    );
  } catch (error) {
    console.error("\n========== MongoDB ERROR ==========");
    console.error("Name:", error.name);
    console.error("Message:", error.message);

    const servers = error.reason?.servers;

    if (servers) {
      console.error("\n========== SERVER DETAILS ==========");

      for (const [address, server] of servers) {
        console.error("\nSERVER:", address);
        console.error(
          "ERROR NAME:",
          server.error?.name
        );
        console.error(
          "ERROR MESSAGE:",
          server.error?.message
        );
        console.error(
          "ERROR CODE:",
          server.error?.code
        );
        console.error(
          "ERROR CAUSE:",
          server.error?.cause
        );
      }
    }

    console.error("\n====================================\n");

    process.exit(1);
  }
};

export default connectDB;

