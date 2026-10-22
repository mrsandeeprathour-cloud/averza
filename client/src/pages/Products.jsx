import { Link, useSearchParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { Search, Star, ArrowRight } from "lucide-react";

import { useCart } from "../context/CartContext";
import products from "../data/products";

function Products() {
  const { addToCart } = useCart();

  const [searchParams, setSearchParams] = useSearchParams();

  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "All";

  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState("default");
  const [addedProduct, setAddedProduct] = useState(null);

  const categories = [
    "All",
    "Electronics",
    "Fashion",
    "Accessories",
  ];

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const searchText = search.trim().toLowerCase();

      const matchesSearch =
        !searchText ||
        product.name.toLowerCase().includes(searchText) ||
        product.category.toLowerCase().includes(searchText);

      const matchesCategory =
        category === "All" ||
        product.category === category;

      return matchesSearch && matchesCategory;
    });

    if (sort === "low-high") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sort === "high-low") {
      result.sort((a, b) => b.price - a.price);
    }

    if (sort === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [search, category, sort]);

  const handleSearch = (e) => {
    const value = e.target.value;

    setSearch(value);

    const params = new URLSearchParams(searchParams);

    if (value.trim()) {
      params.set("search", value);
    } else {
      params.delete("search");
    }

    setSearchParams(params);
  };

  const handleCategory = (value) => {
    setCategory(value);

    const params = new URLSearchParams(searchParams);

    if (value === "All") {
      params.delete("category");
    } else {
      params.set("category", value);
    }

    setSearchParams(params);
  };

  const handleAddToCart = (product) => {
    addToCart(product);

    setAddedProduct(product.id);

    setTimeout(() => {
      setAddedProduct(null);
    }, 1200);
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setSort("default");
    setSearchParams({});
  };

  return (
    <main className="products-page">

      {/* HEADER */}
      <section className="products-header">
        <p>AVERZA</p>

        <h1>Our Products</h1>

        <p>
          Discover quality products selected for your
          everyday needs.
        </p>
      </section>

      {/* SEARCH + FILTERS */}
      <section className="products-controls">

        <div className="products-search">
          <Search size={19} />

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={handleSearch}
          />
        </div>

        <div className="products-filters">

          <div className="category-filters">
            {categories.map((item) => (
              <button
                type="button"
                key={item}
                className={
                  category === item
                    ? "active"
                    : ""
                }
                onClick={() => handleCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="default">
              Sort Products
            </option>

            <option value="low-high">
              Price: Low to High
            </option>

            <option value="high-low">
              Price: High to Low
            </option>

            <option value="rating">
              Highest Rated
            </option>
          </select>

        </div>
      </section>

      {/* RESULT COUNT */}
      <div className="products-result-row">
        <p>
          {filteredProducts.length}{" "}
          {filteredProducts.length === 1
            ? "product"
            : "products"}{" "}
          found
        </p>

        {(search || category !== "All" || sort !== "default") && (
          <button
            type="button"
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* PRODUCTS */}
      {filteredProducts.length > 0 ? (
        <section className="products-grid">

          {filteredProducts.map((product) => {
            const discount = Math.round(
              ((product.oldPrice - product.price) /
                product.oldPrice) *
                100
            );

            return (
              <article
                className="product-card"
                key={product.id}
              >

                {/* IMAGE */}
                <div className="product-image">

                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-image-photo"
                  />

                  <span className="product-discount">
                    {discount}% OFF
                  </span>

                  <span className="product-image-category">
                    {product.category}
                  </span>

                </div>

                {/* DETAILS */}
                <div className="product-info">

                  <p className="product-category">
                    {product.category}
                  </p>

                  <Link
                    to={`/products/${product.id}`}
                    className="product-name"
                  >
                    {product.name}
                  </Link>

                  {/* RATING */}
                  <div className="product-rating">

                    <Star
                      size={15}
                      fill="currentColor"
                    />

                    <strong>
                      {product.rating}
                    </strong>

                    <span className="review-count">
                      ({product.reviews} reviews)
                    </span>

                  </div>

                  {/* PRICE + ADD */}
                  <div className="product-bottom">

                    <div className="product-price">

                      <strong>
                        ₹
                        {product.price.toLocaleString(
                          "en-IN"
                        )}
                      </strong>

                      <span>
                        ₹
                        {product.oldPrice.toLocaleString(
                          "en-IN"
                        )}
                      </span>

                    </div>

                    <button
                      type="button"
                      className="product-add-btn"
                      onClick={() =>
                        handleAddToCart(product)
                      }
                    >
                      {addedProduct === product.id
                        ? "Added"
                        : "Add"}
                    </button>

                  </div>

                  {/* VIEW PRODUCT */}
                  <Link
                    to={`/products/${product.id}`}
                    className="view-product-link"
                  >
                    View Product
                    <ArrowRight size={15} />
                  </Link>

                </div>

              </article>
            );
          })}

        </section>
      ) : (
        /* NO PRODUCTS */
        <section className="no-products">
          <Search size={40} />

          <h2>No products found</h2>

          <p>
            Try another search or choose a different
            category.
          </p>

          <button
            type="button"
            onClick={clearFilters}
          >
            View All Products
          </button>
        </section>
      )}

    </main>
  );
}

export default Products;