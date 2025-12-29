# Labour/Visitor Verification System

A full-stack application for registering labour/visitors, generating QR codes, and verifying their status through QR code scanning.

## Features

- ✅ Labour Registration with photo upload
- ✅ QR Code Generation with clickable URLs (contains verification URL with labourId - no personal data)
- ✅ QR Code Scanning & Automatic Browser Navigation
- ✅ Beautiful Verification Page with Labour Details
- ✅ Real-time Verification Status Updates
- ✅ Modern, Responsive UI

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Multer (file upload)
- QRCode (QR generation)

### Frontend
- React.js (Functional Components)
- Axios (API calls)
- React Router (Routing)

## Project Structure

```
atish_b__project/
├── backend/
│   ├── controllers/
│   │   └── labourController.js
│   ├── middleware/
│   │   └── upload.js
│   ├── models/
│   │   └── Labour.js
│   ├── routes/
│   │   └── labourRoutes.js
│   ├── uploads/          (created automatically)
│   ├── .env              (create from .env.example)
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── pages/
│   │   │   ├── RegistrationPage.js
│   │   │   └── VerificationPage.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── .env              (create from .env.example)
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
│
└── README.md
```

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas account)

## Setup Instructions

### 1. Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/labour_verification
NODE_ENV=development
FRONTEND_BASE_URL=http://localhost:3000
JWT_SECRET=your-secret-key-change-in-production
```

**Note:** 
- If using MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection string:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/labour_verification
```
- `FRONTEND_BASE_URL` is used to generate QR codes with clickable URLs. Update this if your frontend runs on a different URL or port.

4. Make sure MongoDB is running:
   - For local MongoDB: Start MongoDB service
   - For MongoDB Atlas: Ensure your cluster is active

5. Start the backend server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The backend server will run on `http://localhost:5000`

### 2. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

**Note:** If your backend is running on a different port or URL, update this accordingly.

4. Start the frontend development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000` and automatically open in your browser.

## API Endpoints

### POST `/api/labour/register`
Register a new labour and generate QR code.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body:
  - `name` (string, required)
  - `phone` (string, required)
  - `email` (string, optional)
  - `governmentId` (string, optional)
  - `photo` (file, optional)

**Response:**
```json
{
  "success": true,
  "message": "Labour registered successfully",
  "data": {
    "labourId": "507f1f77bcf86cd799439011",
    "qrCode": "data:image/png;base64,...",
    "labour": {
      "name": "John Doe",
      "phone": "1234567890",
      "email": "john@example.com",
      "photoUrl": "/uploads/labour-1234567890.jpg",
      "verificationStatus": "PENDING"
    }
  }
}
```

### GET `/api/labour/:labourId`
Get labour details by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "labourId": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "phone": "1234567890",
    "email": "john@example.com",
    "photoUrl": "/uploads/labour-1234567890.jpg",
    "governmentId": "ID123456",
    "verificationStatus": "PENDING",
    "verifiedAt": null,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### PUT `/api/labour/:labourId/verify`
Mark a labour as verified. **Admin only - requires JWT token.**

**Headers:**
- `Authorization: Bearer <admin_jwt_token>`

**Response:**
```json
{
  "success": true,
  "message": "Labour verified successfully",
  "data": {
    "labourId": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "phone": "1234567890",
    "verificationStatus": "VERIFIED",
    "verifiedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

**Error Responses:**
- `401 Unauthorized`: No token provided or invalid token
- `403 Forbidden`: Token valid but user is not admin

### POST `/api/auth/admin/login`
Admin login endpoint.

**Request:**
- Method: POST
- Body:
  - `email` (string, required)
  - `password` (string, required)

**Default Credentials:**
- Email: `test@gmail.com`
- Password: `Test@123`

**Response:**
```json
{
  "success": true,
  "message": "Admin login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "admin": {
      "email": "test@gmail.com",
      "role": "ADMIN"
    }
  }
}
```

### GET `/api/auth/admin/verify`
Verify admin token validity. **Protected - requires valid admin token.**

**Headers:**
- `Authorization: Bearer <admin_jwt_token>`

**Response:**
```json
{
  "success": true,
  "message": "Token is valid",
  "data": {
    "admin": {
      "email": "test@gmail.com",
      "role": "ADMIN"
    }
  }
}
```

## Usage

### 1. Register a Labour

1. Navigate to `http://localhost:3000/register`
2. Fill in the registration form:
   - Full Name (required)
   - Phone Number (required)
   - Email ID (optional)
   - Government ID Number (optional)
   - Photo (optional)
3. Click "Register Labour"
4. QR code will be generated and displayed
5. Click "Download QR Code" to save the QR code

### 2. Verify a Labour

**Option 1: Using QR Code**
1. Scan the QR code with any QR scanner app (camera app on most smartphones)
2. The QR code contains a full URL: `http://localhost:3000/verify/:labourId`
3. The scanner will automatically open the verification page in your browser
4. No manual navigation needed - seamless experience!

**Option 2: Direct URL**
1. Navigate to `http://localhost:3000/verify/:labourId`
2. Replace `:labourId` with the actual labour ID

**On the Verification Page:**
- View labour details (name, phone, email, photo, status)
- If status is "PENDING", click "Mark as Verified" to verify
- Status badge will show:
  - 🟢 Green for "VERIFIED"
  - 🟡 Yellow for "PENDING"

## MongoDB Schema

The Labour model includes:
- `name` (String, required)
- `phone` (String, required, indexed)
- `email` (String, optional)
- `photoUrl` (String)
- `governmentId` (String, optional)
- `verificationStatus` (Enum: 'PENDING' | 'VERIFIED', default: 'PENDING')
- `verifiedAt` (Date, null by default)
- `createdAt` (Date, auto-generated)

## Security Notes

- ✅ QR codes contain **only** the verification URL with labourId (no personal data)
- ✅ Personal information (name, phone, email) is never encoded in QR code
- ✅ Personal data is securely fetched from backend after scanning
- ✅ **Admin-only verification**: Only admins with valid JWT tokens can verify labour
- ✅ Backend enforces admin authentication - frontend hiding button is not enough
- ✅ JWT tokens expire after 24 hours for security
- ✅ Input validation on both frontend and backend
- ✅ File upload restrictions (image files only, 5MB max)
- ✅ Error handling for invalid requests

## Admin Authentication

**Security Implementation:**
- Admin login uses JWT (JSON Web Tokens) for authentication
- Verification endpoint (`PUT /api/labour/:labourId/verify`) is protected by admin middleware
- Backend validates JWT token and checks for `role === "ADMIN"` on every verification request
- Frontend conditionally shows verify button, but backend always enforces access control
- Even if someone modifies localStorage, backend will reject non-admin requests

**Default Admin Credentials:**
- Email: `test@gmail.com`
- Password: `Test@123`

**Note:** In production, replace hardcoded credentials with database lookup and use strong JWT secrets.

## QR Code Implementation

**Why URL-based QR codes?**
- **Automatic browser opening**: When scanned, QR codes with URLs automatically open in the browser
- **Better UX**: No need to manually copy-paste labourId or navigate manually
- **Universal compatibility**: Works with all QR scanner apps
- **Security**: Only labourId is in the URL path, no personal data is exposed
- **Configurable**: Frontend URL is set via `FRONTEND_BASE_URL` environment variable

## Troubleshooting

### Backend Issues

**MongoDB Connection Error:**
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env` file
- Verify MongoDB service is active

**Port Already in Use:**
- Change `PORT` in backend `.env` file
- Update `REACT_APP_API_URL` in frontend `.env` accordingly

**File Upload Errors:**
- Ensure `uploads/` directory exists (created automatically)
- Check file size (max 5MB)
- Verify file type (images only)

### Frontend Issues

**API Connection Error:**
- Verify backend server is running
- Check `REACT_APP_API_URL` in frontend `.env`
- Ensure CORS is enabled in backend

**Photo Not Displaying:**
- Check if photo was uploaded successfully
- Verify backend is serving static files from `/uploads`
- Check browser console for errors

## Development

### Backend Development
- Use `npm run dev` for auto-reload with nodemon
- Check console logs for errors
- API responses include error messages

### Frontend Development
- React app auto-reloads on file changes
- Check browser console for errors
- Network tab shows API requests/responses

## Production Build

### Frontend Build
```bash
cd frontend
npm run build
```

The build folder will contain optimized production files.

### Backend Production
- Set `NODE_ENV=production` in `.env`
- Use a process manager like PM2
- Configure proper MongoDB connection
- Set up proper file storage (consider cloud storage for photos)

## License

ISC

## Support

For issues or questions, please check:
1. MongoDB connection
2. Environment variables
3. Port availability
4. File permissions (uploads directory)

