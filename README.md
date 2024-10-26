# Product Management System

## Description

The **Product Management System** is a full-stack web application built using React for the frontend and Node.js with Express for the backend. It integrates PostgreSQL as the database and uses JWT for authentication and authorization. The system allows users to register, log in, and view a list of products. Admin users have additional privileges, such as adding, editing, and deleting products. The application also keeps track of all changes made to products, storing a transaction history that logs add, edit, and delete actions.

## Features

- **User Authentication:** Register and login functionalities with JWT-based authentication
- **Role-based Authorization:** Admin privileges granted with an admin key to allow secure product management
- **Product Management:** 
  - **Admin users** can add, edit, and delete products
  - **Regular users** can only view products
- **Transaction History:** Logs every action taken on products, including adding, editing, and deleting, along with timestamps
- **Responsive UI** built using React

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [File Structure](#file-structure)
- [Technologies](#technologies)
- [Future Enhancements](#future-enhancements)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ayushku634/GIVA-Assessment.git
   cd GIVA-Assessment
   ```

2. Navigate to the backend directory and install dependencies:
   ```bash
   cd backend
   npm i
   ```

3. Set up the environment variables by creating a `.env` file in the backend directory:
   ```env
   DB_USER=your_db_user
   DB_HOST=localhost
   DB_NAME=your_db_name
   DB_PASSWORD=your_db_password
   DB_PORT=your_db_port
   JWT_SECRET=your_jwt_secret
   ADMIN_KEY=your_admin_key
   ```

4. Create the required PostgreSQL database and tables:
   ```sql
   CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    is_admin INTEGER DEFAULT 0  -- Admin key, stores 6-digit integer if admin
    );

   CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    quantity INTEGER NOT NULL
    );

   CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    description TEXT,
    price DECIMAL(10, 2),
    quantity INTEGER,
    action VARCHAR(10),  -- 'add', 'edit', or 'delete'
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
   ```

5. Start the backend server:
   ```bash
   node index.js
   ```

6. Set up the frontend:
   ```bash
   cd ../src
   npm i
   npm start
   ```

## Usage

### Register and Login
- Register by providing an email, username, password, and an optional admin key
- If you provide the correct admin key during registration, your account will have admin privileges
- Log in using your registered email and password

### Managing Products
- **Admin Users:**
  - Can add, edit, and delete products
- **Regular Users:**
  - Can view the list of products

### Viewing Transaction History
- Navigate to the Transaction History section to view all product actions with timestamps

## Environment Variables

| Variable | Description |
|----------|-------------|
| DB_USER | PostgreSQL database username |
| DB_HOST | PostgreSQL database host |
| DB_NAME | PostgreSQL database name |
| DB_PASSWORD | PostgreSQL database password |
| DB_PORT | PostgreSQL database port |
| JWT_SECRET | Secret key for signing JWT tokens |
| ADMIN_KEY | Special key required for admin privileges |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register` | Register a new user |
| POST | `/api/login` | Authenticate a user and receive a token |
| GET | `/api/products` | Get a list of all products |
| POST | `/api/products` | Add a new product (admin-only) |
| PUT | `/api/products/:id` | Update an existing product (admin-only) |
| DELETE | `/api/products/:id` | Delete an existing product (admin-only) |
| GET | `/api/transactions` | Get the transaction history |

## File Structure

```
product-management-system/
│
├── backend/
│   ├── index.js
│   ├── .env
│   ├── package.json
│   └── (other backend-related files)
│
└── src/
    ├── components/
    │   ├── AddProduct.js
    │   ├── Login.js
    │   ├── ProductList.js
    │   ├── Register.js
    │   └── TransactionHistory.js
    │
    ├── styles/
    │   ├── AddProduct.css
    │   ├── ProductList.css
    │   ├── TransactionHistory.css
    │   └── Popup.css
    │
    ├── App.js
    ├── App.css
    ├── package.json
    └── (other frontend-related files)
```

## Technologies

- **Frontend:**
  - React
  - Axios
  - CSS
- **Backend:**
  - Node.js
  - Express.js
  - JWT for authentication
- **Database:**
  - PostgreSQL

## Future Enhancements

- [ ] Search and Filter: Add search and filter functionality to the product list
- [ ] User Profiles: Allow users to update their profile information
- [ ] Product Categories: Add categorization to products for better organization
- [ ] Notifications: Send email or in-app notifications for product-related actions

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
