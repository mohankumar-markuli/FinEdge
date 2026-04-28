# finEdge-Backend

## authRouter

### 🔹 1. User signup API

**POST /signup**

#### Body:

```json
{
  "firstName": "Airtribe",
  "lastName": "School",
  "emailId": "airtribe@gmail.com",
  "password": "Airtribe@123",
  "currency": "INR"
}
```

#### Notes:

- `lastName` is optional
- `currency` is optional with values: ["INR", "USD", "GBP"], (default "INR")

#### Responses:

- ✅ 201 → SUCCESS

```json
{
  "message": "User Airtribe registered successfully",
  "data": {
    "firstName": "Airtribe",
    "lastName": "School",
    "emailId": "airtribe@gmail.com",
    "password": "Airtribe@123",
    "currency": "INR"
  }
}
```

- ❌ 400 → BAD REQUEST

```json
{
  "message": "Failed to signup",
  "error": "VALIDATION_ERROR"
}
```

### 🔹 2. User login API

**POST /login**

#### Body:

```json
{
  "emailId": "airtribe@gmail.com",
  "password": "Airtribe@123"
}
```

#### Responses:

- ✅ 201 → SUCCESS

```json
{
  "message": "Airtribe Logged in Successfully",
  "data": {
    "firstName": "Airtribe",
    "lastName": "School",
    "emailId": "airtribe@gmail.com",
    "password": "$2b$10$ZrB20wMUHMOF0TrfxeuRWeGVq/0I1nLx0e8DB79H/PeutUyTtDXWu",
    "currency": "INR",
    "createdAt": "2026-04-28T12:03:32.856Z",
    "updatedAt": "2026-04-28T12:03:32.856Z"
  }
}
```

- ❌ 400 → BAD REQUEST

```json
{
  "message": "Invalid credentials",
  "error": "VALIDATION_ERROR"
}
```

### 🔹 3. User logout API

**POST /login**

#### Responses:

- ✅ 201 → SUCCESS

```json
{
  "message": "Logout Successful"
}
```

- ❌ 400 → BAD REQUEST

```json
{
  "message": "Failed to logout",
  "error": "SERVER_ERROR"
}
```
