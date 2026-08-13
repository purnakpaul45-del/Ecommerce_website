import "dotenv/config";
import bcrypt from "bcrypt";
import connectDB from "./config/mongoDB.js";
import adminModel from "./models/adminModel.js";

const createAdmin = async () => {
  try {
    await connectDB();

    const email = "admin@example.com";
    const password = "admin123";

    const existingAdmin = await adminModel.findOne({
      email: email.toLowerCase(),
    });

    if (existingAdmin) {
      console.log("Admin already exists.");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await adminModel.create({
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    console.log("Admin created successfully!");
    console.log("Email:", admin.email);
    console.log("Password:", password);

    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();