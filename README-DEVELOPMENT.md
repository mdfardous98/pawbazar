# PawBazar Development Guide

## Quick Start

### Option 1: Use the Batch Script (Windows)

Simply double-click `start-dev.bat` to start both servers automatically.

### Option 2: Manual Start

1. **Start the Server (Backend)**:

   ```bash
   cd pawbazar-server
   npm run dev
   ```

2. **Start the Client (Frontend)** (in a new terminal):
   ```bash
   cd pawbazar-client
   npm run dev
   ```

## Application URLs

- **Client (Frontend)**: http://localhost:5174
- **Server (Backend API)**: http://localhost:5000
- **API Health Check**: http://localhost:5000/health

## Database

The application is connected to MongoDB Atlas with sample data already seeded.

## Authentication

The application uses Firebase authentication with a demo mode fallback for development. You can:

- Register with email/password
- Sign in with Google (demo mode)
- Use demo authentication when Firebase is not configured

## API Testing

You can test API endpoints using curl:

```bash
# Get recent listings
curl http://localhost:5000/api/listings/recent?limit=6

# Get all listings
curl http://localhost:5000/api/listings

# Test authenticated endpoint (favorites)
curl -H "Authorization: Bearer mock-token-demo" http://localhost:5000/api/favorites
```

## Troubleshooting

### "Failed to load listings" or "Connection Refused" errors

- Make sure both servers are running
- Check that the server is running on port 5000
- Check that the client is running on port 5174

### Server won't start

- Make sure MongoDB Atlas connection is working
- Check that all environment variables are set in `pawbazar-server/.env`

### Client won't start

- Make sure all dependencies are installed: `npm install`
- Check that the API URL is correct in `pawbazar-client/.env`

## Project Structure

```
pawbazar/
├── pawbazar-client/          # React frontend
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom hooks
│   │   ├── services/        # API services
│   │   └── utils/           # Utility functions
│   └── .env                 # Client environment variables
├── pawbazar-server/         # Node.js backend
│   ├── routes/              # API routes
│   ├── middleware/          # Express middleware
│   ├── config/              # Configuration files
│   └── .env                 # Server environment variables
└── start-dev.bat           # Development server starter script
```

## Available Features

- ✅ User authentication (Firebase + demo mode)
- ✅ Pet listings (CRUD operations)
- ✅ Favorites system
- ✅ User dashboard
- ✅ Messaging system
- ✅ Order management
- ✅ Admin panel
- ✅ Search and filtering
- ✅ Responsive design

## Git Commits

The project has 34+ meaningful commits demonstrating incremental development.

## Need Help?

If you encounter any issues:

1. Make sure both servers are running
2. Check the browser console for errors
3. Check the server terminal for error messages
4. Verify environment variables are set correctly
