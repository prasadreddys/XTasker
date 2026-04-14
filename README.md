# 🚀 XTasker - X Engagement Marketplace

A **production-ready full-stack platform** where task creators post X engagement tasks and users complete them to earn USDC rewards on the Base network.

![Project Status](https://img.shields.io/badge/status-production%20ready-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Node Version](https://img.shields.io/badge/node-%3E%3D18.0-brightgreen)

---

## 🎯 Overview

XTasker connects **task creators** with **task completers** in a decentralized marketplace:

- **Creators** post X engagement tasks (follow, like, repost, quote, post)
- **Users** complete tasks and earn USDC rewards
- **Smart verification** system ensures quality submissions
- **Blockchain payments** on Base network (Ethereum L2)
- **Admin panel** for platform management and analytics

### Perfect For:
- Influencers growing their X presence
- Projects building communities
- Users earning passive income
- Web3 enthusiasts

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      XTasker Platform                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────┐         ┌──────────────────────────────┐ │
│  │   Frontend       │         │    Backend API               │ │
│  │  (Next.js 14)    │◄────────►│  (Express.js)               │ │
│  │                  │         │                              │ │
│  │ - Landing Page   │         │ - Auth Endpoints            │ │
│  │ - Dashboard      │         │ - Task Management           │ │
│  │ - Creator Panel  │         │ - Wallet & Transactions     │ │
│  │ - Admin Panel    │         │ - Admin APIs                │ │
│  │ - Wallet UI      │         │ - Blockchain Integration    │ │
│  │                  │         │                              │ │
│  └──────────────────┘         └──────────────────────────────┘ │
│         ↓                                    ↓                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         PostgreSQL Database (Prisma ORM)                │  │
│  │                                                           │  │
│  │  • Users & Roles        • Tasks & Submissions           │  │
│  │  • Transactions         • Withdrawals                   │  │
│  │  • Analytics            • Audit Logs                    │  │
│  └──────────────────────────────────────────────────────────┘  │
│         ↓                                                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │     Blockchain (Base Network / USDC)                    │  │
│  │     Smart Contract Interactions                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## ⚡ Quick Start

### Prerequisites
- **Node.js** 18+
- **PostgreSQL** 12+
- **Git**

### 1️⃣ Automated Setup (Recommended)

**macOS/Linux:**
```bash
git clone https://github.com/yourusername/XTasker.git
cd XTasker
chmod +x setup.sh
./setup.sh
```

**Windows:**
```powershell
git clone https://github.com/yourusername/XTasker.git
cd XTasker
powershell -ExecutionPolicy Bypass -File setup.ps1
```

### 2️⃣ Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# 🔗 API: http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# 🌐 App: http://localhost:3000
```

**Terminal 3 - Database (Optional):**
```bash
cd backend
npm run prisma:studio
# 📊 Studio: http://localhost:5555
```

### 3️⃣ Test the Platform

1. Visit http://localhost:3000
2. Create a **user account** (task completer)
3. Create a **creator account** (task creator)
4. Browse tasks and start earning!

---

## 📁 Project Structure

```
XTasker/
├── backend/
│   ├── src/
│   │   ├── controllers/        # Business logic
│   │   ├── middleware/         # Auth, validation
│   │   ├── routes/             # API endpoints
│   │   ├── utils/              # Helpers
│   │   └── index.ts            # Main server
│   ├── prisma/
│   │   └── schema.prisma       # Database schema
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx            # Landing page
│   │   ├── dashboard/          # User dashboard
│   │   ├── creator/            # Creator pages
│   │   └── admin/              # Admin panel
│   ├── components/
│   ├── lib/
│   │   ├── api.ts              # API client
│   │   └── store.ts            # State (Zustand)
│   ├── public/
│   └── tailwind.config.js
│
├── docs/
│   ├── README.md               # Full documentation
│   ├── API_DOCUMENTATION.md    # API reference
│   ├── DEPLOYMENT.md           # Deployment guide
│   └── GETTING_STARTED.md      # Getting started
│
├── setup.sh                    # Auto setup (Unix)
├── setup.ps1                   # Auto setup (Windows)
└── README.md                   # This file
```

---

## 🎮 Features

### 👥 For Users
- ✅ Browse available engagement tasks
- ✅ Complete tasks (FOLLOW, LIKE, REPOST, QUOTE, POST)
- ✅ Submit proof with screenshots/links
- ✅ Earn USDC rewards instantly
- ✅ Track submissions and earnings
- ✅ Manage wallet balance
- ✅ Withdraw to Base network wallet
- ✅ View transaction history

### 🏢 For Creators
- ✅ Create custom engagement tasks
- ✅ Set task types and rewards
- ✅ Manage budget and submissions
- ✅ Track active tasks
- ✅ Premium task options (2x-5x rewards)
- ✅ Real-time submission monitoring

### 🛡️ For Admins
- ✅ Review and approve/reject submissions
- ✅ Manage withdrawal requests
- ✅ Suspend suspicious users
- ✅ View platform analytics
- ✅ Monitor earnings and fees
- ✅ Audit user activities

---

## 💻 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14, React 18, Tailwind CSS |
| **Backend** | Node.js, Express.js, TypeScript |
| **Database** | PostgreSQL 12+, Prisma ORM |
| **Auth** | JWT, bcryptjs |
| **Blockchain** | ethers.js, Base Network (USDC) |
| **State** | Zustand |
| **Hosting** | Vercel (frontend), Railway (backend) |

---

## 🔐 Security Features

- 🔒 JWT authentication with expiration
- 🔒 Password hashing with bcryptjs
- 🔒 Input validation & sanitization
- 🔒 Admin-only endpoints
- 🔒 Role-based access control
- 🔒 Audit logging
- 🔒 Withdrawal verification
- 🔒 CORS protection

---

## 💰 Monetization

### Reward Structure
| Task | Reward |
|------|--------|
| Follow | $0.50 |
| Like | $0.25 |
| Repost | $1.00 |
| Quote | $2.00 |
| Post | $3.00 |

**Premium Multiplier:** 2x - 5x for verified accounts
**Platform Fee:** 15% (configurable)
**Min Withdrawal:** $1 USDC

---

## 🚀 Deployment

### Quick Deploy

**Frontend (Vercel):**
```bash
cd frontend
vercel --prod
```

**Backend (Railway):**
1. Connect GitHub repository
2. Add PostgreSQL add-on
3. Set environment variables
4. Deploy

See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for detailed instructions.

---

## 📚 Documentation

- **[Full README](./docs/README.md)** - Complete platform documentation
- **[API Documentation](./docs/API_DOCUMENTATION.md)** - All endpoints & examples
- **[Getting Started Guide](./docs/GETTING_STARTED.md)** - Development setup
- **[Deployment Guide](./docs/DEPLOYMENT.md)** - Production deployment

---

## 🤝 API Overview

### Authentication
```bash
POST   /api/auth/register              # Create account
POST   /api/auth/login                 # Login
GET    /api/auth/me                    # Get user profile
```

### Tasks
```bash
GET    /api/tasks/available            # Browse tasks
POST   /api/tasks                       # Create task (creator)
POST   /api/tasks/submit                # Submit task completion
GET    /api/tasks/my-submissions        # View submissions
```

### Wallet
```bash
GET    /api/wallet/balance             # Get balance
POST   /api/wallet/withdraw             # Request withdrawal
GET    /api/wallet/transactions         # View history
```

### Admin
```bash
GET    /api/admin/submissions/pending   # Review submissions
POST   /api/admin/submissions/approve   # Approve submission
GET    /api/admin/analytics             # View analytics
```

For complete API docs, see [API_DOCUMENTATION.md](./docs/API_DOCUMENTATION.md)

---

## 🐛 Troubleshooting

### Database Connection Failed
```bash
# Ensure PostgreSQL is running
psql -U postgres

# Check .env DATABASE_URL
# Format: postgresql://user:password@host:port/dbname
```

### Port Already in Use
```bash
# Kill process using port
lsof -i :5000  # Backend
lsof -i :3000  # Frontend
kill -9 <PID>
```

### Token Authentication Issues
```bash
# Clear browser storage
localStorage.clear()

# Regenerate JWT_SECRET
openssl rand -base64 32
```

See [GETTING_STARTED.md](./docs/GETTING_STARTED.md) for more troubleshooting.

---

## 📊 Database Schema

**13 Core Models:**
- Users (accounts, roles, wallets)
- Tasks (listings with types)
- TaskSubmissions (verification workflow)
- Transactions (earnings history)
- Withdrawals (USDC payments)
- PremiumRequests (verification)
- AuditLogs (admin actions)
- Analytics (statistics)

See `backend/prisma/schema.prisma` for full schema.

---

## 🚦 Development Workflow

### 1. Create Feature Branch
```bash
git checkout -b feature/new-feature
```

### 2. Make Changes
- Backend: `backend/src/`
- Frontend: `frontend/app/` or `frontend/components/`

### 3. Update Database (if needed)
```bash
cd backend
npm run prisma:migrate -- --name my_migration
```

### 4. Test & Commit
```bash
git add .
git commit -m "feat: add new feature"
```

### 5. Push & Create PR
```bash
git push origin feature/new-feature
```

---

## 🎯 Feature Roadmap

- [x] Core platform setup
- [x] User authentication
- [x] Task creation & submission
- [x] Wallet & withdrawals
- [x] Admin panel
- [ ] Referral system
- [ ] Leaderboards
- [ ] X verification API
- [ ] Email notifications
- [ ] Multi-language support
- [ ] Mobile app
- [ ] Advanced analytics

---

## 📝 Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/xtasker
JWT_SECRET=<32-character-secret>
PORT=5000
PLATFORM_FEE_PERCENTAGE=15
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_SECRET=<32-character-secret>
```

---

## 🔗 Blockchain Integration

**Network:** Base (Ethereum L2)
**Token:** USDC (0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913)
**Minimum Withdrawal:** $1 USDC
**Library:** ethers.js v6

---

## 📄 License

MIT License - Free to use for commercial projects

---

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Make changes
4. Submit pull request

---

## 💬 Support

- 📖 Read documentation
- 🐛 Check GitHub issues
- 💌 Email support team
- 💬 Join community Discord

---

## 🌟 Acknowledgments

Built with modern web technologies and best practices for:
- ⚡ Performance
- 🔐 Security
- 📈 Scalability
- 👥 User experience

---

## 📞 Contact

- **Email:** support@xtasker.com
- **Twitter:** [@XTasker](https://twitter.com/XTasker)
- **GitHub:** [github.com/yourusername/XTasker](https://github.com/yourusername/XTasker)

---

**Made with ❤️ using modern web technologies**

**[⬆ Back to top](#-xtasker---x-engagement-marketplace)**
