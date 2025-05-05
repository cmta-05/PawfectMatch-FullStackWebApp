
# 🐾 Pawfect Match – MongoDB Compass (localhost) Version

This folder contains the **MongoDB Compass (localhost)** version of the Pawfect Match Full Stack Web Application.

---

## 📌 Purpose of This Folder

This separate folder was created to serve as a **record and backup** of our local development progress using **MongoDB Compass with localhost**. Initially, this version advanced more quickly due to technical issues experienced with setting up **MongoDB Atlas + Compass** as originally instructed.

> ✅ We are now able to continue development using **MongoDB Atlas + Compass**, but we are preserving this version for documentation, comparison, and possible future reference.

---

## 🗂 Folder Contents

| File/Folder      | Description                                              |
|------------------|----------------------------------------------------------|
| `bin/`           | Server startup configuration                            |
| `models/`        | Mongoose schemas/models for MongoDB                     |
| `routes/`        | Express routes for API endpoints                        |
| `node_modules/`  | Local dependencies (auto-generated, normally .gitignored)|
| `app.js`         | Main server entry point (Express configuration)         |
| `env.txt`        | Renamed `.env` file for GitHub upload compatibility     |
| `package.json`   | Project metadata and dependencies                       |
| `package-lock.json` | Locked versions of installed packages               |
| `README.md`      | This file                                                |

> 🔐 The `.env` file was renamed to `env.txt` so it could be uploaded to GitHub. Rename it back to `.env` after cloning.

---

## 🔧 How to Run Locally (MongoDB Compass)

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/PawfectMatch-FullStackWebApp.git
   ```

2. **Navigate to this folder**
   ```bash
   cd "MongoDB Compass (localhost)"
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Rename the environment file**
   ```bash
   mv env.txt .env
   ```

5. **Start the server**
   ```bash
   node app.js
   ```

6. **Open MongoDB Compass**
   - Connect to: `mongodb://localhost:27017`
   - Access the corresponding database used in your `.env` file.

---

## 🛠 Status

This version is feature-complete for:
- Backend setup using Node.js and Express.js
- Database integration using MongoDB Compass (localhost)
- Routes and models fully configured
- Environment variable structure in place

> ✅ All Phase 3 files have been uploaded and are functional.

---

## 🗃 Notes

- This folder is retained **for tracking local development** and maintaining version history.
- We are now fully transitioning to **MongoDB Atlas + Compass**, but this version remains as part of our working documentation.

---
