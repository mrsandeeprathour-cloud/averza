
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  ShoppingBag,
  Users,
  PlusCircle,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/admin/stats");

        if (response.data.success) {
          setStats(response.data.stats);
        }
      } catch (error) {
        console.error(
          "Failed to fetch admin stats:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    if (
      isAuthenticated &&
      user?.role === "admin"
    ) {
      fetchStats();
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <main className="admin-page">
        <div className="admin-status">
          <p>AVERZA</p>

          <h1>Access Denied</h1>

          <span>
            You do not have permission to access
            the admin panel.
          </span>

          <Link
            to="/"
            className="admin-back-btn"
          >
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <div className="admin-container">

        {/* =========================
            ADMIN HEADER
        ========================= */}

        <div className="admin-header">
          <div>
            <p>AVERZA ADMIN</p>

            <h1>Dashboard</h1>

            <span>
              Welcome back,{" "}
              {user?.firstName || "Admin"}
            </span>
          </div>

          <span className="admin-badge">
            ADMIN
          </span>
        </div>

        {/* =========================
            ADMIN STATS
        ========================= */}

        <div className="admin-stats">

          {/* TOTAL PRODUCTS */}

          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <Package size={22} />
            </div>

            <div>
              <span>Total Products</span>

              <strong>
                {loading
                  ? "..."
                  : stats.totalProducts}
              </strong>
            </div>
          </div>

          {/* TOTAL ORDERS */}

          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <ShoppingBag size={22} />
            </div>

            <div>
              <span>Total Orders</span>

              <strong>
                {loading
                  ? "..."
                  : stats.totalOrders}
              </strong>
            </div>
          </div>

          {/* TOTAL USERS */}

          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <Users size={22} />
            </div>

            <div>
              <span>Total Users</span>

              <strong>
                {loading
                  ? "..."
                  : stats.totalUsers}
              </strong>
            </div>
          </div>

        </div>

        {/* =========================
            QUICK ACTIONS
        ========================= */}

        <section className="admin-section">

          <div className="admin-section-header">
            <div>
              <p>MANAGEMENT</p>

              <h2>Quick Actions</h2>
            </div>
          </div>

          <div className="admin-actions">

            {/* MANAGE PRODUCTS */}

            <Link
              to="/admin/products"
              className="admin-action-card"
            >
              <Package size={24} />

              <div>
                <strong>
                  Manage Products
                </strong>

                <span>
                  Add, edit and delete products
                </span>
              </div>
            </Link>

            {/* ADD PRODUCT */}

            <Link
              to="/admin/products/new"
              className="admin-action-card"
            >
              <PlusCircle size={24} />

              <div>
                <strong>
                  Add Product
                </strong>

                <span>
                  Add a new product to Averza
                </span>
              </div>
            </Link>

            {/* MANAGE ORDERS */}

            <Link
              to="/admin/orders"
              className="admin-action-card"
            >
              <ShoppingBag size={24} />

              <div>
                <strong>
                  Manage Orders
                </strong>

                <span>
                  View and manage customer orders
                </span>
              </div>
            </Link>

          </div>

        </section>

      </div>
    </main>
  );
}

export default AdminDashboard;