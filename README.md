# FinEdge – Expense & Transaction Management API

A backend API for managing personal finances including authentication, transactions, filtering, and analytics.

## Project Overview

FinEdge is a **Node.js + Express + MongoDB** backend that allows users to:

- Authenticate (Signup/Login/Logout)
- Manage profile & password
- Track transactions (CRUD)
- Filter transactions
- View analytics (summary, monthly, yearly trends)

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication (via cookies)
- bcrypt (password hashing)
- validator (input validation)

## Project Setup & Execution

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd FinEdge
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Create a .env file:

```
PORT=3000
MONGO_URI=<your_mongodb_uri>
JWT_SECRET=<your_secret>
```

### 4. Run the server

```bash
npm start
```

Server runs at:

```bash
http://localhost:3000
```

## Health Check

```
GET /api/health
```

```json
{
  "status": "OK",
  "message": "Server is running",
  "timestamp": "2026-05-01T07:34:46.296Z"
}
```

## Auth APIs

### 1. Signup

```
POST /api/v1/auth/signup
```

```json
{
  "firstName": "Airtribe",
  "lastName": "School",
  "emailId": "airtribe@gmail.com",
  "password": "Airtribe@123",
  "currency": "INR"
}
```

### 2. Login

```
POST /api/v1/auth/login
```

```json
{
  "emailId": "airtribe123@gmail.com",
  "password": "Airtribe@123"
}
```

### 3. Logout

```
POST /api/v1/auth/logout
```

---

## User APIs

### 1. Get User Profile

GET /api/v1/users/profile
Response

```json
{
  "message": "User Airtribe fetched Successfully",
  "data": {
    "_id": "69f459a00ce26d30eb97932d",
    "firstName": "Airtribe",
    "lastName": "tribe",
    "emailId": "airtribe123@gmail.com",
    "currency": "INR"
  }
}
```

### 2. Update User Profile

PATCH /api/v1/users/profile

```json
{
  "firstName": "Air",
  "lastName": "Tribe",
  "currency": "INR"
}
```

### 3. Change User Password

PATCH /api/v1/users/password

```json
{
  "password": "Airtribe@123",
  "newPassword": "123@Airtribe"
}
```

## Transaction APIs

### 1. Add Transaction

POST /api/v1/transactions

```json
{
  "type": "expense",
  "category": "freelance",
  "amount": 45000,
  "paymentMethod": "bank",
  "merchant": "student",
  "description": "web-designer",
  "transactionDate": "1998-04-09"
}
```

### 2. Get All Transactions

```
GET /api/v1/transactions
```

### 3. Get Recent Transactions

```
GET /api/v1/transactions/recent
```

### 4. Get Transaction by ID

```
GET /api/v1/transactions/:transactionId
```

### 5. Update Transaction

```
PATCH /api/v1/transactions/:transactionId
```

```json
{
  "transactionDate": "2026-04-09",
  "paymentMethod": "upi",
  "description": "demo transaction"
}
```

### 6. Delete Transaction

```
DELETE /api/v1/transactions/:transactionId
```

## Transaction Filters

### Example

```
GET /api/v1/transactions?category=food&type=expense&paymentMethod=card
```

| Query Param   | Description               |
| ------------- | ------------------------- |
| category      | food, rent, shopping, etc |
| type          | income / expense          |
| paymentMethod | cash / card / upi / bank  |
| startDate     | yyyy-mm-dd                |
| endDate       | yyyy-mm-dd                |
| search        | merchant/description      |
| page          | pagination                |
| limit         | pagination                |

## Analytics APIs

### Summary

```
GET /api/v1/analytics/summary
```

Returns:

```
totalIncome
totalExpense
balance
```

### Monthly Trends

```
GET /api/v1/analytics/trends/monthly
```

### Yearly Trends

```
GET /api/v1/analytics/trends/yearly
```

### Analytics Filters

```
/api/v1/analytics/trends/yearly?category=food&type=expense&startDate=2026-01-01&endDate=2026-12-31
```

## Features

- Clean MVC architecture (Routes → Controllers → Services → Validators)
- Secure authentication (JWT cookies)
- Input validation
- MongoDB aggregation pipelines
- Pagination support
- Advanced filtering
- Scalable structure

## Folder Structure

```
FinEdge/
│
├── coverage/                  # Jest code coverage reports
├── node_modules/              # Dependencies
│
├── src/                       # Application source code
│   │
│   ├── config/                # Configuration files
│   │   └── database.js        # MongoDB connection setup
│   │
│   ├── controllers/           # Route handlers (business logic layer)
│   │   ├── analyticsController.js
│   │   ├── authController.js
│   │   ├── transactionController.js
│   │   └── userController.js
│   │
│   ├── data/                  # Static/mock JSON data
│   │   ├── transactions.json
│   │   └── users.json
│   │
│   ├── middlewares/           # Express middlewares
│   │   ├── errorHandler.js    # Global error handler
│   │   ├── logger.js          # Request logging
│   │   ├── userAuth.js        # Authentication middleware
│   │   └── validator.js       # Input validation logic
│   │
│   ├── models/                # Mongoose schemas
│   │   ├── transactionModel.js
│   │   └── userModel.js
│   │
│   ├── routes/                # API route definitions
│   │   ├── analyticsRoutes.js
│   │   ├── authRoutes.js
│   │   ├── transactionRoutes.js
│   │   └── userRoutes.js
│   │
│   ├── services/              # Business logic (service layer)
│   │   ├── analyticsServices.js
│   │   ├── authServices.js
│   │   ├── transactionServices.js
│   │   └── userServices.js
│   │
│   ├── utils/                 # Utility/helper functions
│   │   └── aiHelper.js
│   │
│   ├── app.js                 # Express app setup (middlewares, routes)
│   └── server.js              # Server entry point
│
├── test/                      # Test suite (mirrors src structure)
│   │
│   ├── config/
│   │   └── database.test.js
│   │
│   ├── controllers/
│   │   ├── analyticsController.test.js
│   │   ├── authController.test.js
│   │   ├── transactionController.test.js
│   │   └── userController.test.js
│   │
│   ├── middleware/
│   │   ├── errorHandler.test.js
│   │   ├── logger.test.js
│   │   ├── userAuth.test.js
│   │   └── validator.test.js
│   │
│   ├── models/
│   │   └── userModel.test.js
│   │
│   ├── routes/
│   │   ├── analyticsRoutes.test.js
│   │   ├── authRoutes.test.js
│   │   ├── transactionRoutes.test.js
│   │   └── userRoutes.test.js
│   │
│   ├── services/
│   │   ├── analyticsServices.test.js
│   │   ├── authServices.test.js
│   │   ├── transactionServices.test.js
│   │   └── userServices.test.js
│   │
│   └── utils/
│       └── testApp.js         # Test-specific Express app setup
│
├── .env                       # Environment variables
├── .gitignore
├── package.json
├── package-lock.json
├── LICENSE
└── README.md
```

## Important Notes

- All protected routes require authentication
- Dates must be in yyyy-mm-dd format
- Amount must be greater than 0
- Type must be income or expense
