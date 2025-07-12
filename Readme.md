# Odoo Hackathon 2025 - Skill Swap Platform

## 🚀 Problem Statement

In today's fast-paced world, people are often eager to learn new skills but may not have the financial resources or access to the right trainers. The **Skill Swap Platform** addresses this issue by creating a community-driven solution that enables users to **exchange skills** without monetary transactions. Users can **offer their own expertise** and **request to learn** from others in return, forming a peer-to-peer learning ecosystem.

---

## 👥 Team Details

**Team Name**: Ctrl+Alt+Odoo

| Role          | Name            | Phone      | Email                     |
| ------------- | --------------- | ---------- | ------------------------- |
| Team Leader   | Urva Gandhi     | 8866241204 | urvagandhi24@gmail.com    |
| Team Member 1 | Diya Gupta      | 9879472806 | gdiya2646@gmail.com       |
| Team Member 2 | Himanshu Mishra | 7043982802 | himanshubmishra@gmail.com |
| Team Member 3 | Harsh Khanna    | 9033175024 | harsh2004khanna@gmail.com |

---

## 🎯 Features

- **User Authentication**: Secure signup, login, and JWT-based authentication
- **Profile Management**: Create and update detailed user profiles with skills
- **Skill Matching**: Search and discover users with complementary skills  
- **Swap Requests**: Send and receive skill exchange requests
- **Real-time Dashboard**: Track your swaps, profile views, and recommendations
- **Admin Panel**: Administrative controls for user and content management
- **Responsive Design**: Mobile-friendly interface built with modern CSS

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite for fast development
- **React Router DOM** for client-side routing
- **Axios** for API communication
- **Custom CSS** for styling with modern design

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Multer** for file uploads
- **CORS** enabled for cross-origin requests

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB

### 1. Setup Backend
```bash
cd server
npm install
npm start
```

### 2. Setup Frontend
```bash
cd client
npm install
npm run dev
```

### 3. Environment Variables
Create `.env` file in `server/` directory:
```env
PORT=3334
CLIENT_URL=http://localhost:5173
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=10m
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=7d
```

### 4. Verify Installation
Run the status check script:
```powershell
.\check-status.ps1
```

## 🧪 Testing

### Automated API Testing
```powershell
.\test-api.ps1
```

### Test Credentials
- Email: `test@example.com`
- Password: `password123`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Request password reset
- `GET /api/auth/me` - Get current user (protected)

### Users
- `GET /api/users/profile` - Get user profile (protected)
- `PUT /api/users/profile` - Update user profile (protected)
- `GET /api/users/search` - Search users by skills (protected)
- `GET /api/users/swaps/sent` - Get sent swap requests (protected)
- `GET /api/users/swaps/received` - Get received swap requests (protected)

### Swap Requests
- `POST /api/swaps` - Create swap request (protected)
- `GET /api/swaps` - Get all swap requests (protected)
- `PUT /api/swaps/:id/respond` - Respond to swap request (protected)

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Protected Routes**: Client and server-side route protection
- **CORS Configuration**: Proper cross-origin resource sharing
- **Input Validation**: Request validation and sanitization

## 📊 Current Status

✅ Backend Server: Running on http://localhost:3334  
✅ Frontend Server: Running on http://localhost:5173  
✅ Database: Connected to MongoDB Atlas  
✅ Authentication: Fully functional  
✅ API Endpoints: All working  
✅ Frontend Routes: All accessible  

---

**Happy Skill Swapping! 🎓✨**
