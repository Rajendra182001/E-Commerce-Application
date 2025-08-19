import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppContext from '../Context/Context';

export default function Home({ selectedCategory }) {
  const [product, setProduct] = useState([]);
  const [isErrors, setIsError] = useState(false);
  const { data, isError, addToCart, refreshData } = useContext(AppContext);
  const [imageUrls, setImageUrls] = useState({});
  const [isDataFetched, setIsDataFetched] = useState(false);

  useEffect(() => {
    if (!isDataFetched) {
      refreshData();
      setIsDataFetched(true);
    }
  }, [refreshData, isDataFetched]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/product");
        setProduct(response.data);

        // Fetch images for products
        const imageResponsePromises = response.data.map(async (product) => {
          const imageResponse = await axios.get(`http://localhost:8080/product/${product.id}/image`, { responseType: 'arraybuffer' });
          const blob = new Blob([imageResponse.data], { type: imageResponse.headers['content-type'] });
          const url = URL.createObjectURL(blob);
          return { id: product.id, url };
        }); 

        // Wait for all image requests to finish and then set the imageUrls state
        const imageUrlsArray = await Promise.all(imageResponsePromises);
        const imageUrlsObj = imageUrlsArray.reduce((acc, { id, url }) => {
          acc[id] = url;
          return acc;
        }, {});
        setImageUrls(imageUrlsObj);

      } catch (error) {
        setIsError(true);
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  if (isErrors) {
    return <div className="alert alert-danger">There was an error fetching the products.</div>;
  }




  // Filter products by selectedCategory
  const filteredProducts = selectedCategory ? product.filter((product) => product.category === selectedCategory) : product;

  return (
    <>
      <div className="grid">
        {filteredProducts.length === 0 ? (
          <h2
            className="text-center"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            No Products Available
          </h2>
        ) : (
          filteredProducts.map((product) => {
            const { id, brand, name, price, available } = product;
            const imageUrl = imageUrls[id];  // Use imageUrl from state

            // Card styles can be dynamically adjusted based on availability
            const cardStyle = {
              width: "18rem",
              height: "24rem",
              boxShadow: "rgba(0, 0, 0, 0.24) 0px 2px 3px",
              backgroundColor: available ? "#fff" : "#ccc",
              margin: "10px",
              display: "flex",
              flexDirection: "column",
            };

            return (
              <div className="card mb-3" style={cardStyle} key={id}>
                <Link
                  to={`/productById/${id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <img
                    src={imageUrl || "/path/to/placeholder.jpg"}  // Use placeholder if imageUrl is not available
                    alt={name}
                    style={{
                      width: "100%",
                      height: "180px",
                      objectFit: "cover",
                      padding: "5px",
                      margin: "0",
                    }}
                  />
                  <div
                    className="buttons"
                    style={{
                      position: "absolute",
                      top: "25px",
                      left: "220px",
                      zIndex: "1",
                    }}
                  >
                    <div className="buttons-liked">
                      <i className="bi bi-heart"></i>
                    </div>
                  </div>
                  <div
                    className="card-body"
                    style={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      padding: "10px",
                    }}
                  >
                    <div>
                      <h5
                        className="card-title"
                        style={{ margin: "0 0 10px 0" }}
                      >
                        {name.toUpperCase()}
                      </h5>
                      <i className="card-brand" style={{ fontStyle: "italic" }}>
                        {"~ " + brand}
                      </i>
                    </div>
                    <div>
                      <h5
                        className="card-text"
                        style={{ fontWeight: "600", margin: "5px 0" }}
                      >
                        {"$" + price}
                      </h5>
                      <button
                        className="btn btn-primary"
                        style={{ width: "100%" }}
                        onClick={(e) => {
                          e.preventDefault();
                          addToCart(product);
                        }}
                        disabled={!available}
                      >
                        {available ? "Add to Cart" : "Out of Stock"}
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
