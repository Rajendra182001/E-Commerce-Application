// import React, { useContext, useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import AppContext from "../Context/Context";
// import API from "../API";
// import "./Home.css";

// export default function Home({ selectedCategory }) {
//   const [product, setProduct] = useState([]);
//   const [isError, setIsError] = useState(false);
//   const [imageUrls, setImageUrls] = useState({});

//   const { addToCart } = useContext(AppContext);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         // ✅ CORRECT endpoint
//         let url = "/product";

//         if (selectedCategory) {
//           url += `?category=${selectedCategory}`;
//         }

//         const res = await API.get(url);
//         const products = res.data;
//         setProduct(products);

//         // Fetch images
//         const imageMap = {};
//         await Promise.all(
//           products.map(async (p) => {
//             try {
//               const imgRes = await API.get(`/product/${p.id}/image`, {
//                 responseType: "blob",
//               });
//               imageMap[p.id] = URL.createObjectURL(imgRes.data);
//             } catch {
//               imageMap[p.id] = null;
//             }
//           })
//         );

//         setImageUrls(imageMap);
//       } catch (err) {
//         console.error("Error fetching products:", err);
//         setIsError(true);
//       }
//     };

//     fetchProducts();
//   }, [selectedCategory]);

//   if (isError) {
//     return <h2 className="center">Failed to load products</h2>;
//   }

//   return (
//     <div className="products-container">
//       {product.length === 0 ? (
//         <h2 className="center">No Products Available</h2>
//       ) : (
//         product.map((p) => {
//           const { id, brand, name, price, available } = p;
//           const imageUrl = imageUrls[id];

//           return (
//             <div className="product-card" key={id}>
//               <Link to={`/productById/${id}`} className="product-link">
//                 <img
//                   src={imageUrl || "/placeholder.jpg"}
//                   alt={name}
//                   className="product-image"
//                 />

//                 <div className="product-body">
//                   <div>
//                     <h5 className="product-title">{name.toUpperCase()}</h5>
//                     <i className="product-brand">~ {brand}</i>
//                   </div>

//                   <div>
//                     <h5 className="product-price">₹ {price}</h5>

//                     <button
//                       className="cart-btn"
//                       disabled={!available}
//                       onClick={(e) => {
//                         e.preventDefault();
//                         addToCart(p);
//                       }}
//                     >
//                       {available ? "Add to Cart" : "Out of Stock"}
//                     </button>
//                   </div>
//                 </div>
//               </Link>
//             </div>
//           );
//         })
//       )}
//     </div>
//   );
// }

// src/Components/Home.js
// src/Components/Home.js
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppContext from "../Context/Context";
import API from "../API";
import "./Home.css";

const CATEGORIES = ["All", "Electronics", "Fashion", "Home", "Sports", "Beauty"];

const BADGE_COLORS = {
  Sale: "#ef4444",
  New: "#10b981",
  Hot: "#f97316",
};

const StarRating = ({ rating }) => (
  <div className="star-row">
    {[1, 2, 3, 4, 5].map((i) => (
      <svg key={i} width="12" height="12" viewBox="0 0 24 24"
        fill={i <= Math.floor(rating) ? "#f59e0b" : "#d1d5db"}>
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ))}
    <span className="star-count">{rating}</span>
  </div>
);

const getCategoryEmoji = (category) => {
  const map = { Electronics: "⚡", Fashion: "👗", Sports: "🏃", Beauty: "✨", Home: "🏡" };
  return map[category] || "🛍";
};

const getCategoryGradient = (category) => {
  const map = {
    Electronics: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    Fashion:     "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    Sports:      "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    Beauty:      "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    Home:        "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
  };
  return map[category] || "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)";
};

const ProductCard = ({ p, imageUrl, onAddToCart, addedId }) => {
  const [hovered, setHovered] = useState(false);
  const isAdded = addedId === p.id;

  return (
    <div
      className="product-card"
      style={{ transform: hovered ? "translateY(-8px)" : "translateY(0)",
               boxShadow: hovered ? "0 20px 60px rgba(0,0,0,0.15)" : "0 4px 20px rgba(0,0,0,0.06)" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link to={`/productById/${p.id}`} className="product-link">
        {/* Image */}
        <div className="product-image-wrap"
          style={{ background: getCategoryGradient(p.category) }}>
          {imageUrl
            ? <img src={imageUrl} alt={p.name} className="product-image" />
            : (
              <div className="product-image-placeholder">
                <span>{getCategoryEmoji(p.category)}</span>
              </div>
            )
          }

          {/* Badge */}
          {p.badge && (
            <div className="product-badge"
              style={{ background: BADGE_COLORS[p.badge] || "#6366f1" }}>
              {p.badge}
            </div>
          )}

          {/* Out of stock overlay */}
          {!p.available && (
            <div className="out-of-stock-overlay">
              <span className="out-of-stock-label">OUT OF STOCK</span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="product-body">
          <p className="product-brand">{p.brand}</p>
          <h3 className="product-title">{p.name}</h3>

          {p.rating && <StarRating rating={p.rating} />}
          {p.reviews && (
            <p className="product-reviews">{p.reviews} reviews</p>
          )}

          <div className="product-footer">
            <p className="product-price">₹{Number(p.price).toLocaleString()}</p>
            <button
              className="cart-btn"
              disabled={!p.available}
              style={{
                background: !p.available ? undefined : isAdded ? "#10b981" : "#111827",
                color: !p.available ? undefined : "#fff",
              }}
              onClick={(e) => {
                e.preventDefault();
                onAddToCart(p);
              }}
            >
              {!p.available ? "Sold Out" : isAdded ? "✓ Added" : "+ Cart"}
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default function Home({ selectedCategory: externalCategory }) {
  const { cart, addToCart } = useContext(AppContext);
  const [products, setProducts] = useState([]);
  const [isError, setIsError] = useState(false);
  const [imageUrls, setImageUrls] = useState({});
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(externalCategory || "All");
  const [sortBy, setSortBy] = useState("default");
  const [addedId, setAddedId] = useState(null);
  

  const totalCartItems = cart.reduce((s, i) => s + i.quantity, 0);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = "/product";
        if (category && category !== "All") url += `?category=${category}`;
        const res = await API.get(url);
        const data = res.data;
        setProducts(data);

        // Fetch images in parallel
        const imageMap = {};
        await Promise.all(
          data.map(async (p) => {
            try {
              const imgRes = await API.get(`/product/${p.id}/image`, {
                responseType: "blob",
              });
              imageMap[p.id] = URL.createObjectURL(imgRes.data);
            } catch {
              imageMap[p.id] = null;
            }
          })
        );
        setImageUrls(imageMap);
      } catch (err) {
        console.error("Error fetching products:", err);
        setIsError(true);
      }
    };

    fetchProducts();
  }, [category]);

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const filtered = products
    .filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.brand && p.brand.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
      return 0;
    });

  if (isError) {
    return (
      <div className="no-products">
        <div className="icon">⚠️</div>
        <h3>Failed to load products</h3>
        <p>Please check your connection and try again.</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#fafafa", fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── Hero ── */}
      <div className="hero">
        <div className="hero-nav">
          <div>
            <h1 className="hero-logo"><span>RAJENDRA SHOPPING </span> Market</h1>
            <p className="hero-logo-sub">Premium Shopping</p>
          </div>

          <Link to="/addToCart" className="cart-btn-nav">
            🛍 Bag
            {totalCartItems > 0 && (
              <span className="cart-badge">{totalCartItems}</span>
            )}
          </Link>
        </div>

        <div className="hero-content">
          <h2 className="hero-title">
            Discover Something<br />
            <span>Extraordinary</span>
          </h2>
          <p className="hero-subtitle">Curated products from the world's best brands</p>

          {/* Search */}
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products, brands..."
            />
            {search && (
              <button className="search-clear" onClick={() => setSearch("")}>×</button>
            )}
          </div>
        </div>
      </div>

      {/* ── Category Bar ── */}
      <div className="category-bar">
        <div className="category-inner">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`category-btn ${category === cat ? "active" : ""}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Products ── */}
      <div className="products-section">
        <div className="products-toolbar">
          <h3 className="products-heading">
            {category === "All" ? "All Products" : category}
            <span className="products-count">({filtered.length})</span>
          </h3>

          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="default">Sort: Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="no-products">
            <div className="icon">🔍</div>
            <h3>No products found</h3>
            <p>Try a different search or category</p>
          </div>
        ) : (
          <div className="products-container">
            {filtered.map((p) => (
              <ProductCard
                key={p.id}
                p={p}
                imageUrl={imageUrls[p.id]}
                onAddToCart={handleAddToCart}
                addedId={addedId}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <div className="site-footer">
        <p className="footer-brand"><span>Lumen</span> Market</p>
        <p style={{ margin: 0 }}>© 2025 · All rights reserved · Made with care</p>
      </div>
    </div>
  );
}