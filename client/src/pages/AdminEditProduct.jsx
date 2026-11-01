
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

import api from "../services/api";

function AdminEditProduct() {
  const { id } = useParams();
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

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // FETCH PRODUCT
  // =========================

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(
          `/products/${id}`
        );

        if (response.data.success) {
          const product = response.data.product;

          setFormData({
            name: product.name || "",
            category: product.category || "",
            price: product.price ?? "",
            oldPrice: product.oldPrice ?? "",
            rating: product.rating ?? "0",
            reviews: product.reviews ?? "0",
            image: product.image || "",
            description: product.description || "",
            stock: product.stock ?? "",
          });
        }
      } catch (error) {
        console.error(
          "Failed to fetch product:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load product"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================
  // UPDATE PRODUCT
  // =========================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSaving(true);

    try {
      const response = await api.put(
        `/products/${id}`,
        {
          name: formData.name.trim(),
          category: formData.category.trim(),
          price: Number(formData.price),
          oldPrice: Number(formData.oldPrice),
          rating: Number(formData.rating),
          reviews: Number(formData.reviews),
          image: formData.image.trim(),
          description: formData.description.trim(),
          stock: Number(formData.stock),
        }
      );

      if (response.data.success) {
        navigate("/admin/products");
      }
    } catch (error) {
      console.error(
        "Failed to update product:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to update product"
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <main className="admin-page">
        <div className="admin-status">
          <p>AVERZA</p>

          <h1>Loading Product...</h1>

          <span>
            Please wait while product details
            are being loaded.
          </span>
        </div>
      </main>
    );
  }

  // =========================
  // PAGE
  // =========================

  return (
    <main className="admin-page">
      <div className="admin-container">

        {/* =========================
            HEADER
        ========================= */}

        <div className="admin-header">
          <div>
            <p>AVERZA ADMIN</p>

            <h1>Edit Product</h1>

            <span>
              Update your store product
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

            {/* PRICE */}

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

            {/* RATING / REVIEWS */}

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

            {/* IMAGE */}

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
                disabled={saving}
              >
                <Save size={18} />

                {saving
                  ? "Updating..."
                  : "Update Product"}
              </button>

            </div>

          </form>

        </section>

      </div>
    </main>
  );
}

export default AdminEditProduct;
