# Inventory Manager

Inventory Manager is a REST API built for inventory and category management with authentication and role-based access control. The API supports product and category CRUD operations, JWT authentication, refresh token management, validation, rate limiting, and MongoDB integration.

---

# Features

* Product management
* Category management
* User authentication
* JWT access tokens with refresh token support
* Role-based authorisation
* Request validation using Joi
* Password hashing using bcrypt
* MongoDB database integration
* Global and authentication-specific rate limiting
* Pagination support
* Product filtering by category
* Low-stock inventory tracking

---

# Technology Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT (RS256)
* bcrypt
* Joi Validation
* Express Rate Limit

---

# Setup Instructions

## 1. Install Dependencies

```bash
npm install
```

---

## 2. Generate RSA Keys

This application uses the RS256 JWT algorithm.

Generate a private and public key pair in `.pem` format.

Example using OpenSSL:

```bash
openssl genrsa -out private.pem 4096

openssl rsa -in private.pem -pubout -out public.pem
```

---

## 3. Configure Key Paths

Update the public key path inside:

[authenticator.js](./middleware/authenticator.js)

Locate:

```javascript
pub_key
```

and provide the correct path to your public key.

Update the private key path inside:

[auth.js](./controllers/auth.js)

Locate:

```javascript
priv_key
```

and provide the correct path to your private key.

### Key Usage

* Private Key → JWT signing
* Public Key → JWT verification

---

## 4. Configure Environment Variables

Create a `.env` file in the project root.

```env
NODE_ENV=development
URL=mongodb_connection_string
FRONT=http://localhost:5173
```

### Environment Variables

| Variable | Description                              |
| -------- | ---------------------------------------- |
| NODE_ENV | Application environment                  |
| URL      | MongoDB connection string                |
| FRONT    | Frontend URL used for CORS configuration |

---

## 5. Start the Server

```bash
npm start
```

The application will start on:

```text
http://localhost:3000
```

---

# Authentication

Authentication uses JWT Access Tokens and Refresh Tokens.

## Access Token

* Algorithm: RS256
* Lifetime: 15 minutes

## Refresh Token

* Lifetime: 7 days
* Stored in an HTTP cookie
* Used to obtain a new access token

## Authorisation Header

Protected routes require:

```http
Authorization: Bearer <token>
```

---

# API Endpoints

## Products

### Get Products

```http
GET /products
```

Accessible to everyone.

Supports pagination and category filtering.

Example:

```http
GET /products?category=electronics
```

> Category filtering uses the category slug, not the category name.

---

### Get Low Stock Products

```http
GET /low-stock
```

Accessible to everyone.

Supports category filtering.

Example:

```http
GET /low-stock?category=electronics
```

> Category filtering uses the category slug, not the category name.

---

### Add Product

```http
POST /add/product
```

Requires:

* Staff role
* Admin role

---

### Edit Product

```http
PUT /edit/product/:id
```

Requires:

* Staff role
* Admin role

`id` refers to the MongoDB ObjectId of the product.

---

### Delete Product

```http
DELETE /delete/:id
```

Requires:

* Admin role only

`id` refers to the MongoDB ObjectId of the product.

---

## Categories

### Add Category

```http
POST /add/category
```

Requires:

* Staff role
* Admin role

---

## Authentication

### Register

```http
POST /register
```

Creates a new user account.

After registration, users must authenticate through the login endpoint.

---

### Login

```http
POST /login
```

Returns:

```json
{
  "status": "Success",
  "message": "Successfully Logged In",
  "token": "jwt_access_token"
}
```

A refresh token is also issued as a cookie.

---

### Refresh Access Token

```http
POST /refresh
```

Generates a new access token using a valid refresh token.

---

### Logout

```http
POST /logout
```

Removes the stored refresh token and invalidates the session.

---

# Database Schemas

## Product

```javascript
{
  name,
  sku,
  category,
  quantity,
  lowStockThreshold
}
```

### Notes

* `sku` must be unique.
* `category` references a Category document.
* Category should be provided using the category name, not the slug.

---

## Category

```javascript
{
  name,
  slug
}
```

### Notes

* `name` must be unique.
* `slug` must be unique.
* Slug is generated automatically.

---

## User

```javascript
{
  username,
  password
}
```

### Notes

* `username` must be unique.
* Passwords are hashed using bcrypt before storage.

---

# Validation

Request bodies are validated using Joi middleware before reaching controller logic.

Validation errors return standard error responses.

---

# Response Format

## Success Response

```json
{
  "status": "Success",
  "message": "Operation completed successfully"
}
```

---

## Error Response

```json
{
  "error": "Error",
  "message": "Detailed error message"
}
```

---

# Security

## Password Security

Passwords are hashed using bcrypt before being stored in the database.

---

## Rate Limiting

### Global Rate Limit

```text
100 requests per 15 minutes per IP address
```

### Authentication Rate Limit

```text
15 login attempts per 15 minutes per IP address
```

This helps mitigate brute-force attacks and excessive API usage.
