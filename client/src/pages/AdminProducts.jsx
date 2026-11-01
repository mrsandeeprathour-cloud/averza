import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";

import api from "../services/api";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      setError("");

      const response = await api.get("/products");

      if (response.data.success) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.error(
        "Failed to fetch admin products:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load products"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const handleDelete = async (product) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setDeletingId(product._id);

      const response = await api.delete(
        `/products/${product._id}`
      );

      if (response.data.success) {
        setProducts((previousProducts) =>
          previousProducts.filter(
            (item) => item._id !== product._id
          )
        );
      }
    } catch (error) {
      console.error(
        "Failed to delete product:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to delete product"
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <div>
            <p>AVERZA ADMIN</p>

            <h1>Products</h1>

            <span>
              Manage your store products
            </span>
          </div>

          <Link
            to="/admin/products/new"
            className="admin-add-btn"
          >
            <Plus size={18} />
            Add Product
          </Link>
        </div>

        <section className="admin-section">
          {error && (
            <div className="admin-form-error">
              {error}
            </div>
          )}

          {loading ? (
            <div className="admin-status">
              <p>AVERZA</p>

              <h1>Loading Products...</h1>

              <span>
                Please wait while products
                are being loaded.
              </span>
            </div>
          ) : products.length === 0 ? (
            <div className="admin-status">
              <p>AVERZA</p>

              <h1>No Products Found</h1>

              <span>
                Add your first product
                to get started.
              </span>

              <Link
                to="/admin/products/new"
                className="admin-back-btn"
              >
                <Plus size={17} />
                Add Product
              </Link>
            </div>
          ) : (
            <div className="admin-products-table">
              <div className="admin-product-row admin-product-heading">
                <span>Product</span>
                <span>Category</span>
                <span>Price</span>
                <span>Stock</span>
                <span>Actions</span>
              </div>

              {products.map((product) => (
                <div
                  className="admin-product-row"
                  key={product._id}
                >
                  <div className="admin-product-info">
                    <img
                      src={product.image}
                      alt={product.name}
                    />

                    <div>
                      <strong>
                        {product.name}
                      </strong>

                      <span>
                        ID: {product._id}
                      </span>
                    </div>
                  </div>

                  <span>
                    {product.category}
                  </span>

                  <strong>
                    ₹
                    {Number(
                      product.price
                    ).toLocaleString("en-IN")}
                  </strong>

                  <span>
                    {product.stock}
                  </span>

                  <div className="admin-product-actions">
                    <Link
                      to={`/admin/products/${product._id}/edit`}
                      className="admin-product-edit"
                      title="Edit Product"
                    >
                      <Pencil size={17} />
                    </Link>

                    <button
                      type="button"
                      title="Delete Product"
                      onClick={() =>
                        handleDelete(product)
                      }
                      disabled={
                        deletingId === product._id
                      }
                    >
                      <Trash2 size={17} />
                    </button>
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

export default AdminProducts;