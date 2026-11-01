import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// =========================
// GET ALL PRODUCTS
// =========================

router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Get products error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
});

// =========================
// GET SINGLE PRODUCT
// =========================

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Get product error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch product",
    });
  }
});

// =========================
// CREATE PRODUCT
// =========================

router.post("/", async (req, res) => {
  try {
    const {
      name,
      category,
      price,
      oldPrice,
      rating,
      reviews,
      image,
      description,
      stock,
    } = req.body;

    if (
      !name ||
      !category ||
      price === undefined ||
      oldPrice === undefined ||
      !image ||
      !description ||
      stock === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required product fields",
      });
    }

    const product = await Product.create({
      name,
      category,
      price,
      oldPrice,
      rating: rating || 0,
      reviews: reviews || 0,
      image,
      description,
      stock,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create product error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create product",
    });
  }
});

// =========================
// UPDATE PRODUCT
// =========================

router.put("/:id", async (req, res) => {
  try {
    const {
      name,
      category,
      price,
      oldPrice,
      rating,
      reviews,
      image,
      description,
      stock,
    } = req.body;

    if (
      !name ||
      !category ||
      price === undefined ||
      oldPrice === undefined ||
      !image ||
      !description ||
      stock === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required product fields",
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        category,
        price,
        oldPrice,
        rating: rating ?? 0,
        reviews: reviews ?? 0,
        image,
        description,
        stock,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Update product error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update product",
    });
  }
});

// =========================
// DELETE PRODUCT
// =========================

router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete product",
    });
  }
});

export default router;