import express from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

const router = express.Router();

// =========================
// CREATE ORDER
// =========================

router.post("/", async (req, res) => {
  try {
    const {
      userId,
      items,
      shippingAddress,
      paymentMethod,
      subtotal,
      deliveryCharge,
      totalAmount,
    } = req.body;

    if (
      !userId ||
      !items ||
      items.length === 0 ||
      !shippingAddress ||
      !paymentMethod
    ) {
      return res.status(400).json({
        success: false,
        message: "Required order details are missing",
      });
    }

    if (!["cod", "online"].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method",
      });
    }

    // Verify products and create order items
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(
        item.productId
      );

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.name}`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `${product.name} does not have enough stock`,
        });
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.image,
      });
    }

    // Create order
    const order = await Order.create({
      user: userId,

      items: orderItems,

      shippingAddress: {
        firstName: shippingAddress.firstName,
        lastName: shippingAddress.lastName,
        email: shippingAddress.email,
        phone: shippingAddress.phone,
        address: shippingAddress.address,
        city: shippingAddress.city,
        pinCode: shippingAddress.pinCode,
      },

      paymentMethod,

      paymentStatus:
        paymentMethod === "cod"
          ? "pending"
          : "pending",

      orderStatus: "placed",

      subtotal,
      deliveryCharge,
      totalAmount,
    });

    // Reduce product stock
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.productId,
        {
          $inc: {
            stock: -item.quantity,
          },
        }
      );
    }

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: {
        id: order._id,
        totalAmount: order.totalAmount,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        createdAt: order.createdAt,
      },
    });
  } catch (error) {
    console.error("Create order error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create order",
    });
  }
});

// =========================
// GET USER ORDERS
// =========================

router.get("/user/:userId", async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.params.userId,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get user orders error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
});

// =========================
// GET SINGLE ORDER
// =========================

router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(
      req.params.id
    ).populate("items.product");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get order error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch order",
    });
  }
});

export default router;