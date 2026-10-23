import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import api from "../services/api";

function Products() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await api.get("/products");

        if (response.data.success) {
          setProducts(response.data.products);
        } else {
          setError("Unable to load products.");
        }
      } catch (error) {
        console.error("Fetch products error:", error);

        setError(
          error.response?.data?.message ||
            "Unable to load products. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (isLoading) {
    return (
      <main className="products-page">
        <div className="products-header">
          <p>AVERZA</p>
          <h1>All Products</h1>
          <span>Explore our collection</span>
        </div>

        <div className="products-status">
          <p>Loading products...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="products-page">
        <div className="products-header">
          <p>AVERZA</p>
          <h1>All Products</h1>
          <span>Explore our collection</span>
        </div>

        <div className="products-status products-error">
          <p>{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="products-page">
      <div className="products-header">
        <p>AVERZA</p>
        <h1>All Products</h1>
        <span>
          Explore our collection of quality products
        </span>
      </div>

      {products.length === 0 ? (
        <div className="products-status">
          <p>No products available right now.</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
            />
          ))}
        </div>
      )}
    </main>
  );
}

export default Products;