# Quick Setup Guide

Follow these steps to get the application running:

## Step 1: Install MongoDB

**Option A: Local MongoDB**
- Download and install MongoDB from https://www.mongodb.com/try/download/community
- Start MongoDB service

**Option B: MongoDB Atlas (Cloud)**
- Sign up at https://www.mongodb.com/cloud/atlas
- Create a free cluster
- Get your connection string

## Step 2: Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file (copy from env.example.txt)
# Windows: copy env.example.txt .env
# Mac/Linux: cp env.example.txt .env

# Edit .env and set:
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/labour_verification
# FRONTEND_BASE_URL=http://localhost:3000
# (or your MongoDB Atlas connection string)

# Start backend server
npm start
```

Backend will run on: `http://localhost:5000`

## Step 3: Frontend Setup

Open a **new terminal**:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create .env file (copy from env.example.txt)
# Windows: copy env.example.txt .env
# Mac/Linux: cp env.example.txt .env

# Edit .env and set:
# REACT_APP_API_URL=http://localhost:5000/api

# Start frontend server
npm start
```

Frontend will run on: `http://localhost:3000`

## Step 4: Test the Application

1. Open browser: `http://localhost:3000`
2. Register a new labour
3. Download the QR code
4. **Test QR Code Scanning:**
   - Use your phone's camera app or any QR scanner
   - Scan the downloaded QR code
   - The verification page should automatically open in your browser
   - You'll see the beautiful labour details page
5. Test verification by clicking "Mark as Verified"

## Troubleshooting

**Backend won't start:**
- Check if MongoDB is running
- Verify .env file exists and has correct MONGODB_URI
- Ensure FRONTEND_BASE_URL is set (required for QR code generation)

**Frontend can't connect to backend:**
- Ensure backend is running on port 5000
- Check REACT_APP_API_URL in frontend .env

**Photo upload fails:**
- Backend will auto-create `uploads/` directory
- Check file size (max 5MB)
- Ensure file is an image

## Need Help?

Check the main README.md for detailed documentation.

