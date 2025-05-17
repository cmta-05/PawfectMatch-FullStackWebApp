# ⚙️ Backend – Pawfect Match

This README provides an overview of the backend setup for **Pawfect Match**, a Node.js + Express.js application connected to MongoDB via Mongoose.

---

## 📌 Routes Implemented

| **Endpoint**              | **Method** | **Description**                          | **File**              |
|---------------------------|------------|------------------------------------------|----------------------|
| `/api/users`              | GET        | Retrieves all users                      | `userRoutes.js`      |
| `/api/users`              | POST       | Creates a new user                       | `userRoutes.js`      |
| `/api/pets`               | GET        | Retrieves all pets                       | `petRoutes.js`       |
| `/api/pets`               | POST       | Creates a new pet                        | `petRoutes.js`       |
| `/api/pets/:id`           | GET        | Retrieves a specific pet                 | `petRoutes.js`       |
| `/api/pets/:id`           | PUT        | Updates a specific pet                   | `petRoutes.js`       |
| `/api/pets/:id`           | DELETE     | Deletes a specific pet                   | `petRoutes.js`       |
| `/api/favorites`          | GET        | Retrieves user favorites                 | `favoriteRoutes.js`  |
| `/api/favorites`          | POST       | Adds a pet to favorites                  | `favoriteRoutes.js`  |
| `/api/match-requests`     | GET        | Retrieves match requests                 | `matchRequestRoutes.js` |
| `/api/match-requests`     | POST       | Creates a new match request              | `matchRequestRoutes.js` |
| `/api/contact`            | POST       | Handles contact form submissions         | `contact.js`         |

> 🔐 *Protected routes will use JWT in future phases.*

---

## 🧩 Current Models

| **Model Name**    | **Purpose**                                 | **File**        |
|-------------------|---------------------------------------------|-----------------|
| `User`            | Stores user info such as name, email, etc.  | `User.js`       |
| `Pet`             | Stores pet information and details          | `Pet.js`        |
| `Favorite`        | Manages user's favorite pets                | `Favorite.js`   |
| `MatchRequest`    | Handles pet matching requests               | `MatchRequest.js` |
| `Contact`         | Stores contact form submissions             | `contact.js`    |

---

## 🌐 Connection Setup

- MongoDB connection is defined in `config/db.js` using Mongoose
- `.env` file is used to store sensitive environment variables:
  ```
  MONGO_URI=your_mongo_connection_string
  PORT=5000
  JWT_SECRET=your_jwt_secret
  ```

- `app.js` and `server.js` handle the initialization of the Express app and database connection

---

## 🚀 How to Run the Server Locally

1. **Clone the Repository**
   ```bash
   git clone https://github.com/cmta-05/PawfectMatch-FullStackWebApp.git
   cd PawfectMatch-FullStackWebApp
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

## 🛠️ Additional Tools

- `fix_pet_user_ids.js`: Utility script to fix pet and user ID relationships
- `cleanupOrphanedPets.js`: Utility script to clean up orphaned pet records

---

This backend serves as the foundation for all server-side logic in the Pawfect Match application and will be expanded in upcoming phases.

