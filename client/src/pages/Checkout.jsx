import { Link } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../context/CartContext";

function Checkout() {
  const { cartItems } = useCart();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pinCode: "",
  });

  const [errors, setErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [orderPlaced, setOrderPlaced] = useState(false);

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
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
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "This field is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "This field is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "This field is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email.trim()
      )
    ) {
      newErrors.email =
        "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "This field is required";
    } else if (
      !/^[6-9]\d{9}$/.test(formData.phone.trim())
    ) {
      newErrors.phone =
        "Please enter a valid 10-digit Indian phone number";
    }

    if (!formData.address.trim()) {
      newErrors.address = "This field is required";
    }

    if (!formData.city.trim()) {
      newErrors.city = "This field is required";
    }

    if (!formData.pinCode.trim()) {
      newErrors.pinCode = "This field is required";
    } else if (
      !/^\d{6}$/.test(formData.pinCode.trim())
    ) {
      newErrors.pinCode =
        "Please enter a valid 6-digit PIN code";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) {
      return;
    }

    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    setOrderPlaced(true);
  };

  /* EMPTY CART */

  if (cartItems.length === 0) {
    return (
      <main className="checkout-page">
        <div className="empty-cart">
          <p>AVERZA</p>

          <h1>Your Cart is Empty</h1>

          <p>
            Add some products to your cart before proceeding
            to checkout.
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

  /* ORDER SUCCESS */

  if (orderPlaced) {
    return (
      <main className="checkout-page">
        <div className="order-success">
          <p>AVERZA</p>

          <h1>Order Placed Successfully!</h1>

          <p>
            Thank you for shopping with Averza.
            Your order has been received.
          </p>

          <p>
            Payment Method:{" "}
            {paymentMethod === "cod"
              ? "Cash on Delivery"
              : "Online Payment"}
          </p>

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

  /* CHECKOUT */

  return (
    <main className="checkout-page">
      <div className="checkout-header">
        <p>AVERZA CHECKOUT</p>

        <h1>Complete Your Order</h1>
      </div>

      <div className="checkout-layout">
        {/* DELIVERY FORM */}

        <section className="checkout-form">
          <h2>Delivery Information</h2>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">
                First Name
              </label>

              <input
                id="firstName"
                type="text"
                name="firstName"
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={handleChange}
                autoComplete="given-name"
              />

              {errors.firstName && (
                <p className="field-error">
                  {errors.firstName}
                </p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="lastName">
                Last Name
              </label>

              <input
                id="lastName"
                type="text"
                name="lastName"
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={handleChange}
                autoComplete="family-name"
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
              autoComplete="email"
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
              placeholder="Enter 10-digit phone number"
              value={formData.phone}
              onChange={handleChange}
              maxLength={10}
              inputMode="numeric"
              autoComplete="tel"
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
              rows="4"
              placeholder="Enter your complete address"
              value={formData.address}
              onChange={handleChange}
              autoComplete="street-address"
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
                placeholder="Enter city"
                value={formData.city}
                onChange={handleChange}
                autoComplete="address-level2"
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
                placeholder="Enter 6-digit PIN code"
                value={formData.pinCode}
                onChange={handleChange}
                maxLength={6}
                inputMode="numeric"
                autoComplete="postal-code"
              />

              {errors.pinCode && (
                <p className="field-error">
                  {errors.pinCode}
                </p>
              )}
            </div>
          </div>

          {/* PAYMENT */}

          <h2 className="payment-title">
            Payment Method
          </h2>

          <label className="payment-option">
            <input
              type="radio"
              name="payment"
              value="cod"
              checked={paymentMethod === "cod"}
              onChange={(e) =>
                setPaymentMethod(e.target.value)
              }
            />

            <span>Cash on Delivery</span>
          </label>

          <label className="payment-option">
            <input
              type="radio"
              name="payment"
              value="online"
              checked={paymentMethod === "online"}
              onChange={(e) =>
                setPaymentMethod(e.target.value)
              }
            />

            <span>Online Payment</span>
          </label>

          <button
            type="button"
            className="place-order-btn"
            onClick={handlePlaceOrder}
          >
            Place Order
          </button>
        </section>

        {/* ORDER SUMMARY */}

        <aside className="checkout-summary">
          <h2>Order Summary</h2>

          {cartItems.map((item) => (
            <div
              className="checkout-product"
              key={item.id}
            >
              <span>
                {item.name} × {item.quantity}
              </span>

              <strong>
                ₹
                {(item.price * item.quantity).toLocaleString(
                  "en-IN"
                )}
              </strong>
            </div>
          ))}

          <hr />

          <div className="checkout-total">
            <span>Subtotal</span>

            <strong>
              ₹{subtotal.toLocaleString("en-IN")}
            </strong>
          </div>

          <div className="checkout-total">
            <span>Delivery</span>

            <strong>
              ₹{delivery.toLocaleString("en-IN")}
            </strong>
          </div>

          <div className="checkout-total final">
            <span>Total</span>

            <strong>
              ₹{total.toLocaleString("en-IN")}
            </strong>
          </div>

          <Link
            to="/cart"
            className="back-cart"
          >
            ← Back to Cart
          </Link>
        </aside>
      </div>
    </main>
  );
}

export default Checkout;