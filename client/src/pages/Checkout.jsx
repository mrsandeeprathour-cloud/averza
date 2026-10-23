import { useState } from "react";
import { Link } from "react-router-dom";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function Checkout() {
  const { cartItems, removeFromCart } = useCart();

  const { user, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pinCode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [orderPlaced, setOrderPlaced] = useState(false);

  const [orderId, setOrderId] = useState("");

  // Values saved before cart is cleared
  const [placedOrderTotal, setPlacedOrderTotal] = useState(0);

  const [placedPaymentMethod, setPlacedPaymentMethod] =
    useState("cod");

  const subtotal = cartItems.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  const delivery = subtotal > 0 ? 99 : 0;

  const total = subtotal + delivery;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: "",
    }));

    setServerError("");
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName =
        "This field is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName =
        "This field is required";
    }

    if (!formData.email.trim()) {
      newErrors.email =
        "This field is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email.trim()
      )
    ) {
      newErrors.email =
        "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone =
        "This field is required";
    } else if (
      !/^[6-9]\d{9}$/.test(
        formData.phone.trim()
      )
    ) {
      newErrors.phone =
        "Please enter a valid 10-digit Indian phone number";
    }

    if (!formData.address.trim()) {
      newErrors.address =
        "This field is required";
    }

    if (!formData.city.trim()) {
      newErrors.city =
        "This field is required";
    }

    if (!formData.pinCode.trim()) {
      newErrors.pinCode =
        "This field is required";
    } else if (
      !/^\d{6}$/.test(
        formData.pinCode.trim()
      )
    ) {
      newErrors.pinCode =
        "Please enter a valid 6-digit PIN code";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    setServerError("");

    if (cartItems.length === 0) {
      setServerError(
        "Your cart is empty."
      );

      return;
    }

    if (!isAuthenticated || !user?.id) {
      setServerError(
        "Please login before placing an order."
      );

      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);

      const orderItems = cartItems.map(
        (item) => ({
          productId:
            item._id || item.id,

          name: item.name,

          quantity: item.quantity,
        })
      );

      const response = await api.post(
        "/orders",
        {
          userId: user.id,

          items: orderItems,

          shippingAddress: {
            firstName:
              formData.firstName.trim(),

            lastName:
              formData.lastName.trim(),

            email:
              formData.email.trim(),

            phone:
              formData.phone.trim(),

            address:
              formData.address.trim(),

            city:
              formData.city.trim(),

            pinCode:
              formData.pinCode.trim(),
          },

          paymentMethod,

          subtotal,

          deliveryCharge: delivery,

          totalAmount: total,
        }
      );

      if (response.data.success) {
        // Save order information BEFORE clearing cart
        setOrderId(
          response.data.order.id
        );

        setPlacedOrderTotal(
          response.data.order.totalAmount
        );

        setPlacedPaymentMethod(
          response.data.order.paymentMethod
        );

        // Clear cart
        cartItems.forEach((item) => {
          removeFromCart(
            item._id || item.id
          );
        });

        setOrderPlaced(true);
      }
    } catch (error) {
      console.error(
        "Place order error:",
        error
      );

      setServerError(
        error.response?.data?.message ||
          "Unable to place order. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // =========================
  // EMPTY CART
  // =========================

  if (
    cartItems.length === 0 &&
    !orderPlaced
  ) {
    return (
      <main className="checkout-page">
        <div className="checkout-header">
          <p>AVERZA</p>

          <h1>Checkout</h1>

          <span>
            Complete your order
          </span>
        </div>

        <div className="empty-cart">
          <p>AVERZA</p>

          <h1>Your Cart is Empty</h1>

          <p>
            Add some products before
            proceeding to checkout.
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

  // =========================
  // ORDER SUCCESS
  // =========================

  if (orderPlaced) {
    return (
      <main className="checkout-page">
        <div className="order-success">
          <p>AVERZA</p>

          <div className="success-icon">
            ✓
          </div>

          <h1>
            Order Placed Successfully
          </h1>

          <p>
            Thank you for shopping with
            Averza. Your order has been
            received successfully.
          </p>

          {orderId && (
            <p className="order-id">
              Order ID: {orderId}
            </p>
          )}

          <div className="success-details">
            <div>
              <span>Total Amount</span>

              <strong>
                ₹
                {placedOrderTotal.toLocaleString(
                  "en-IN"
                )}
              </strong>
            </div>

            <div>
              <span>Payment</span>

              <strong>
                {placedPaymentMethod === "cod"
                  ? "Cash on Delivery"
                  : "Online Payment"}
              </strong>
            </div>
          </div>

          <Link
            to="/products"
            className="checkout-btn"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  // =========================
  // CHECKOUT FORM
  // =========================

  return (
    <main className="checkout-page">
      <div className="checkout-header">
        <p>AVERZA</p>

        <h1>Checkout</h1>

        <span>
          Complete your order
        </span>
      </div>

      <form
        className="checkout-layout"
        onSubmit={handlePlaceOrder}
      >
        <section className="checkout-form">

          {/* SHIPPING INFORMATION */}

          <div className="checkout-section">
            <h2>
              Shipping Information
            </h2>

            <div className="form-row">

              <div className="form-group">
                <label htmlFor="checkout-first-name">
                  First Name
                </label>

                <input
                  id="checkout-first-name"
                  type="text"
                  name="firstName"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={handleChange}
                />

                {errors.firstName && (
                  <p className="field-error">
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="checkout-last-name">
                  Last Name
                </label>

                <input
                  id="checkout-last-name"
                  type="text"
                  name="lastName"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleChange}
                />

                {errors.lastName && (
                  <p className="field-error">
                    {errors.lastName}
                  </p>
                )}
              </div>

            </div>

            <div className="form-group">
              <label htmlFor="checkout-email">
                Email
              </label>

              <input
                id="checkout-email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />

              {errors.email && (
                <p className="field-error">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="checkout-phone">
                Phone Number
              </label>

              <input
                id="checkout-phone"
                type="tel"
                name="phone"
                placeholder="10-digit phone number"
                value={formData.phone}
                onChange={handleChange}
                maxLength={10}
                inputMode="numeric"
              />

              {errors.phone && (
                <p className="field-error">
                  {errors.phone}
                </p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="checkout-address">
                Address
              </label>

              <textarea
                id="checkout-address"
                name="address"
                placeholder="Enter your full address"
                value={formData.address}
                onChange={handleChange}
                rows={4}
              />

              {errors.address && (
                <p className="field-error">
                  {errors.address}
                </p>
              )}
            </div>

            <div className="form-row">

              <div className="form-group">
                <label htmlFor="checkout-city">
                  City
                </label>

                <input
                  id="checkout-city"
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                />

                {errors.city && (
                  <p className="field-error">
                    {errors.city}
                  </p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="checkout-pin">
                  PIN Code
                </label>

                <input
                  id="checkout-pin"
                  type="text"
                  name="pinCode"
                  placeholder="6-digit PIN"
                  value={formData.pinCode}
                  onChange={handleChange}
                  maxLength={6}
                  inputMode="numeric"
                />

                {errors.pinCode && (
                  <p className="field-error">
                    {errors.pinCode}
                  </p>
                )}
              </div>

            </div>
          </div>

          {/* PAYMENT METHOD */}

          <div className="checkout-section">
            <h2>
              Payment Method
            </h2>

            <div className="payment-options">

              <label
                className={`payment-option ${
                  paymentMethod === "cod"
                    ? "active"
                    : ""
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={
                    paymentMethod === "cod"
                  }
                  onChange={(e) =>
                    setPaymentMethod(
                      e.target.value
                    )
                  }
                />

                <span>
                  <strong>
                    Cash on Delivery
                  </strong>

                  <small>
                    Pay when your order
                    arrives
                  </small>
                </span>
              </label>

              <label
                className={`payment-option ${
                  paymentMethod === "online"
                    ? "active"
                    : ""
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="online"
                  checked={
                    paymentMethod === "online"
                  }
                  onChange={(e) =>
                    setPaymentMethod(
                      e.target.value
                    )
                  }
                />

                <span>
                  <strong>
                    Online Payment
                  </strong>

                  <small>
                    Pay securely online
                  </small>
                </span>
              </label>

            </div>
          </div>

          {serverError && (
            <p className="server-error">
              {serverError}
            </p>
          )}

        </section>

        {/* ORDER SUMMARY */}

        <aside className="checkout-summary">

          <h2>
            Order Summary
          </h2>

          <div className="checkout-items">

            {cartItems.map((item) => (
              <div
                className="checkout-item"
                key={
                  item._id || item.id
                }
              >
                <div className="checkout-item-image">
                  <img
                    src={item.image}
                    alt={item.name}
                  />
                </div>

                <div className="checkout-item-info">
                  <strong>
                    {item.name}
                  </strong>

                  <span>
                    Qty: {item.quantity}
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
            ))}

          </div>

          <div className="summary-row">
            <span>
              Subtotal
            </span>

            <span>
              ₹
              {subtotal.toLocaleString(
                "en-IN"
              )}
            </span>
          </div>

          <div className="summary-row">
            <span>
              Delivery
            </span>

            <span>
              ₹
              {delivery.toLocaleString(
                "en-IN"
              )}
            </span>
          </div>

          <hr />

          <div className="summary-total">
            <span>
              Total
            </span>

            <strong>
              ₹
              {total.toLocaleString(
                "en-IN"
              )}
            </strong>
          </div>

          <button
            type="submit"
            className="checkout-btn"
            disabled={isLoading}
          >
            {isLoading
              ? "Placing Order..."
              : "Place Order"}
          </button>

          <Link
            to="/cart"
            className="continue-shopping"
          >
            Back to Cart
          </Link>

        </aside>
      </form>
    </main>
  );
}

export default Checkout;