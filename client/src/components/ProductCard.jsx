import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      ...product,
      id: product._id,
    });
  };

  return (
    <article className="product-card">
      <Link
        to={`/products/${product._id}`}
        className="product-image-link"
      >
        <div className="product-image">
          <img
            src={product.image}
            alt={product.name}
          />
        </div>
      </Link>

      <div className="product-card-content">
        <p className="product-category">
          {product.category}
        </p>

        <Link
          to={`/products/${product._id}`}
          className="product-name-link"
        >
          <h2>{product.name}</h2>
        </Link>

        <div className="product-rating">
          <span>★</span>
          <strong>{product.rating}</strong>
          <span>({product.reviews})</span>
        </div>

        <div className="product-price">
          <strong>
            ₹{product.price.toLocaleString("en-IN")}
          </strong>

          {product.oldPrice && (
            <span>
              ₹{product.oldPrice.toLocaleString("en-IN")}
            </span>
          )}
        </div>

        <div className="product-actions">
          <Link
            to={`/products/${product._id}`}
            className="view-product-btn"
          >
            View Product
          </Link>

          <button
            type="button"
            className="add-cart-btn"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;