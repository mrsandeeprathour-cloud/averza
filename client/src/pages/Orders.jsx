import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function Orders() {
  const { user, isAuthenticated } = useAuth();

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated || !user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const response = await api.get(
          `/orders/user/${user.id}`
        );

        if (response.data.success) {
          setOrders(response.data.orders);
        } else {
          setError(
            "Unable to load your orders."
          );
        }
      } catch (error) {
        console.error(
          "Fetch orders error:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Unable to load your orders. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, user?.id]);

  if (!isAuthenticated) {
    return (
      <main className="orders-page">
        <div className="orders-header">
          <p>AVERZA</p>
          <h1>My Orders</h1>
          <span>
            View and track your orders
          </span>
        </div>

        <div className="orders-status">
          <h2>Please Login</h2>

          <p>
            Login to view your orders.
          </p>

          <Link
            to="/login"
            className="checkout-btn"
          >
            Login
          </Link>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="orders-page">
        <div className="orders-header">
          <p>AVERZA</p>
          <h1>My Orders</h1>
          <span>
            View and track your orders
          </span>
        </div>

        <div className="orders-status">
          <p>Loading your orders...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="orders-page">
        <div className="orders-header">
          <p>AVERZA</p>
          <h1>My Orders</h1>
          <span>
            View and track your orders
          </span>
        </div>

        <div className="orders-status orders-error">
          <h2>Something went wrong</h2>

          <p>{error}</p>

          <button
            type="button"
            onClick={() =>
              window.location.reload()
            }
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  if (orders.length === 0) {
    return (
      <main className="orders-page">
        <div className="orders-header">
          <p>AVERZA</p>
          <h1>My Orders</h1>
          <span>
            View and track your orders
          </span>
        </div>

        <div className="orders-status">
          <h2>No Orders Yet</h2>

          <p>
            You haven't placed any orders yet.
          </p>

          <Link
            to="/products"
            className="checkout-btn"
          >
            Start Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="orders-page">
      <div className="orders-header">
        <p>AVERZA</p>

        <h1>My Orders</h1>

        <span>
          View and track your orders
        </span>
      </div>

      <div className="orders-container">
        {orders.map((order) => (
          <article
            className="order-card"
            key={order._id}
          >
            <div className="order-card-header">
              <div>
                <span className="order-label">
                  Order ID
                </span>

                <strong className="order-id-text">
                  {order._id}
                </strong>
              </div>

              <div className="order-date">
                <span className="order-label">
                  Ordered On
                </span>

                <strong>
                  {new Date(
                    order.createdAt
                  ).toLocaleDateString(
                    "en-IN",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }
                  )}
                </strong>
              </div>
            </div>

            <div className="order-status-row">
              <div>
                <span className="order-label">
                  Order Status
                </span>

                <span
                  className={`order-status order-status-${order.orderStatus}`}
                >
                  {order.orderStatus}
                </span>
              </div>

              <div>
                <span className="order-label">
                  Payment
                </span>

                <strong>
                  {order.paymentMethod ===
                  "cod"
                    ? "Cash on Delivery"
                    : "Online Payment"}
                </strong>
              </div>

              <div>
                <span className="order-label">
                  Payment Status
                </span>

                <strong>
                  {order.paymentStatus}
                </strong>
              </div>
            </div>

            <div className="order-items">
              {order.items.map(
                (item, index) => (
                  <div
                    className="order-item"
                    key={`${order._id}-${index}`}
                  >
                    <div className="order-item-image">
                      <img
                        src={item.image}
                        alt={item.name}
                      />
                    </div>

                    <div className="order-item-info">
                      <strong>
                        {item.name}
                      </strong>

                      <span>
                        Quantity:{" "}
                        {item.quantity}
                      </span>

                      <span>
                        ₹
                        {item.price.toLocaleString(
                          "en-IN"
                        )}{" "}
                        each
                      </span>
                    </div>

                    <strong className="order-item-total">
                      ₹
                      {(
                        item.price *
                        item.quantity
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </strong>
                  </div>
                )
              )}
            </div>

            <div className="order-card-footer">
              <div className="order-total-row">
                <span>
                  Subtotal
                </span>

                <strong>
                  ₹
                  {order.subtotal.toLocaleString(
                    "en-IN"
                  )}
                </strong>
              </div>

              <div className="order-total-row">
                <span>
                  Delivery
                </span>

                <strong>
                  ₹
                  {order.deliveryCharge.toLocaleString(
                    "en-IN"
                  )}
                </strong>
              </div>

              <div className="order-total-row order-grand-total">
                <span>
                  Total
                </span>

                <strong>
                  ₹
                  {order.totalAmount.toLocaleString(
                    "en-IN"
                  )}
                </strong>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

export default Orders;