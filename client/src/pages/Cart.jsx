import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Cart() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
  } = useCart();

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const delivery = subtotal > 0 ? 99 : 0;
  const total = subtotal + delivery;

  if (cartItems.length === 0) {
    return (
      <main className="cart-page">
        <div className="empty-cart">
          <p>AVERZA</p>

          <h1>Your Cart is Empty</h1>

          <p>
            Looks like you haven't added anything to your cart yet.
          </p>

          <Link to="/products" className="checkout-btn">
            Start Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <div className="cart-header">
        <p>AVERZA</p>

        <h1>Your Shopping Cart</h1>
      </div>

      <div className="cart-layout">
        <section className="cart-items">
          {cartItems.map((item) => (
            <article className="cart-item" key={item.id}>
              <div className="cart-item-image">
                <img
                  src={item.image}
                  alt={item.name}
                />
              </div>

              <div className="cart-item-info">
                <p className="cart-item-category">
                  {item.category}
                </p>

                <h2>{item.name}</h2>

                <p className="cart-item-price">
                  ₹{item.price.toLocaleString("en-IN")}
                </p>

                <div className="quantity">
                  <button
                    type="button"
                    aria-label={`Decrease quantity of ${item.name}`}
                    onClick={() =>
                      updateQuantity(
                        item.id,
                        item.quantity - 1
                      )
                    }
                  >
                    -
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    type="button"
                    aria-label={`Increase quantity of ${item.name}`}
                    onClick={() =>
                      updateQuantity(
                        item.id,
                        item.quantity + 1
                      )
                    }
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  className="remove-cart-btn"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>
              </div>

              <strong className="cart-item-total">
                ₹
                {(item.price * item.quantity).toLocaleString(
                  "en-IN"
                )}
              </strong>
            </article>
          ))}
        </section>

        <aside className="cart-summary">
          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Subtotal</span>

            <span>
              ₹{subtotal.toLocaleString("en-IN")}
            </span>
          </div>

          <div className="summary-row">
            <span>Delivery</span>

            <span>
              ₹{delivery.toLocaleString("en-IN")}
            </span>
          </div>

          <hr />

          <div className="summary-total">
            <span>Total</span>

            <strong>
              ₹{total.toLocaleString("en-IN")}
            </strong>
          </div>

          <Link
            to="/checkout"
            className="checkout-btn"
          >
            Proceed to Checkout
          </Link>

          <Link
            to="/products"
            className="continue-shopping"
          >
            Continue Shopping
          </Link>
        </aside>
      </div>
    </main>
  );
}

export default Cart;