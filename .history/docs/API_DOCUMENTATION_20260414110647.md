# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

Tokens are obtained from login/register and expire based on JWT_EXPIRATION (default: 7 days).

---

## Authentication Endpoints

### Register
Create a new user account.

**POST** `/auth/register`

Request body:
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "secure_password_123",
  "role": "USER"
}
```

Response (201):
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGc...",
  "user": {
    "id": "user_id",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "USER"
  }
}
```

### Login
Authenticate user and get token.

**POST** `/auth/login`

Request body:
```json
{
  "email": "john@example.com",
  "password": "secure_password_123"
}
```

Response (200):
```json
{
  "message": "Login successful",
  "token": "eyJhbGc...",
  "user": {
    "id": "user_id",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "USER",
    "walletBalance": 150.50
  }
}
```

### Get Current User
Get authenticated user's profile.

**GET** `/auth/me`

Headers:
```
Authorization: Bearer <token>
```

Response (200):
```json
{
  "id": "user_id",
  "username": "johndoe",
  "email": "john@example.com",
  "role": "USER",
  "xHandle": "johndoe_x",
  "isPremiumAccount": false,
  "walletBalance": 150.50,
  "totalEarned": 200.75,
  "createdAt": "2024-01-15T10:30:00Z"
}
```

---

## Task Endpoints

### Get Available Tasks
Browse all active tasks.

**GET** `/tasks/available`

Query parameters:
- `status` - Filter by status (ACTIVE, PAUSED, COMPLETED)
- `type` - Filter by type (FOLLOW, LIKE, REPOST, QUOTE, POST)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `premium` - Filter premium tasks (true/false)

Response (200):
```json
{
  "tasks": [
    {
      "id": "task_id",
      "title": "Follow @Example",
      "type": "FOLLOW",
      "description": "Follow our account",
      "rewardPerTask": 0.50,
      "isPremium": false,
      "status": "ACTIVE",
      "creator": {
        "username": "creator_name",
        "avatarUrl": "https://..."
      },
      "_count": {
        "submissions": 42
      }
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 20
  }
}
```

### Create Task (Creator Only)
Create a new engagement task.

**POST** `/tasks`

Headers:
```
Authorization: Bearer <token>
```

Request body:
```json
{
  "type": "FOLLOW",
  "title": "Follow Our Account",
  "description": "Follow @example and reply to the pinned tweet with 👍",
  "rewardPerTask": 0.50,
  "totalBudget": 500.00,
  "isPremium": false,
  "imageUrl": "https://example.com/image.jpg"
}
```

Response (201):
```json
{
  "message": "Task created successfully",
  "task": {
    "id": "task_id",
    "creatorId": "user_id",
    "type": "FOLLOW",
    "title": "Follow Our Account",
    "rewardPerTask": 0.50,
    "totalBudget": 500.00,
    "remainingBudget": 500.00,
    "status": "ACTIVE",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### Submit Task
Submit proof of completed task.

**POST** `/tasks/submit`

Headers:
```
Authorization: Bearer <token>
```

Request body:
```json
{
  "taskId": "task_id",
  "proof": "https://twitter.com/example/status/123456"
}
```

Response (201):
```json
{
  "message": "Task submitted for review",
  "submission": {
    "id": "submission_id",
    "taskId": "task_id",
    "userId": "user_id",
    "proof": "https://twitter.com/example/status/123456",
    "status": "PENDING",
    "reward": 0.50,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### Get User Submissions
Get all user's task submissions.

**GET** `/tasks/my-submissions`

Headers:
```
Authorization: Bearer <token>
```

Response (200):
```json
[
  {
    "id": "submission_id",
    "status": "APPROVED",
    "reward": 0.50,
    "proof": "https://...",
    "task": {
      "title": "Follow Our Account",
      "type": "FOLLOW",
      "rewardPerTask": 0.50
    }
  }
]
```

---

## Wallet Endpoints

### Get Balance
Get account balance and total earnings.

**GET** `/wallet/balance`

Headers:
```
Authorization: Bearer <token>
```

Response (200):
```json
{
  "walletBalance": 150.50,
  "totalEarned": 500.75
}
```

### Request Withdrawal
Request to withdraw earnings.

**POST** `/wallet/withdraw`

Headers:
```
Authorization: Bearer <token>
```

Request body:
```json
{
  "amount": 100.00,
  "walletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f42bE"
}
```

Response (201):
```json
{
  "message": "Withdrawal requested",
  "withdrawal": {
    "id": "withdrawal_id",
    "userId": "user_id",
    "amount": 100.00,
    "walletAddress": "0x742d...",
    "status": "PENDING",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### Get Transactions
Get transaction history.

**GET** `/wallet/transactions`

Query parameters:
- `type` - Filter by type (EARNING, WITHDRAWAL, DEPOSIT)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

Response (200):
```json
{
  "transactions": [
    {
      "id": "tx_id",
      "amount": 50.00,
      "type": "EARNING",
      "status": "completed",
      "description": "Reward for FOLLOW task",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1
  }
}
```

---

## Admin Endpoints

All admin endpoints require `role: ADMIN`

### Get Pending Submissions
Review submissions awaiting approval.

**GET** `/admin/submissions/pending`

Headers:
```
Authorization: Bearer <admin_token>
```

Response (200):
```json
[
  {
    "id": "submission_id",
    "status": "PENDING",
    "reward": 0.50,
    "proof": "https://...",
    "task": {
      "title": "Follow Our Account",
      "type": "FOLLOW"
    },
    "user": {
      "username": "johndoe",
      "xHandle": "johndoe_x"
    }
  }
]
```

### Approve Submission
Approve a task submission.

**POST** `/admin/submissions/approve`

Request body:
```json
{
  "submissionId": "submission_id"
}
```

Response (200):
```json
{
  "message": "Submission approved",
  "submission": {
    "status": "APPROVED",
    "reviewedAt": "2024-01-15T10:30:00Z"
  }
}
```

### Reject Submission
Reject a task submission.

**POST** `/admin/submissions/reject`

Request body:
```json
{
  "submissionId": "submission_id",
  "reason": "Proof does not show engagement"
}
```

Response (200):
```json
{
  "message": "Submission rejected",
  "submission": {
    "status": "REJECTED",
    "rejectionReason": "Proof does not show engagement"
  }
}
```

### Get Analytics
Get platform analytics and statistics.

**GET** `/admin/analytics`

Response (200):
```json
{
  "totalUsers": 1250,
  "totalTasks": 445,
  "completedTasks": 3200,
  "totalEarnings": 15000.50,
  "totalRevenue": 2250.08,
  "activeCreators": 128
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "error": "Error message describing what went wrong"
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Resource created
- `400` - Bad request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Resource not found
- `409` - Conflict (duplicate resource)
- `500` - Server error

### Example Error Response

```json
{
  "error": "User already exists"
}
```

---

## Rate Limiting (Recommended)

Implement rate limiting to prevent abuse:
- 100 requests per minute per IP for public endpoints
- 1000 requests per minute per user for authenticated endpoints

---

## WebSocket Events (Optional Enhancement)

For real-time updates, consider implementing:
- `task:created` - New task created
- `submission:approved` - Submission approved
- `withdrawal:processed` - Withdrawal sent
- `balance:updated` - Balance changed

---

## Testing Endpoints

### Test Credentials

Create test accounts in development:

```bash
# Creator Account
Email: creator@test.com
Password: CreatorTest123!
Role: CREATOR

# User Account
Email: user@test.com
Password: UserTest123!
Role: USER

# Admin Account
Email: admin@test.com
Password: AdminTest123!
Role: ADMIN
```

### cURL Examples

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "TestPassword123!",
    "role": "USER"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!"
  }'

# Get Current User
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <token>"

# Get Available Tasks
curl -X GET "http://localhost:5000/api/tasks/available?type=FOLLOW&page=1&limit=10"
```

---

**Last Updated**: 2024
**API Version**: 1.0.0
