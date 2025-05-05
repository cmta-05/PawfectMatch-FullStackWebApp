# ⚙️ Backend – Pawfect Match

This README provides an overview of the backend setup for **Pawfect Match**, a Node.js + Express.js application connected to MongoDB via Mongoose.

---

## 📌 Routes Implemented

| **Endpoint**         | **Method** | **Description**                          | **File**         |
|----------------------|------------|------------------------------------------|------------------|
| `/api/users`         | GET        | Retrieves all users                      | `userRoutes.js`  |
| `/api/users`         | POST       | Creates a new user                       | `userRoutes.js`  |
| `/api/products`      | POST       | Adds a new product (used for testing)    | `product.js`     |

> 🔐 *Protected routes will use JWT in future phases.*

---

## 🧩 Current Models

| **Model Name** | **Purpose**                                 | **File**     |
|----------------|---------------------------------------------|--------------|
| `User`         | Stores user info such as name, email, etc.  | `User.js`    |
| `Product`      | Sample schema for testing POST API          | `product.js` |

Additional models for pets, matches, favorites, etc., will be added in later phases.

---

## 🌐 Connection Setup

- MongoDB connection is defined in `db.js` using Mongoose.
- `.env` file is used to store sensitive environment variables:
  ```
  MONGO_URI=your_mongo_connection_string
  PORT=5000
  JWT_SECRET=your_jwt_secret
  ```

- `app.js` and `server.js` handle the initialization of the Express app and database connection.

---

## 🚀 How to Run the Server Locally

1. **Clone the Repository**
   ```bash
   git clone https://github.com/cmta-05/PawfectMatch-FullStackWebApp.git
   cd PawfectMatch-FullStackWebApp/backend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Create a `.env` File**
   ```
   MONGO_URI=your_mongo_connection_string
   PORT=5000
   JWT_SECRET=your_jwt_secret
   ```

4. **Run the Server**
   ```bash
   node server.js
   ```

> ✅ Use **Thunder Client** or **Postman** to test endpoints.

---

This backend serves as the foundation for all server-side logic in the Pawfect Match application and will be expanded in upcoming phases.
