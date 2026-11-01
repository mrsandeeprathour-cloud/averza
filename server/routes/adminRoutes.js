import express from "express";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import User from "../models/user.js";

const router = express.Router();

// =========================
// GET ADMIN DASHBOARD STATS
// =========================

router.get("/stats", async (req, res) => {
  try {
    const [
      totalProducts,
      totalOrders,
      totalUsers,
    ] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments(),
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        totalProducts,
        totalOrders,
        totalUsers,
      },
    });
  } catch (error) {
    console.error(
      "Get admin stats error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin statistics",
    });
  }
});

// =========================
// GET ALL ADMIN ORDERS
// =========================

router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate(
        "user",
        "firstName lastName email phone"
      )
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error(
      "Get admin orders error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin orders",
    });
  }
});

// =========================
// UPDATE ORDER STATUS
// =========================

router.put("/orders/:id/status", async (req, res) => {
  try {
    const {
      orderStatus,
      paymentStatus,
    } = req.body;

    const validOrderStatuses = [
      "placed",
      "confirmed",
      "shipped",
      "delivered",
      "cancelled",
    ];

    const validPaymentStatuses = [
      "pending",
      "paid",
      "failed",
    ];

    if (
      orderStatus !== undefined &&
      !validOrderStatuses.includes(orderStatus)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    if (
      paymentStatus !== undefined &&
      !validPaymentStatuses.includes(
        paymentStatus
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment status",
      });
    }

    const updateData = {};

    if (orderStatus !== undefined) {
      updateData.orderStatus = orderStatus;
    }

    if (paymentStatus !== undefined) {
      updateData.paymentStatus = paymentStatus;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No status changes provided",
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).populate(
      "user",
      "firstName lastName email phone"
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error(
      "Update admin order status error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update order status",
    });
  }
});

export default router;