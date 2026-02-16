# 🌾 KrishiConnect

Production-grade social platform for Indian farmers - LinkedIn meets Twitter for agriculture.

## Project Structure

```
farmerconnect/
├── krishiconnect-backend/   # Node.js + Express API
└── krishiconnect-web/       # React PWA frontend
```

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB 7+
- Redis 7+ (optional)

### Backend

```bash
cd krishiconnect-backend
npm install
cp .env.example .env
# Edit .env with MongoDB, Redis, JWT secrets, etc.
npm run dev
```

API runs at http://localhost:5000

### Frontend

```bash
cd krishiconnect-web
npm install
cp .env.example .env
npm run dev
```

Web runs at http://localhost:3000

## Features Implemented

### Backend
- **Auth**: Phone OTP registration, login, JWT refresh
- **Users**: Profile, follow/unfollow, search, avatar upload
- **Posts**: CRUD, likes, comments, feed (following/latest/trending)
- **Chat**: Conversations, messages, Socket.IO real-time
- **Q&A**: Questions, answers, categories
- **Notifications**: List, mark read, unread count
- **Market**: Mandi prices (Agmarknet integration ready)
- **Weather**: Current weather (OpenWeather integration ready)

### Frontend
- Home, Login, Register (OTP flow)
- Feed with post creation and likes
- Profile pages
- Chat conversation list
- Q&A browse
- Market prices table
- Weather display

## API Documentation

See `krishiconnect-backend/README.md` for full API reference.

## Environment Variables

- **Backend**: See `krishiconnect-backend/.env.example`
- **Frontend**: `VITE_API_URL`, `VITE_SOCKET_URL`

## Next Steps

1. Configure Twilio for OTP
2. Configure Cloudinary for media
3. Add Agmarknet API for live market data
4. Add OpenWeather API for weather
5. Add Firebase for push notifications
6. Deploy with Docker (see spec for docker-compose)
