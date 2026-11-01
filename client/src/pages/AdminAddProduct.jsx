
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";

import api from "../services/api";

function AdminAddProduct() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    oldPrice: "",
    rating: "0",
    reviews: "0",
    image: "",
    description: "",
    stock: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/products", {
        name: formData.name.trim(),
        category: formData.category.trim(),
        price: Number(formData.price),
        oldPrice: Number(formData.oldPrice),
        rating: Number(formData.rating),
        reviews: Number(formData.reviews),
        image: formData.image.trim(),
        description: formData.description.trim(),
        stock: Number(formData.stock),
      });

      if (response.data.success) {
        navigate("/admin/products");
      }
    } catch (error) {
      console.error(
        "Failed to create product:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to create product"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-page">
      <div className="admin-container">

        {/* =========================
            HEADER
        ========================= */}

        <div className="admin-header">
          <div>
            <p>AVERZA ADMIN</p>

            <h1>Add Product</h1>

            <span>
              Add a new product to your store
            </span>
          </div>

          <Link
            to="/admin/products"
            className="admin-back-btn"
          >
            <ArrowLeft size={17} />
            Back to Products
          </Link>
        </div>

        {/* =========================
            FORM
        ========================= */}

        <section className="admin-section">

          <form
            className="admin-product-form"
            onSubmit={handleSubmit}
          >

            {/* PRODUCT NAME */}

            <div className="admin-form-group">
              <label htmlFor="name">
                Product Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
                required
              />
            </div>

            {/* CATEGORY */}

            <div className="admin-form-group">
              <label htmlFor="category">
                Category
              </label>

              <input
                id="category"
                name="category"
                type="text"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g. Electronics"
                required
              />
            </div>

            {/* PRICE ROW */}

            <div className="admin-form-row">

              <div className="admin-form-group">
                <label htmlFor="price">
                  Price
                </label>

                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Enter price"
                  required
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="oldPrice">
                  Old Price
                </label>

                <input
                  id="oldPrice"
                  name="oldPrice"
                  type="number"
                  min="0"
                  value={formData.oldPrice}
                  onChange={handleChange}
                  placeholder="Enter old price"
                  required
                />
              </div>

            </div>

            {/* RATING / REVIEWS ROW */}

            <div className="admin-form-row">

              <div className="admin-form-group">
                <label htmlFor="rating">
                  Rating
                </label>

                <input
                  id="rating"
                  name="rating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.rating}
                  onChange={handleChange}
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="reviews">
                  Reviews
                </label>

                <input
                  id="reviews"
                  name="reviews"
                  type="number"
                  min="0"
                  value={formData.reviews}
                  onChange={handleChange}
                />
              </div>

            </div>

            {/* STOCK */}

            <div className="admin-form-group">
              <label htmlFor="stock">
                Stock
              </label>

              <input
                id="stock"
                name="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={handleChange}
                placeholder="Enter stock quantity"
                required
              />
            </div>

            {/* IMAGE URL */}

            <div className="admin-form-group">
              <label htmlFor="image">
                Image URL
              </label>

              <input
                id="image"
                name="image"
                type="url"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/product.jpg"
                required
              />
            </div>

            {/* DESCRIPTION */}

            <div className="admin-form-group">
              <label htmlFor="description">
                Description
              </label>

              <textarea
                id="description"
                name="description"
                rows="6"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter product description"
                required
              />
            </div>

            {/* ERROR */}

            {error && (
              <div className="admin-form-error">
                {error}
              </div>
            )}

            {/* ACTIONS */}

            <div className="admin-form-actions">

              <Link
                to="/admin/products"
                className="admin-cancel-btn"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="admin-submit-btn"
                disabled={loading}
              >
                <Plus size={18} />

                {loading
                  ? "Creating..."
                  : "Create Product"}
              </button>

            </div>

          </form>

        </section>

      </div>
    </main>
  );
}

export default AdminAddProduct;