# 💰 Balance Flow

A modern **full-stack digital wallet application** that allows users to securely manage their wallet, send money, and track transactions.

🔗 **Live Demo:** https://balance-flow-ejii.onrender.com

---

## 🚀 Features

* 🔐 User Registration & Login
* 🛡️ JWT Authentication
* 💰 Digital Wallet Management
* 💸 Send Money Between Users
* 📊 Dashboard with Wallet Information
* 📜 Transaction History
* 🔍 Search Transactions
* 🎯 Filter Transactions
* 🔒 Protected API Routes
* 📚 Swagger API Documentation
* ☁️ MongoDB Atlas Database
* 🌐 Fully Deployed Application

---

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* React Router
* CSS

### Backend

* Node.js
* Express.js
* JWT
* bcryptjs

### Database

* MongoDB
* Mongoose
* MongoDB Atlas

### Deployment

* Render

### API Documentation

* Swagger

---

## 🏗️ Project Architecture

```text
Balance Flow
│
├── client/                 # React Frontend
│   ├── src/
│   │   ├── pages/
│   │   ├── utils/
│   │   └── App.jsx
│
├── src/                    # Backend
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   └── routes/
│
├── public/                 # Production React Build
├── server.js               # Express Server
└── package.json
```

---

## 🔐 Authentication Flow

```text
User Login
    ↓
Server Validates Credentials
    ↓
JWT Token Generated
    ↓
Token Sent With Protected Requests
    ↓
Middleware Verifies JWT
    ↓
Access Granted
```

---

## 💸 Transaction Flow

```text
User Sends Money
       ↓
Sender Wallet Updated
       ↓
Receiver Wallet Updated
       ↓
Transaction Recorded
       ↓
Updated Balance Displayed
```

---

## 📚 API Documentation

Swagger API documentation:

### Local

http://localhost:3000/api-docs

### Live Application

https://balance-flow-ejii.onrender.com/api-docs

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/HemantTyagi-codes/Balance-Flow.git
```

### 2. Install backend dependencies

```bash
npm install
```

### 3. Install frontend dependencies

```bash
cd client
npm install
```

### 4. Create `.env`

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### 5. Run the application

```bash
npm run dev
```

The application will run on:

```text
http://localhost:3000
```

---


# 📸 Screenshots

## 🏠 Home Page

<img width="1920" height="1080" alt="Screenshot 2026-09-07 232251" src="https://github.com/user-attachments/assets/bc9f2e89-c1b7-4e82-83a2-1a564aa0da1a" />


---

## 🔐 Login Page

<img width="1920" height="1080" alt="Screenshot 2026-09-07 232259" src="https://github.com/user-attachments/assets/f8abcadd-43fb-44c6-a266-c14420b19927" />


---

## 💳 Dashboard

<img width="1920" height="1080" alt="Screenshot 2026-09-07 232311" src="https://github.com/user-attachments/assets/7590eb4c-3418-4116-98cf-6ddd3155371a" />


---

## 📜 Transaction History

<img width="1920" height="1080" alt="Screenshot 2026-09-07 232320" src="https://github.com/user-attachments/assets/2d9c2de7-5721-4901-9302-cbd624793f72" />


---

## 👨‍💻 Author

**Hemant Tyagi**

* GitHub: https://github.com/HemantTyagi-codes

---

⭐ If you like this project, consider giving it a star!
