import dotenv from "dotenv";
import mongoose from "mongoose";
import Product from "./models/Product.js";

dotenv.config();

const products = [
  {
    name: "Premium Headphones",
    category: "Electronics",
    price: 2499,
    oldPrice: 3299,
    rating: 4.8,
    reviews: 124,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80",
    description:
      "Experience clear and immersive sound with these premium wireless headphones.",
    stock: 25,
  },
  {
    name: "Classic Sneakers",
    category: "Fashion",
    price: 1999,
    oldPrice: 2799,
    rating: 4.7,
    reviews: 98,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80",
    description:
      "Comfortable everyday sneakers designed for style and long-lasting comfort.",
    stock: 30,
  },
  {
    name: "Smart Watch",
    category: "Electronics",
    price: 3499,
    oldPrice: 4499,
    rating: 4.9,
    reviews: 156,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80",
    description:
      "A modern smartwatch with useful features for your everyday lifestyle.",
    stock: 20,
  },
  {
    name: "Minimal Backpack",
    category: "Accessories",
    price: 1499,
    oldPrice: 1999,
    rating: 4.6,
    reviews: 76,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=80",
    description:
      "A clean and practical backpack perfect for college, work and travel.",
    stock: 35,
  },
  {
    name: "Cotton T-Shirt",
    category: "Fashion",
    price: 799,
    oldPrice: 1199,
    rating: 4.5,
    reviews: 112,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=80",
    description:
      "Soft and comfortable cotton t-shirt suitable for everyday wear.",
    stock: 50,
  },
  {
    name: "Wireless Mouse",
    category: "Electronics",
    price: 999,
    oldPrice: 1499,
    rating: 4.7,
    reviews: 89,
    image:
      "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=700&q=80",
    description:
      "Smooth and reliable wireless mouse for work, study and everyday use.",
    stock: 40,
  },
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected for product seeding");

    const existingProducts = await Product.countDocuments();

    if (existingProducts > 0) {
      console.log(
        `Products already exist (${existingProducts}). Seeding skipped.`
      );

      await mongoose.connection.close();
      process.exit(0);
    }

    await Product.insertMany(products);

    console.log(`${products.length} products added successfully.`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Product seeding failed:", error);

    await mongoose.connection.close();
    process.exit(1);
  }
};

seedProducts();