# XTasker - X Engagement Marketplace Platform

A production-ready full-stack platform where task creators post X engagement tasks (follow, like, repost, quote, post), and users complete them to earn USDC rewards on the Base network.

## 🏗️ Architecture

```
XTasker/
├── backend/                 # Express.js API
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── controllers/    # Business logic
│   │   ├── middleware/     # Auth, validation
│   │   └── utils/          # Helpers, database
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   ├── package.json        # Dependencies
│   ├── tsconfig.json       # TypeScript config
│   └── .env.example        # Environment variables
│
├── frontend/               # Next.js App
│   ├── app/
│   │   ├── page.tsx        # Landing page
│   │   ├── login/          # Authentication
│   │   ├── register/       
│   │   ├── dashboard/      # User dashboard
│   │   ├── creator/        # Creator pages
│   │   └── admin/          # Admin panel
│   ├── components/         # Reusable components
│   ├── lib/
│   │   ├── api.ts         # API client
│   │   └── store.ts       # State management (Zustand)
│   ├── package.json       # Dependencies
│   ├── tailwind.config.js # Tailwind CSS
│   └── next.config.js     # Next.js config
│
└── docs/                   # Documentation
```

## 🚀 Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT
- **Blockchain**: Ethers.js with Base network (USDC ERC20)
- **State Management**: Zustand
- **Hosting**: Vercel (frontend), Railway (backend/db)

## 🎯 Core Features

### User Features
- ✅ Browse available engagement tasks
- ✅ Complete tasks (FOLLOW, LIKE, REPOST, QUOTE, POST)
- ✅ Submit proof of completion
- ✅ Earn USDC rewards
- ✅ Track submissions and earnings
- ✅ Wallet management
- ✅ Withdraw to Base network wallet

### Creator Features
- ✅ Create engage tasks
- ✅ Set task types and rewards
- ✅ Track budget and submissions
- ✅ Manage active tasks
- ✅ Premium task creation (for verified accounts)

### Admin Features
- ✅ Review and approve/reject submissions
- ✅ Manage withdrawal requests
- ✅ View platform analytics
- ✅ Suspend users for suspicious activity
- ✅ Monitor platform earnings

## 📊 Database Schema

### Core Models
- **Users**: User accounts, roles, wallets
- **Tasks**: Task listings with types and rewards
- **TaskSubmissions**: User submissions with approval workflow
- **Transactions**: Earnings and wallet history
- **Withdrawals**: Withdrawal requests to USDC
- **PremiumRequests**: Premium account verification
- **AuditLogs**: Admin actions tracking
- **Analytics**: Platform statistics

See `backend/prisma/schema.prisma` for full schema.

## 🔧 Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- Git

### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
cp .env.example .env
```

2. **Configure .env**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/xtasker"
JWT_SECRET=your_jwt_secret_min_32_chars
PORT=5000
FRONTEND_URL=http://localhost:3000
```

3. **Install dependencies**
```bash
npm install
```

4. **Setup database**
```bash
npm run prisma:generate
npm run prisma:migrate
```

5. **Start backend**
```bash
npm run dev
```

Backend runs on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
cp .env.local.example .env.local
```

2. **Configure .env.local**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_min_32_chars
```

3. **Install dependencies**
```bash
npm install
```

4. **Start frontend**
```bash
npm run dev
```

Frontend runs on `http://localhost:3000`

### Database Setup

```bash
# Create PostgreSQL database
createdb xtasker

# Run migrations
cd backend
npm run prisma:migrate

# View database in Prisma Studio
npm run prisma:studio
```

## 📝 API Routes

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Tasks
- `GET /api/tasks/available` - Get available tasks
- `GET /api/tasks/my-tasks` - Get creator's tasks
- `POST /api/tasks` - Create task (creator)
- `POST /api/tasks/submit` - Submit task
- `GET /api/tasks/my-submissions` - Get user's submissions

### Wallet
- `GET /api/wallet/balance` - Get wallet balance
- `GET /api/wallet/transactions` - Get transaction history
- `POST /api/wallet/withdraw` - Request withdrawal
- `GET /api/wallet/withdrawals` - Get withdrawal history

### Admin
- `GET /admin/submissions/pending` - Get pending submissions
- `POST /admin/submissions/approve` - Approve submission
- `POST /admin/submissions/reject` - Reject submission
- `GET /admin/withdrawals/pending` - Get pending withdrawals
- `POST /admin/withdrawals/approve` - Approve withdrawal
- `GET /admin/analytics` - Get analytics

## 💰 Reward Tiers

| Task Type | Base Reward |
|-----------|------------|
| Follow    | $0.50      |
| Like      | $0.25      |
| Repost    | $1.00      |
| Quote     | $2.00      |
| Post      | $3.00      |

**Premium Multiplier**: 2x - 5x for high-quality accounts

**Platform Fee**: 15% (configurable)

## 🔐 Security Features

- JWT authentication
- Password hashing with bcryptjs
- Input validation with express-validator
- Admin-only endpoints
- Withdrawal verification
- Audit logging
- Rate limiting (recommended)

## 🌐 Blockchain Integration

### Base Network
- **Network**: Base (Ethereum Layer 2)
- **Token**: USDC (0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913)
- **Library**: ethers.js v6
- **Min Withdrawal**: $1 USDC

### Environment Variables
```env
VITE_PRIVATE_KEY=your_private_key
USDC_CONTRACT_ADDRESS=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
BASE_RPC_URL=https://mainnet.base.org
```

## 🚀 Deployment

### Frontend (Vercel)
```bash
npm install -g vercel
vercel --prod
```

### Backend (Railway)
1. Connect GitHub repository
2. Add environment variables
3. Deploy with PostgreSQL add-on

## 📈 Future Enhancements

- [ ] Referral system
- [ ] Leaderboards
- [ ] X verification API integration
- [ ] Dispute resolution system
- [ ] Email notifications
- [ ] Push notifications
- [ ] Multi-language support
- [ ] Advanced analytics
- [ ] Task scheduling
- [ ] VIP tier system
- [ ] Statistics export
- [ ] Performance optimizations

## ⚡ Performance Optimization

- Implemented pagination for tasks and transactions
- Database indexing on frequently queried fields
- JWT token caching
- Zustand for lightweight state management
- Next.js image optimization
- CSS-in-JS with Tailwind

## 🐛 Common Issues & Troubleshooting

### Database Connection Fails
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env
- Verify database exists: `createdb xtasker`

### Authentication Not Working
- Regenerate JWT_SECRET
- Clear localStorage in browser
- Check token expiration

### SMTP Not Configured
- Email notifications are optional
- Implement your email service (SendGrid, etc.)

## 📝 Development Notes

- All timestamps are in UTC
- Platform fee is deducted from creator's budget
- Task submissions require proof URL
- Withdrawals are processed by admins
- Prisma migrations are required after schema changes

## 📄 License

MIT License - Feel free to use for commercial projects

## 🤝 Support

For issues or questions:
- Check documentation
- Review API responses
- Check admin panel
- Contact support team

---

**Built with** ❤️ using modern web technologies
