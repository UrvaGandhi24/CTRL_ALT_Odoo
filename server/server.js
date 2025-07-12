import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from '../server/routes/auth.routes.js'
import userRoutes from '../server/routes/user.routes.js'
import swapRoutes from '../server/routes/swap.routes.js'
import adminRoutes from '../server/routes/admin.routes.js'

dotenv.config();

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors());

const MONGO_URI = process.env.MONGO_URI
mongoose.connect(MONGO_URI).then(() => { console.log("MongoDB Connected") }).catch(err => console.log(err))

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/swaps', swapRoutes);
app.use('/api/admin', adminRoutes);

// Health check

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT
app.listen(process.env.PORT, () => console.log(`Server running on port http://localhost:${PORT}`));