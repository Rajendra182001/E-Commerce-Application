import { Select } from '@mui/material'
import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

export default function AddProduct() {

  let navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    description: "",
    brand: "",
    price: "",
    category: "",
    quantity: "",
    releaseDate: "",
    available: false,
  });

  const { name, description, brand, price, category, quantity, releaseDate, available } = product;
  const [image,setImage]=useState(null);

  const onInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct(prevProduct => ({
      ...prevProduct,
      [name]: type === "checkbox" ? checked : value
    }));
  };

 const handleImageChange=(e)=>{
  setImage(e.target.files[0])
 }; 
 const onSubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData();

  // Append the image file
  formData.append("multipartFile",image);

  // Convert product object to a Blob and append
  formData.append("productDto", new Blob([JSON.stringify(product)], {
    type: "application/json"
  }));

  // Send formData to backend
  const result = await axios.post("http://localhost:8080/product", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  navigate("/");
};

  const handleCancel = () => {
    setProduct({
      name: "",
      description: "",
      brand: "",
      price: "",
      category: "",
      releaseDate: "",
      quantity: "",
      available: false,
    });
    setImage(null); // Reset the image state
  };

  return (
    <div className='container'>
      <div className='center-container'>
        <div className='row g-3 pt-5'>
          <div className="col-md-6 offset-md-3 border bg-light rounded p-4 mt-2" style={{ height: 'auto' }}>
            <form onSubmit={(e) => onSubmit(e)}>
              <div className='col-md-12 mb-4'>
                <label htmlFor='name' className='form-label d-flex justify-content-start'>Product Name:</label>
                <input
                  type='text'
                  className="form-control"
                  placeholder='Product Name'
                  name="name"
                  id="name"
                  value={name}
                  onChange={(e) => onInputChange(e)} />
              </div>

              <div className='row'>
                <div className="col-md-6 mb-4">
                  <label htmlFor='description' className='form-label d-flex justify-content-start'>Description:</label>
                  <input
                    type='text'
                    className="form-control"
                    placeholder='Add product description'
                    name="description"
                    id="description"
                    value={description}
                    onChange={(e) => onInputChange(e)} />
                </div>
                <div className="col-md-6 mb-4">
                  <label htmlFor='brand' className='form-label d-flex justify-content-start'>Brand:</label>
                  <input
                    type='text'
                    className="form-control"
                    placeholder='Add brand'
                    name="brand"
                    id="brand"
                    value={brand}
                    onChange={(e) => onInputChange(e)} />
                </div>
              </div>

              <div className='row'>
                <div className="col-md-6 mb-3">
                  <label htmlFor='price' className='form-label d-flex justify-content-start'>Price:</label>
                  <input
                    type='number'
                    className="form-control"
                    placeholder='Eg: $1000'
                    name="price"
                    id="price"
                    value={price}
                    onChange={(e) => onInputChange(e)} />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor='category' className='form-label d-flex justify-content-start'>Category:</label>
                  <select
                    className='form-select'
                    value={category}
                    name="category"
                    id="category"
                    onChange={(e) => onInputChange(e)}>
                    <option value="">Select category</option>
                    <option value="Laptop">Laptop</option>
                    <option value="Headphone">Headphone</option>
                    <option value="Mobile">Mobile</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Toys">Toys</option>
                    <option value="Fashion">Fashion</option>
                  </select>
                </div>
              </div>

              <div className='row'>
  <div className="col-md-6 mb-4">
    <label htmlFor='quantity' className='form-label d-flex justify-content-start'>Stock Quantity:</label>
    <input
      type="number"
      className="form-control"
      name="quantity"
      id="quantity"
      value={quantity}
      onChange={(e) => onInputChange(e)} />
  </div>
  <div className="col-md-6 mb-2">
    <label htmlFor='releaseDate' className='form-label d-flex justify-content-start'>Release Date:</label>
    <input
      type='date'
      className="form-control"
      name="releaseDate"
      id="releaseDate"
      value={releaseDate}
      onChange={(e) => onInputChange(e)} />
  </div>
</div>

              <div className='row'>
              <div className="col-md-12 d-flex align-items-center">
           <label htmlFor='available' className="form-check-label mb-0 mr-2">Product Available:</label>
  <input
    className="form-check-input"
    type="checkbox"
    name="available"
    id="available"
    onChange={(e) => onInputChange(e)}/>
  <input type="file"className="form-control" accept="image/*" onChange={handleImageChange}/>
   </div>
              </div>

              <div className="col-12 mt-3">
                <button type="submit" className="btn btn-primary btn-sm rounded-pill">Submit</button>
                <Link type="button" className="btn btn-secondary btn-sm rounded-pill ms-2" to={"/"} onClick={handleCancel}>Cancel</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
