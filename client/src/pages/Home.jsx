import { useNavigate } from "react-router-dom";
import {
  Search,
  ArrowRight,
  Check,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { useState } from "react";

import { useCart } from "../context/CartContext";
import products from "../data/products";

function Home() {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [search, setSearch] = useState("");

  const featuredProducts = products.slice(0, 4);

  const handleSearch = (e) => {
    e.preventDefault();

    const value = search.trim();

    if (!value) {
      navigate("/products");
      return;
    }

    navigate(`/products?search=${encodeURIComponent(value)}`);
  };

  const handleCategory = (category) => {
    navigate(`/products?category=${encodeURIComponent(category)}`);
  };

  return (
    <main className="home-page">

      {/* ================= HERO ================= */}

      <section className="home-hero">
        <div className="home-hero-content">

          <p className="home-tag">WELCOME TO AVERZA</p>

          <h1>
            Shop Smart.
            <br />
            Live Better.
          </h1>

          <p className="home-hero-text">
            Discover quality products, amazing deals and everything
            you need for your everyday lifestyle.
          </p>

          {/* Search */}

          <form className="home-search" onSubmit={handleSearch}>
            <Search size={20} />

            <input
              type="text"
              placeholder="Search for products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <button type="submit">
              Search
            </button>
          </form>

          <div className="home-hero-buttons">

            <button
              type="button"
              className="home-primary-btn"
              onClick={() => navigate("/products")}
            >
              Shop Now
              <ArrowRight size={18} />
            </button>

            <button
              type="button"
              className="home-secondary-btn"
              onClick={() => handleCategory("Electronics")}
            >
              Explore Electronics
            </button>

          </div>

        </div>

        {/* ================= HERO PRODUCT ================= */}

        <div className="home-hero-card">

          <span className="home-hero-badge">
            BEST SELLER
          </span>

          <img
            src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=85"
            alt="Smart Watch"
          />

          <div className="home-hero-product-info">

            <div>
              <p>Electronics</p>

              <h2>Smart Watch</h2>

              <span>
                ₹3,499{" "}
                <del>₹4,499</del>
              </span>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/products/6adab0115fb7aa3b6763563f"
                )
              }
            >
              <ArrowRight size={20} />
            </button>

          </div>
        </div>
      </section>


      {/* ================= FEATURES ================= */}

      <section className="home-features">

        <div className="home-feature">
          <div className="home-feature-icon">
            <Truck size={22} />
          </div>

          <div>
            <h3>Fast Delivery</h3>
            <p>Quick and reliable delivery</p>
          </div>
        </div>

        <div className="home-feature">
          <div className="home-feature-icon">
            <ShieldCheck size={22} />
          </div>

          <div>
            <h3>Secure Shopping</h3>
            <p>Your shopping experience is safe</p>
          </div>
        </div>

        <div className="home-feature">
          <div className="home-feature-icon">
            <Check size={22} />
          </div>

          <div>
            <h3>Quality Products</h3>
            <p>Products selected with care</p>
          </div>
        </div>

      </section>


      {/* ================= FEATURED PRODUCTS ================= */}

      <section className="home-section">

        <div className="home-section-header">

          <div>
            <p className="home-tag">
              OUR COLLECTION
            </p>

            <h2>Featured Products</h2>

            <p>
              Explore some of our most popular products.
            </p>
          </div>

          <button
            type="button"
            className="home-view-all"
            onClick={() => navigate("/products")}
          >
            View All
            <ArrowRight size={17} />
          </button>

        </div>


        <div className="home-products-grid">

          {featuredProducts.map((product) => {

            const discount = Math.round(
              ((product.oldPrice - product.price) /
                product.oldPrice) *
                100
            );

            return (
              <article
                className="home-product-card"
                key={product.id}
              >

                <div className="home-product-image">

                  <img
                    src={product.image}
                    alt={product.name}
                  />

                  <span>
                    {discount}% OFF
                  </span>

                </div>


                <div className="home-product-info">

                  <p className="home-product-category">
                    {product.category}
                  </p>

                  <h3>{product.name}</h3>

                  <div className="home-product-rating">
                    <span>★</span>

                    <strong>
                      {product.rating}
                    </strong>

                    <small>
                      ({product.reviews})
                    </small>
                  </div>


                  <div className="home-product-bottom">

                    <div className="home-product-price">

                      <strong>
                        ₹{product.price.toLocaleString("en-IN")}
                      </strong>

                      <del>
                        ₹{product.oldPrice.toLocaleString("en-IN")}
                      </del>

                    </div>

                    <button
                      type="button"
                      onClick={() => addToCart(product)}
                    >
                      Add
                    </button>

                  </div>


                  <button
                    type="button"
                    className="home-product-link"
                    onClick={() =>
                      navigate(`/products/${product.id}`)
                    }
                  >
                    View Product
                    <ArrowRight size={15} />
                  </button>

                </div>

              </article>
            );
          })}

        </div>
      </section>


      {/* ================= CATEGORIES ================= */}

      <section className="home-categories-section">

        <div className="home-section-header">

          <div>
            <p className="home-tag">
              SHOP BY CATEGORY
            </p>

            <h2>Find What You Need</h2>

            <p>
              Explore products across our popular categories.
            </p>
          </div>

        </div>


        <div className="home-categories">

          <button
            type="button"
            className="home-category-card"
            onClick={() => handleCategory("Electronics")}
          >
            <div className="home-category-number">
              01
            </div>

            <div>
              <h3>Electronics</h3>
              <p>
                Smart devices and useful gadgets
              </p>
            </div>

            <ArrowRight size={20} />
          </button>


          <button
            type="button"
            className="home-category-card"
            onClick={() => handleCategory("Fashion")}
          >
            <div className="home-category-number">
              02
            </div>

            <div>
              <h3>Fashion</h3>
              <p>
                Everyday styles for everyone
              </p>
            </div>

            <ArrowRight size={20} />
          </button>


          <button
            type="button"
            className="home-category-card"
            onClick={() => handleCategory("Accessories")}
          >
            <div className="home-category-number">
              03
            </div>

            <div>
              <h3>Accessories</h3>
              <p>
                Practical products for daily life
              </p>
            </div>

            <ArrowRight size={20} />
          </button>

        </div>
      </section>


      {/* ================= WHY AVERZA ================= */}

      <section className="home-why">

        <div className="home-why-content">

          <p className="home-tag">
            WHY AVERZA
          </p>

          <h2>
            Shopping made simple,
            <br />
            better and reliable.
          </h2>

          <p>
            At Averza, we focus on bringing useful,
            quality products together with a smooth
            and enjoyable shopping experience.
          </p>

          <div className="home-check-list">

            <div>
              <Check size={18} />
              <span>Carefully selected products</span>
            </div>

            <div>
              <Check size={18} />
              <span>Simple and secure shopping</span>
            </div>

            <div>
              <Check size={18} />
              <span>Fast delivery experience</span>
            </div>

            <div>
              <Check size={18} />
              <span>Customer-focused service</span>
            </div>

          </div>

        </div>


        <div className="home-why-box">

          <span>AVERZA</span>

          <h3>
            Everything you need.
          </h3>

          <p>
            One place. Better choices.
          </p>

          <button
            type="button"
            onClick={() => navigate("/products")}
          >
            Start Shopping
            <ArrowRight size={18} />
          </button>

        </div>

      </section>


      {/* ================= CTA ================= */}

      <section className="home-cta">

        <p className="home-tag">
          READY TO SHOP?
        </p>

        <h2>
          Find something you'll love.
        </h2>

        <p>
          Explore the Averza collection and discover
          your next favourite product.
        </p>

        <button
          type="button"
          onClick={() => navigate("/products")}
        >
          Explore Products
          <ArrowRight size={18} />
        </button>

      </section>

    </main>
  );
}

export default Home;