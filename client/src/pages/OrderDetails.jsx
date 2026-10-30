import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function OrderDetails() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();

  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const response = await api.get(
          `/orders/${id}`
        );

        if (response.data.success) {
          const fetchedOrder = response.data.order;

          // Make sure the logged-in user can only view their own order.
          if (
            fetchedOrder.user?.toString() !==
            user?.id?.toString()
          ) {
            setError(
              "You are not authorized to view this order."
            );
            return;
          }

          setOrder(fetchedOrder);
        } else {
          setError("Order not found.");
        }
      } catch (error) {
        console.error(
          "Fetch order error:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Unable to load order. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [id, isAuthenticated, user?.id]);

  if (!isAuthenticated) {
    return (
      <main className="order-details-page">
        <div className="order-details-status">
          <h1>Please Login</h1>

          <p>
            Login to view your order details.
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
      <main className="order-details-page">
        <div className="order-details-status">
          <p>Loading order details...</p>
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="order-details-page">
        <div className="order-details-status">
          <p>AVERZA</p>

          <h1>Order Not Found</h1>

          <p>
            {error ||
              "The order you are looking for does not exist."}
          </p>

          <Link
            to="/orders"
            className="checkout-btn"
          >
            Back to My Orders
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="order-details-page">
      <div className="order-details-container">

        <Link
          to="/orders"
          className="order-back-link"
        >
          ← Back to My Orders
        </Link>

        <div className="order-details-header">
          <div>
            <p>AVERZA</p>

            <h1>
              Order Details
            </h1>

            <span>
              Order #{order._id}
            </span>
          </div>

          <span
            className={`order-status order-status-${order.orderStatus}`}
          >
            {order.orderStatus}
          </span>
        </div>

        <div className="order-details-grid">

          {/* ORDER ITEMS */}

          <section className="order-details-card">
            <h2>
              Ordered Products
            </h2>

            <div className="order-details-items">
              {order.items.map(
                (item, index) => (
                  <div
                    className="order-details-item"
                    key={`${order._id}-${index}`}
                  >
                    <div className="order-details-item-image">
                      <img
                        src={item.image}
                        alt={item.name}
                      />
                    </div>

                    <div className="order-details-item-info">
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

                    <strong>
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
          </section>

          {/* SHIPPING ADDRESS */}

          <section className="order-details-card">
            <h2>
              Shipping Address
            </h2>

            <div className="shipping-address">
              <strong>
                {order.shippingAddress.firstName}{" "}
                {order.shippingAddress.lastName}
              </strong>

              <p>
                {order.shippingAddress.address}
              </p>

              <p>
                {order.shippingAddress.city} -{" "}
                {order.shippingAddress.pinCode}
              </p>

              <p>
                Phone:{" "}
                {order.shippingAddress.phone}
              </p>

              <p>
                Email:{" "}
                {order.shippingAddress.email}
              </p>
            </div>
          </section>

          {/* PAYMENT */}

          <section className="order-details-card">
            <h2>
              Payment Information
            </h2>

            <div className="order-info-list">

              <div>
                <span>
                  Payment Method
                </span>

                <strong>
                  {order.paymentMethod ===
                  "cod"
                    ? "Cash on Delivery"
                    : "Online Payment"}
                </strong>
              </div>

              <div>
                <span>
                  Payment Status
                </span>

                <strong>
                  {order.paymentStatus}
                </strong>
              </div>

              <div>
                <span>
                  Order Status
                </span>

                <strong>
                  {order.orderStatus}
                </strong>
              </div>

              <div>
                <span>
                  Order Date
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
          </section>

          {/* ORDER SUMMARY */}

          <section className="order-details-card">
            <h2>
              Order Summary
            </h2>

            <div className="order-summary-details">

              <div>
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

              <div>
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

              <div className="order-summary-total">
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
          </section>

        </div>
      </div>
    </main>
  );
}

export default OrderDetails;