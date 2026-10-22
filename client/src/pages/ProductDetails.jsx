import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  ShoppingCart,
  Star,
} from "lucide-react";
import { useState } from "react";

import { useCart } from "../context/CartContext";
import products from "../data/products";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const product = products.find(
    (item) => item.id === Number(id)
  );

  if (!product) {
    return (
      <main className="product-not-found">
        <p>AVERZA</p>

        <h1>Product Not Found</h1>

        <p>
          Sorry, the product you are looking for does not
          exist.
        </p>

        <Link to="/products" className="checkout-btn">
          View Products
        </Link>
      </main>
    );
  }

  const discount = Math.round(
    ((product.oldPrice - product.price) /
      product.oldPrice) *
      100
  );

  const handleDecrease = () => {
    setQuantity((current) =>
      current > 1 ? current - 1 : 1
    );
  };

  const handleIncrease = () => {
    setQuantity((current) => current + 1);
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 1500);
  };

  const handleBuyNow = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }

    navigate("/checkout");
  };

  return (
    <main className="product-details-page">
      <div className="product-details-container">

        {/* BACK */}

        <Link
          to="/products"
          className="details-back-link"
        >
          <ArrowLeft size={17} />
          Back to Products
        </Link>

        {/* PRODUCT */}

        <section className="product-details">

          {/* IMAGE */}

          <div className="details-image">

            <img
              src={product.image}
              alt={product.name}
              className="details-product-photo"
            />

            <span className="details-category">
              {product.category}
            </span>

            <span className="details-discount">
              {discount}% OFF
            </span>

          </div>

          {/* CONTENT */}

          <div className="details-content">

            <p className="product-category">
              {product.category}
            </p>

            <h1>{product.name}</h1>

            {/* RATING */}

            <div className="details-rating">

              <Star
                size={17}
                fill="currentColor"
              />

              <strong>{product.rating}</strong>

              <span>
                ({product.reviews} reviews)
              </span>

            </div>

            {/* PRICE */}

            <div className="details-price">

              <strong>
                ₹{product.price.toLocaleString("en-IN")}
              </strong>

              <del>
                ₹
                {product.oldPrice.toLocaleString(
                  "en-IN"
                )}
              </del>

            </div>

            {/* DESCRIPTION */}

            <p className="details-description">
              {product.description}
            </p>

            {/* QUANTITY */}

            <div className="quantity">

              <button
                type="button"
                onClick={handleDecrease}
                aria-label="Decrease quantity"
              >
                <Minus size={15} />
              </button>

              <span>{quantity}</span>

              <button
                type="button"
                onClick={handleIncrease}
                aria-label="Increase quantity"
              >
                <Plus size={15} />
              </button>

            </div>

            {/* ACTIONS */}

            <div className="details-actions">

              <button
                type="button"
                className="add-cart-btn"
                onClick={handleAddToCart}
              >
                <ShoppingCart size={18} />

                {added
                  ? "Added to Cart"
                  : "Add to Cart"}
              </button>

              <button
                type="button"
                className="buy-now-btn"
                onClick={handleBuyNow}
              >
                Buy Now
                <ArrowRight size={18} />
              </button>

            </div>

            {added && (
              <p className="added-message">
                Product added to your cart successfully.
              </p>
            )}

          </div>

        </section>

      </div>
    </main>
  );
}

export default ProductDetails;