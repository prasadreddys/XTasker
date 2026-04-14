# Getting Started Guide

## Quick Start (5 minutes)

### 1. Prerequisites
- Node.js 18+
- PostgreSQL 12+
- Git

### 2. Clone & Setup

```bash
# Navigate to project directory
cd XTasker

# Run automated setup
chmod +x setup.sh
./setup.sh

# Or manual setup:
# Backend
cd backend
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate

# Frontend
cd frontend
cp .env.local.example .env.local
npm install
```

### 3. Start Development Servers

**Terminal 1 - Backend**
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 - Frontend**
```bash
cd frontend
npm run dev
# App runs on http://localhost:3000
```

**Terminal 3 - Database (Optional)**
```bash
cd backend
npm run prisma:studio
# Opens Prisma Studio at http://localhost:5555
```

### 4. Create Test Accounts

Visit http://localhost:3000 and create accounts:

#### User Account
- Email: `user@test.com`
- Password: `UserTest123!`
- Role: Task Completer

#### Creator Account
- Email: `creator@test.com`
- Password: `CreatorTest123!`
- Role: Task Creator

#### Admin Account (Manually in DB)
```bash
# Using Prisma Studio or SQL
INSERT INTO "User" (id, username, email, "passwordHash", role, "isActive", "isEmailVerified")
VALUES (
  'admin123',
  'admin',
  'admin@test.com',
  '$2a$10$...', -- hashed password
  'ADMIN',
  true,
  true
);
```

---

## Project Structure

```
XTasker/
├── backend/                    # Express API Server
│   ├── src/
│   │   ├── index.ts           # Main server file
│   │   ├── middleware/        # Auth & validation
│   │   ├── controllers/       # Business logic
│   │   ├── routes/            # API endpoints
│   │   └── utils/             # Helpers
│   ├── prisma/
│   │   └── schema.prisma      # Database schema
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/                   # Next.js App
│   ├── app/
│   │   ├── page.tsx           # Landing page
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── dashboard/         # User dashboard
│   │   ├── creator/           # Creator pages
│   │   └── admin/             # Admin panel
│   ├── components/            # React components
│   ├── lib/
│   │   ├── api.ts             # API client
│   │   └── store.ts           # State management
│   ├── public/                # Static files
│   ├── tailwind.config.js
│   └── next.config.js
│
└── docs/
    ├── README.md              # Full documentation
    ├── API_DOCUMENTATION.md   # API reference
    ├── DEPLOYMENT.md          # Deployment guide
    └── GETTING_STARTED.md     # This file
```

---

## Understanding the Architecture

### Frontend (Next.js)
- **Pages**: Located in `/app` directory using Next.js 14 file-based routing
- **Components**: Reusable React components in `/components`
- **State Management**: Zustand for global state (auth, wallet)
- **Styling**: Tailwind CSS with dark mode theme
- **API Client**: Axios with interceptors for authentication

### Backend (Express)
- **Routes**: Organized by feature (auth, tasks, wallet, admin)
- **Controllers**: Business logic for each route
- **Middleware**: Authentication, validation, error handling
- **Database**: PostgreSQL with Prisma ORM
- **Security**: JWT tokens, password hashing with bcryptjs

### Database (PostgreSQL)
- **13 Core Models**: Users, Tasks, Submissions, Transactions, Withdrawals, etc.
- **Relationships**: Set up with proper foreign keys and cascading
- **Indexes**: Performance optimization on frequently queried fields

---

## Common Development Tasks

### Adding a New API Endpoint

1. **Create Controller** (`backend/src/controllers/`)
```typescript
export const myNewController = async (req, res) => {
  try {
    // Logic here
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
};
```

2. **Add Route** (`backend/src/routes/`)
```typescript
router.post('/my-new-endpoint', authMiddleware, myNewController);
```

3. **Use in Frontend** (`frontend/lib/api.ts`)
```typescript
export const myApi = {
  callNewEndpoint: (data) => api.post('/my-new-endpoint', data),
};
```

### Adding a New Page

1. **Create Page** in `/app/<section>/page.tsx`
```typescript
'use client';
export default function MyPage() {
  return <div>Page content</div>;
}
```

2. **Add Navigation Link** in `components/Navbar.tsx`

### Database Schema Changes

1. **Update** `backend/prisma/schema.prisma`
2. **Create Migration**:
```bash
cd backend
npm run prisma:migrate -- --name my_migration_name
```
3. **Deploy Migration**:
```bash
npm run prisma:push
```

### Testing API Endpoints

**Using cURL:**
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "type": "FOLLOW",
    "title": "Test Task",
    "description": "Test Description",
    "rewardPerTask": 0.50,
    "totalBudget": 100
  }'
```

**Using Postman:**
1. Import endpoints from API docs
2. Set authorization header with Bearer token
3. Test each endpoint

---

## Environment Variables

### Backend (.env)
```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/xtasker

# Auth
JWT_SECRET=your_jwt_secret_here_min_32_characters
JWT_EXPIRATION=7d

# Server
NODE_ENV=development
PORT=5000
API_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000

# Blockchain
VITE_PRIVATE_KEY=your_blockchain_key
USDC_CONTRACT_ADDRESS=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
BASE_RPC_URL=https://mainnet.base.org

# Admin
PLATFORM_FEE_PERCENTAGE=15
MIN_WITHDRAWAL_AMOUNT=1
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_here
NEXTAUTH_URL=http://localhost:3000
```

---

## Debugging Tips

### Backend Debugging
```bash
# Enable debug logging
DEBUG=* npm run dev

# Use Node inspector
node --inspect-brk ./src/index.ts

# Check database
npm run prisma:studio
```

### Frontend Debugging
```bash
# Chrome DevTools
# Open http://localhost:3000, press F12

# Debug in VS Code
# Add to .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js",
      "type": "node",
      "runtimeVersion": "18",
      "request": "launch",
      "program": "${workspaceFolder}/frontend/node_modules/.bin/next",
      "args": ["dev"],
      "console": "integratedTerminal"
    }
  ]
}
```

### Database Debugging
```bash
# Connect directly
psql -d xtasker

# View tables
\dt

# View data
SELECT * FROM "User" LIMIT 5;

# Check logs (if using Prisma)
npm run prisma:studio
```

---

## Common Issues & Solutions

### Port Already in Use
```bash
# Find process using port
lsof -i :5000  # Backend
lsof -i :3000  # Frontend

# Kill process
kill -9 <PID>
```

### Database Connection Error
```bash
# Verify PostgreSQL is running
psql -U postgres

# Test connection URL
npm run prisma:studio

# Reset database
npm run prisma:migrate reset
```

### JWT Token Issues
```bash
# Regenerate JWT secret
openssl rand -base64 32

# Update .env and restart server
```

### Module Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install

# Clear build cache
rm -rf .next dist
npm run build
```

---

## Performance Tips

1. **Use Pagination**: Load tasks 20 at a time
2. **Cache Responses**: Implement Redis caching
3. **Optimize Queries**: Add database indexes
4. **Compress Images**: Use Next.js Image component
5. **Code Splitting**: Split large bundles
6. **Lazy Loading**: Load components on demand

---

## Security Best Practices

1. ✅ Never commit `.env` files
2. ✅ Use strong JWT secrets (32+ characters)
3. ✅ Validate all user inputs
4. ✅ Hash passwords with bcryptjs
5. ✅ Use HTTPS in production
6. ✅ Implement rate limiting
7. ✅ Keep dependencies updated
8. ✅ Use CORS carefully
9. ✅ Implement CSRF protection
10. ✅ Add request logging

---

## Next Steps

1. ✅ Complete setup and run servers
2. ✅ Create test accounts
3. ✅ Explore the UI
4. ✅ Test API endpoints
5. ✅ Read API documentation
6. ✅ Understand database schema
7. ✅ Start building features
8. ✅ Deploy to staging
9. ✅ Test in production-like environment
10. ✅ Deploy to production

---

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Guide](https://expressjs.com/)
- [Prisma ORM](https://www.prisma.io/docs/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/)
- [ethers.js Documentation](https://docs.ethers.org/)

---

## Support

For issues or questions:
1. Check documentation
2. Review error messages
3. Check logs
4. Review similar examples
5. Search existing issues
6. Ask for help

---

**Happy Coding! 🚀**
