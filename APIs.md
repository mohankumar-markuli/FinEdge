# finEdge-Backend

### 🔹Auth Router

```
POST /api/auth/signup
```

Request Body

```json
{
  "firstName": "Airtribe",
  "lastName": "School",
  "emailId": "airtribe@gmail.com",
  "password": "Airtribe@123",
  "currency": "INR"
}
```

```
POST /api/auth/login
```

Request Body

```json
{
  "emailId": "airtribe@gmail.com",
  "password": "Airtribe@123"
}
```

```
POST /api/auth/logout
```

### 🔹User Router APIs

```
GET /api/user/view
```

```
PATCH /api/user/edit
```

Request Body

```json
{
  "firstName": "Air",
  "lastName": "Tribe",
  "currency": "GBP"
}
```

```
PATCH /api/user/changepassword
```

Request Body

```json
{
  "password": "Airtribe@123",
  "newPassword": "Airtribe987"
}
```

### 🔹Transaction Router APIs

```
POST /api/transaction
```

Request Body

```json
{
  "type": "expense",
  "category": "freelance",
  "amount": 250,
  "paymentMethod": "upi"
}
```
