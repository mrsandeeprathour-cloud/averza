import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  ShoppingCart,
  Star,
} from "lucide-react";
import { useEffect, useState } from "react";

import { useCart } from "../context/CartContext";
import api from "../services/api";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await api.get(`/products/${id}`);

        if (response.data.success) {
          setProduct(response.data.product);
        } else {
          setError("Product not found");
        }
      } catch (error) {
        console.error("Fetch product error:", error);

        if (error.response?.status === 404) {
          setError("Product not found");
        } else {
          setError(
            error.response?.data?.message ||
              "Unable to load product. Please try again."
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (isLoading) {
    return (
      <main className="product-not-found">
        <p>AVERZA</p>
        <h1>Loading Product...</h1>
        <p>Please wait while we load the product.</p>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="product-not-found">
        <p>AVERZA</p>

        <h1>Product Not Found</h1>

        <p>
          {error ||
            "Sorry, the product you are looking for does not exist."}
        </p>

        <Link to="/products" className="checkout-btn">
          View Products
        </Link>
      </main>
    );
  }

  const discount =
    product.oldPrice > product.price
      ? Math.round(
          ((product.oldPrice - product.price) /
            product.oldPrice) *
            100
        )
      : 0;

  const handleDecrease = () => {
    setQuantity((current) =>
      current > 1 ? current - 1 : 1
    );
  };

  const handleIncrease = () => {
    if (
      product.stock > 0 &&
      quantity < product.stock
    ) {
      setQuantity((current) => current + 1);
    }
  };

  const handleAddToCart = () => {
    const cartProduct = {
      ...product,
      id: product._id,
    };

    for (let i = 0; i < quantity; i++) {
      addToCart(cartProduct);
    }

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 1500);
  };

  const handleBuyNow = () => {
    const cartProduct = {
      ...product,
      id: product._id,
    };

    for (let i = 0; i < quantity; i++) {
      addToCart(cartProduct);
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

            {discount > 0 && (
              <span className="details-discount">
                {discount}% OFF
              </span>
            )}
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

              {product.oldPrice > product.price && (
                <del>
                  ₹
                  {product.oldPrice.toLocaleString(
                    "en-IN"
                  )}
                </del>
              )}
            </div>

            {/* DESCRIPTION */}

            <p className="details-description">
              {product.description}
            </p>

            {/* STOCK */}

            <p className="details-stock">
              {product.stock > 0
                ? `${product.stock} items available`
                : "Out of stock"}
            </p>

            {/* QUANTITY */}

            {product.stock > 0 && (
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
                  disabled={quantity >= product.stock}
                  aria-label="Increase quantity"
                >
                  <Plus size={15} />
                </button>
              </div>
            )}

            {/* ACTIONS */}

            <div className="details-actions">
              <button
                type="button"
                className="add-cart-btn"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
              >
                <ShoppingCart size={18} />

                {added
                  ? "Added to Cart"
                  : product.stock > 0
                  ? "Add to Cart"
                  : "Out of Stock"}
              </button>

              <button
                type="button"
                className="buy-now-btn"
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
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