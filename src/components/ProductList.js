// src/components/ProductList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/ProductList.css';
import '../styles/Popup.css';

function ProductList({ user }) {
    const [products, setProducts] = useState([]);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:5006/api/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const deleteProduct = async (id) => {
        try {
            await axios.delete(`http://localhost:5006/api/products/${id}`, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const handleDelete = (id) => {
        if (!user) {
            alert("Admin access required to delete products");
            return;
        }
        if (window.confirm("Are you sure you want to delete this product?")) {
            deleteProduct(id);
        }
    };

    const handleEdit = (product) => {
        if (!user) {
            alert("Admin access required to edit products");
            return;
        }
        setCurrentProduct(product);
        setIsEditing(true);
    };

    const updateProduct = async () => {
        try {
            await axios.put(
                `http://localhost:5006/api/products/${currentProduct.id}`,
                currentProduct,
                { headers: { 'Authorization': `Bearer ${user.token}` } }
            );
            setIsEditing(false);
            fetchProducts();
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    return (
        <div>
            <h2>Product List</h2>
            <table>
                <thead className='products-heading'>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td>{product.name}</td>
                            <td>{product.description}</td>
                            <td>{product.price}</td>
                            <td>{product.quantity}</td>
                            <td className='actions'>
                                <button className='action-edit' onClick={() => handleEdit(product)}>Edit</button>
                                <button  className='action-delete' onClick={() => handleDelete(product.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isEditing && (
                <div className="edit-popup">
                    <h3>Edit Product</h3>
                    <label>Name:</label>
                    <input 
                        type="text"
                        value={currentProduct.name}
                        onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                    />
                    <label>Description:</label>
                    <input 
                        type="text"
                        value={currentProduct.description}
                        onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                    />
                    <label>Price:</label>
                    <input 
                        type="number"
                        value={currentProduct.price}
                        onChange={(e) => setCurrentProduct({ ...currentProduct, price: e.target.value })}
                    />
                    <label>Quantity:</label>
                    <input 
                        type="number"
                        value={currentProduct.quantity}
                        onChange={(e) => setCurrentProduct({ ...currentProduct, quantity: e.target.value })}
                    />
                    <div>
                        <button className="save-button" onClick={updateProduct}>Save</button>
                        <button className="cancel-button" onClick={() => setIsEditing(false)}>Cancel</button>
                    </div>
                    
                </div>
            )}
        </div>
    );
}

export default ProductList;

