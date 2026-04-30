# FinEdge – Personal Finance & Expense Tracker API

A backend application to manage personal finances by tracking income and expenses, with powerful analytics like summaries and monthly trends.

---

## Features

### Authentication

- User registration
- User login (JWT-based authentication)
- Protected routes using middleware

### Transactions

- Add income/expense
- Fetch all transactions
- Get transaction by ID
- Update transaction
- Delete transaction

### Filtering & Search

- Filter by category (`?category=food`)
- Filter by type (`?type=expense`)
- Date range filtering (`startDate`, `endDate`)
- Search by keyword (`?search=lunch`)

### Analytics (Bonus)

- Summary (Total Income, Expense, Balance)
- Monthly trends (income vs expense)
- Recent transactions

---

## Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- dotenv

---

## Project Structure

```
FinEdge/
│
├── config/              # Database configuration
├── controllers/         # Business logic
├── models/              # Mongoose schemas
├── routes/              # API routes
├── middlewares/         # Logger, Auth, Error handler
├── utils/               # Filters & helper functions
├── .env                 # Environment variables
├── app.js               # Main entry point
└── README.md
```

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd FinEdge
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create `.env` File

```
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### 4. Start the Server

```bash
npm start
```

---

## API Endpoints

### Auth

| Method | Route                 |
| ------ | --------------------- |
| POST   | /api/v1/auth/register |
| POST   | /api/v1/auth/login    |

---

### User

| Method | Route                 |
| ------ | --------------------- |
| GET    | /api/v1/users/profile |

---

### Transactions

| Method | Route                               |
| ------ | ----------------------------------- |
| POST   | /api/v1/transactions                |
| GET    | /api/v1/transactions                |
| GET    | /api/v1/transactions/:transactionId |
| PATCH  | /api/v1/transactions/:transactionId |
| DELETE | /api/v1/transactions/:transactionId |

---

### Filters Examples

```
GET /api/v1/transactions?category=food
GET /api/v1/transactions?type=expense
GET /api/v1/transactions?search=lunch
GET /api/v1/transactions?startDate=2026-04-01&endDate=2026-04-30
```

---

### Analytics

| Method | Route                       |
| ------ | --------------------------- |
| GET    | /api/v1/analytics/summary   |
| GET    | /api/v1/analytics/monthly   |
| GET    | /api/v1/transactions/recent |

---

## Example Response

### Summary API

```json
{
  "totalIncome": 80000,
  "totalExpense": 30000,
  "balance": 50000
}
```

---

## Middleware Used

- Logger Middleware (logs request method & URL)
- Authentication Middleware (JWT verification)
- Global Error Handler

---

## Health Check

```
GET /api/health
```

Response:

```json
{
  "status": "OK",
  "message": "Server is running",
  "timestamp": "2026-04-30T10:00:00.000Z"
}
```

---

## Future Improvements

- Budget management module
- AI-based expense categorization
- Frontend dashboard integration
- Caching for analytics
- Rate limiting middleware

---

## Author

- Mohankumar Markuli Chandrayigowda

---

## Notes

- Built using MVC architecture
- Uses MongoDB for data persistence
- Follows REST API best practices
- Fully supports filtering, search, and analytics
