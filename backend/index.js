const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

app.post('/api/register', async (req, res) => {
    const { email, username, password, adminKey } = req.body;
    let debugMessages = [];
    try {
        const emailExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
        if (emailExists.rows.length > 0) {
            debugMessages.push('Email already exists');
            return res.status(400).json({ error: 'Email already registered', debugMessages });
        }
    
        const hashedPassword = await bcrypt.hash(password, 10);
        const isAdmin = adminKey === process.env.ADMIN_KEY ? 1 : 0;
    
        const result = await pool.query(
            'INSERT INTO users (email, username, password, is_admin) VALUES ($1, $2, $3, $4) RETURNING *',
            [email, username, hashedPassword, isAdmin]
        );
    
        debugMessages.push('User inserted successfully');
        res.json({ success: true, user: result.rows[0], debugMessages });
    } catch (error) {
        debugMessages.push(`Error registering user: ${error.message}`);
        res.status(500).json({ error: 'Error registering user', debugMessages });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const debugMessages = [];

    try {
        const userQuery = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (userQuery.rows.length === 0) {
            debugMessages.push('User not found with the provided email');
            return res.status(400).json({ error: 'User not found', debugMessages });
        }

        debugMessages.push('User found, proceeding to password check');

        const user = userQuery.rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            debugMessages.push('Password is incorrect');
            return res.status(400).json({ error: 'Incorrect password', debugMessages });
        }

        debugMessages.push('Password validated, login successful');
        const token = jwt.sign({ id: user.id, email: user.email, is_admin: user.is_admin }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ success: true, message: 'Login successful', token, user: { id: user.id, email: user.email, is_admin: user.is_admin }, debugMessages });
        
    } catch (error) {
        debugMessages.push(`Error during login: ${error.message}`);
        res.status(500).json({ error: 'Error during login', debugMessages });
    }
});

function requireAdmin(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(403).json({ error: 'Token required' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });

        if (user && user.is_admin === 1) {
            req.user = user;
            next();
        } else {
            res.status(403).json({ error: 'Admin access required' });
        }
    });
}

app.get('/api/products', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM products');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/products', requireAdmin, async (req, res) => {
    const { name, description, price, quantity } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO products (name, description, price, quantity) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, description, price, quantity]
        );
        const newProduct = result.rows[0];
        await pool.query(
            'INSERT INTO transactions (name, description, price, quantity, action) VALUES ($1, $2, $3, $4, $5)',
            [newProduct.name, newProduct.description, newProduct.price, newProduct.quantity, 'add']
        );
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/products/:id', requireAdmin, async (req, res) => {
    const { id } = req.params;
    const { name, description, price, quantity } = req.body;

    try {
        const result = await pool.query(
            'UPDATE products SET name = $1, description = $2, price = $3, quantity = $4 WHERE id = $5 RETURNING *',
            [name, description, price, quantity, id]
        );
        const updatedProduct = result.rows[0];
        await pool.query(
            'INSERT INTO transactions (name, description, price, quantity, action) VALUES ($1, $2, $3, $4, $5)',
            [updatedProduct.name, updatedProduct.description, updatedProduct.price, updatedProduct.quantity, 'edit']
        );
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/products/:id', requireAdmin, async (req, res) => {
    const { id } = req.params;

    try {
        const productResult = await pool.query('SELECT * FROM products WHERE id = $1', [id]);

        if (productResult.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const productToDelete = productResult.rows[0];
        await pool.query(
            'INSERT INTO transactions (name, description, price, quantity, action) VALUES ($1, $2, $3, $4, $5)',
            [productToDelete.name, productToDelete.description, productToDelete.price, productToDelete.quantity, 'delete']
        );
        await pool.query('DELETE FROM products WHERE id = $1', [id]);
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/transactions', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM transactions ORDER BY timestamp DESC');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const port = process.env.PORT || 5006;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
