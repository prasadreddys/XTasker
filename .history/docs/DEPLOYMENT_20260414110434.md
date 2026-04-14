# Deployment Guide

## Production Deployment Checklist

- [ ] Database configured and secured
- [ ] Environment variables set
- [ ] SSL/HTTPS enabled
- [ ] API rate limiting configured
- [ ] Email service configured
- [ ] Blockchain wallet funded
- [ ] Admin account created
- [ ] Monitoring and logging setup
- [ ] Backup strategy implemented
- [ ] CDN configured for frontend

---

## Frontend Deployment (Vercel)

### Prerequisites
- GitHub account with XTasker repository
- Vercel account

### Step 1: Connect GitHub

1. Go to [Vercel](https://vercel.com)
2. Click "New Project"
3. Select your XTasker repository
4. Select "frontend" as root directory

### Step 2: Configure Environment Variables

In Vercel Dashboard → Settings → Environment Variables:

```
NEXT_PUBLIC_API_URL=https://api.xtasker.com/api
NEXT_PUBLIC_APP_URL=https://xtasker.com
NEXTAUTH_SECRET=<generate-random-32-char-secret>
NEXTAUTH_URL=https://xtasker.com
```

### Step 3: Deploy

```bash
cd frontend
npm install -g vercel
vercel --prod
```

**Result**: Frontend available at `https://xtasker.vercel.app`

---

## Backend Deployment (Railway)

### Prerequisites
- Railway account
- PostgreSQL database
- GitHub repository connected

### Step 1: Create Railway Project

1. Go to [Railway](https://railway.app)
2. Click "+ New Project"
3. Select "Deploy from GitHub"
4. Connect your XTasker repository

### Step 2: Add PostgreSQL

1. In Railway Dashboard, click "Add"
2. Select "PostgreSQL"
3. Note the database URL

### Step 3: Configure Environment Variables

In Railway → Variables:

```
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://user:pass@host:port/xtasker
JWT_SECRET=<same-as-development>
FRONTEND_URL=https://xtasker.vercel.app
PLATFORM_FEE_PERCENTAGE=15
MIN_WITHDRAWAL_AMOUNT=1
USDC_CONTRACT_ADDRESS=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
BASE_RPC_URL=https://mainnet.base.org
VITE_PRIVATE_KEY=<production-wallet-key>
```

### Step 4: Set Build Command

In Railway → Deploy → Build Command:
```bash
npm install && npm run build
```

Start Command:
```bash
npm start
```

### Step 5: Deploy

Push to GitHub:
```bash
git push origin main
```

Railway automatically deploys on push.

**Result**: Backend available at `https://api.xtasker.railway.app`

---

## Database Setup (Production)

### Create Production Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE xtasker_prod;

# Create user
CREATE USER xtasker_prod WITH PASSWORD 'secure_password_123';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE xtasker_prod TO xtasker_prod;
```

### Run Migrations

```bash
cd backend
DATABASE_URL="postgresql://xtasker_prod:password@host:5432/xtasker_prod" npm run prisma:push
```

### Backup Strategy

Daily backups using pg_dump:

```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/var/backups/xtasker"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DB_HOST="your-db-host"
DB_NAME="xtasker_prod"
DB_USER="xtasker_prod"

pg_dump -h $DB_HOST -U $DB_USER $DB_NAME | gzip > $BACKUP_DIR/backup_$TIMESTAMP.sql.gz

# Keep only last 30 days of backups
find $BACKUP_DIR -mtime +30 -delete
```

Schedule with cron:
```bash
0 2 * * * /var/backups/backup.sh
```

---

## SSL/HTTPS Setup

### Using Let's Encrypt (Free)

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Generate certificate
sudo certbot certonly --standalone -d api.xtasker.com -d xtasker.com

# Auto-renewal
sudo certbot renew --dry-run
```

### Nginx Configuration

```nginx
server {
    listen 443 ssl http2;
    server_name api.xtasker.com;

    ssl_certificate /etc/letsencrypt/live/api.xtasker.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.xtasker.com/privkey.pem;

    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name api.xtasker.com;
    return 301 https://$server_name$request_uri;
}
```

---

## Monitoring & Logging

### Application Logging

```bash
# Using PM2 with logging
pm2 install pm2-logrotate
pm2 start backend/src/index.ts --name "xtasker-api" --log-date-format "YYYY-MM-DD HH:mm:ss Z"
```

### Error Tracking Integration

```bash
# Install Sentry
npm install @sentry/node

# In backend/src/index.ts
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### Performance Monitoring

```bash
# Using New Relic
npm install newrelic

# Add to backend/src/index.ts (first line)
require('newrelic');
```

---

## Security Hardening

### API Security Headers

```javascript
// In backend/src/index.ts
import helmet from 'helmet';

app.use(helmet());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
  },
}));
```

### Rate Limiting

```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later'
});

app.use('/api/', limiter);
```

### CORS Configuration

```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

---

## Docker Deployment

### Dockerfile (Backend)

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 5000
CMD ["npm", "start"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: xtasker
      POSTGRES_USER: xtasker
      POSTGRES_PASSWORD: secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    environment:
      DATABASE_URL: postgresql://xtasker:secure_password@db:5432/xtasker
      NODE_ENV: production
      JWT_SECRET: ${JWT_SECRET}
    ports:
      - "5000:5000"
    depends_on:
      - db

  frontend:
    build: ./frontend
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:5000/api
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  postgres_data:
```

Deploy with:
```bash
docker-compose up -d
```

---

## Performance Optimization

### Database Optimization

```sql
-- Index frequently queried fields
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_tasks_creator_id ON tasks(creator_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_submissions_task_id ON task_submissions(task_id);
CREATE INDEX idx_submissions_user_id ON task_submissions(user_id);
CREATE INDEX idx_submissions_status ON task_submissions(status);
```

### Caching Strategy

```javascript
// Redis caching
import redis from 'redis';

const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

// Cache task listings
app.get('/tasks/available', async (req, res) => {
  const cacheKey = `tasks:${JSON.stringify(req.query)}`;
  const cached = await client.get(cacheKey);
  
  if (cached) {
    return res.json(JSON.parse(cached));
  }
  
  // Fetch from DB
  const tasks = await fetchTasks(req.query);
  await client.setex(cacheKey, 300, JSON.stringify(tasks)); // 5 min cache
  res.json(tasks);
});
```

---

## Scaling Strategies

### Horizontal Scaling

```bash
# Load balancing with Nginx
upstream backend {
    server backend1.example.com;
    server backend2.example.com;
    server backend3.example.com;
}

server {
    listen 80;
    location / {
        proxy_pass http://backend;
    }
}
```

### Database Scaling

- **Read Replicas**: Add read-only replicas for queries
- **Sharding**: Partition data by user_id or task_id
- **Connection Pooling**: Use PgBouncer

---

## Troubleshooting Deployment

### Database Connection Issues

```bash
# Test connection
psql -h your-host -U xtasker_prod -d xtasker_prod

# Check Prisma connection
npm run prisma:studio
```

### API Not Responding

```bash
# Check logs
pm2 logs

# Test endpoint
curl https://api.xtasker.com/api/health
```

### Frontend Build Issues

```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

---

## Post-Deployment

1. **Test all endpoints** with Postman collection
2. **Create admin account** and test admin panel
3. **Set up monitoring** and alerts
4. **Configure backup** routine
5. **Document** production IPs and domains
6. **Train support team** on platform
7. **Create runbooks** for common issues

---

**Next Steps**: Monitor logs, gather user feedback, and plan feature updates.
