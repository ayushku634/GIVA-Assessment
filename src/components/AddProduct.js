  // src/components/AddProduct.js
  import React, { useState } from 'react';
  import axios from 'axios';
  import '../styles/AddProduct.css';

  function AddProduct({ user, onProductAdded }) {
      const [product, setProduct] = useState({ name: '', description: '', price: '', quantity: '' });

      const handleChange = (e) => {
          setProduct({ ...product, [e.target.name]: e.target.value });
      };

      const handleSubmit = async (e) => {
          e.preventDefault();
          console.log(user.is_admin)
          console.log(user.token)
          if (!user || !user.is_admin) {
              alert("Admin access required to add products");
              return;
          }

          try {
              const response = await axios.post(
                  'http://localhost:5006/api/products',
                  product,
                  { headers: { 'Authorization': `Bearer ${user.token}` } } // Pass user token if using JWTs or similar auth
              );
              setProduct({ name: '', description: '', price: '', quantity: '' });
              onProductAdded(response.data);
              console.log(product)
          } catch (error) {
              console.error('Error adding product:', error);
          }
      };

      return (
        <div className="container mt-4">
        <h2>Add New Product</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={product.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <input
              type="text"
              className="form-control"
              name="description"
              value={product.description}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Price</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              name="price"
              value={product.price}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Quantity</label>
            <input
              type="number"
              className="form-control"
              name="quantity"
              value={product.quantity}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary mt-3">Add Product</button>
        </form>
      </div>
      );
  }

  export default AddProduct;

