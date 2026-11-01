import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";

import api from "../services/api";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setError("");

      const response = await api.get("/admin/orders");

      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      console.error(
        "Failed to fetch admin orders:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load orders"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrders();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const handleStatusChange = async (
    orderId,
    field,
    value
  ) => {
    try {
      setError("");
      setUpdatingId(orderId);

      const response = await api.put(
        `/admin/orders/${orderId}/status`,
        {
          [field]: value,
        }
      );

      if (response.data.success) {
        setOrders((previousOrders) =>
          previousOrders.map((order) =>
            order._id === orderId
              ? response.data.order
              : order
          )
        );
      }
    } catch (error) {
      console.error(
        "Failed to update order:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to update order"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatOrderId = (id) => {
    return `#${id.slice(-8).toUpperCase()}`;
  };

  return (
    <main className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <div>
            <p>AVERZA ADMIN</p>
            <h1>Orders</h1>
            <span>
              Manage customer orders
            </span>
          </div>

          <div className="admin-orders-header-actions">
            <button
              type="button"
              className="admin-refresh-btn"
              onClick={fetchOrders}
              disabled={loading}
            >
              <RefreshCw size={17} />
              Refresh
            </button>

            <Link
              to="/admin"
              className="admin-back-btn"
            >
              <ArrowLeft size={17} />
              Dashboard
            </Link>
          </div>
        </div>

        {error && (
          <div className="admin-form-error">
            {error}
          </div>
        )}

        <section className="admin-section">
          {loading ? (
            <div className="admin-status">
              <p>AVERZA</p>
              <h1>Loading Orders...</h1>
              <span>
                Please wait while orders
                are being loaded.
              </span>
            </div>
          ) : orders.length === 0 ? (
            <div className="admin-status">
              <p>AVERZA</p>
              <ShoppingBag size={38} />
              <h1>No Orders Found</h1>
              <span>
                Customer orders will appear here.
              </span>
            </div>
          ) : (
            <div className="admin-orders-table">
              <div className="admin-order-row admin-order-heading">
                <span>Order</span>
                <span>Customer</span>
                <span>Total</span>
                <span>Payment</span>
                <span>Status</span>
                <span>Actions</span>
              </div>

              {orders.map((order) => (
                <div
                  className="admin-order-row"
                  key={order._id}
                >
                  <div className="admin-order-id">
                    <strong>
                      {formatOrderId(order._id)}
                    </strong>

                    <span>
                      {formatDate(order.createdAt)}
                    </span>
                  </div>

                  <div className="admin-order-customer">
                    <strong>
                      {order.user
                        ? `${order.user.firstName} ${order.user.lastName}`
                        : `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`}
                    </strong>

                    <span>
                      {order.user?.email ||
                        order.shippingAddress.email}
                    </span>
                  </div>

                  <strong className="admin-order-total">
                    ₹
                    {Number(
                      order.totalAmount
                    ).toLocaleString("en-IN")}
                  </strong>

                  <div className="admin-order-payment">
                    <span
                      className={`admin-payment-method ${order.paymentMethod}`}
                    >
                      {order.paymentMethod === "cod"
                        ? "COD"
                        : "Online"}
                    </span>

                    <select
                      value={order.paymentStatus}
                      disabled={
                        updatingId === order._id
                      }
                      onChange={(event) =>
                        handleStatusChange(
                          order._id,
                          "paymentStatus",
                          event.target.value
                        )
                      }
                    >
                      <option value="pending">
                        Pending
                      </option>

                      <option value="paid">
                        Paid
                      </option>

                      <option value="failed">
                        Failed
                      </option>
                    </select>
                  </div>

                  <select
                    className={`admin-order-status ${order.orderStatus}`}
                    value={order.orderStatus}
                    disabled={
                      updatingId === order._id
                    }
                    onChange={(event) =>
                      handleStatusChange(
                        order._id,
                        "orderStatus",
                        event.target.value
                      )
                    }
                  >
                    <option value="placed">
                      Placed
                    </option>

                    <option value="confirmed">
                      Confirmed
                    </option>

                    <option value="shipped">
                      Shipped
                    </option>

                    <option value="delivered">
                      Delivered
                    </option>

                    <option value="cancelled">
                      Cancelled
                    </option>
                  </select>

                  <div className="admin-order-actions">
                    <Link
                      to={`/orders/${order._id}`}
                      className="admin-order-view"
                      title="View Order"
                    >
                      <Eye size={17} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default AdminOrders;