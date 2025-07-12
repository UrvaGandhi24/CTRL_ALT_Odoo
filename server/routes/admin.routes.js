import express from 'express';
import User from '../models/user.models.js';
import SwapRequest from '../models/swapRequest.models.js';
import AdminMessage from '../models/adminMessage.models.js';
import { Authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Middleware to check admin role
const requireAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get admin dashboard stats
router.get('/dashboard', Authenticate, requireAdmin, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'user' });
        const bannedUsers = await User.countDocuments({ isBanned: true });
        const totalSwaps = await SwapRequest.countDocuments();
        const pendingSwaps = await SwapRequest.countDocuments({ status: 'pending' });
        const completedSwaps = await SwapRequest.countDocuments({ status: 'completed' });
        const reportedSwaps = await SwapRequest.countDocuments({ isReported: true });

        const recentSwaps = await SwapRequest.find()
            .populate('requester', 'username fullName')
            .populate('requested', 'username fullName')
            .sort({ createdAt: -1 })
            .limit(10);

        res.json({
            stats: {
                totalUsers,
                bannedUsers,
                totalSwaps,
                pendingSwaps,
                completedSwaps,
                reportedSwaps
            },
            recentSwaps
        });
    } catch (error) {
        console.error('Admin dashboard error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all users with pagination
router.get('/users', Authenticate, requireAdmin, async (req, res) => {
    try {
        const { page = 1, limit = 20, search, status } = req.query;
        
        let query = { role: 'user' };
        
        if (search) {
            query.$or = [
                { username: { $regex: search, $options: 'i' } },
                { fullName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }
        
        if (status === 'banned') {
            query.isBanned = true;
        } else if (status === 'active') {
            query.isBanned = false;
        }

        const skip = (page - 1) * limit;
        const users = await User.find(query)
            .select('-password -resetPasswordToken -resetPasswordExpires')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const total = await User.countDocuments(query);

        res.json({
            users,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Admin get users error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Ban/Unban user
router.put('/users/:id/ban', Authenticate, requireAdmin, async (req, res) => {
    try {
        const { isBanned, reason } = req.body;
        
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role === 'admin') {
            return res.status(400).json({ message: 'Cannot ban admin users' });
        }

        user.isBanned = isBanned;
        
        // Cancel all pending swap requests if banning
        if (isBanned) {
            await SwapRequest.updateMany(
                { 
                    $or: [
                        { requester: user._id, status: 'pending' },
                        { requested: user._id, status: 'pending' }
                    ]
                },
                { status: 'cancelled' }
            );
        }

        await user.save();

        res.json({ 
            message: `User ${isBanned ? 'banned' : 'unbanned'} successfully`,
            user: await User.findById(user._id).select('-password -resetPasswordToken -resetPasswordExpires')
        });
    } catch (error) {
        console.error('Admin ban user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all swap requests
router.get('/swaps', Authenticate, requireAdmin, async (req, res) => {
    try {
        const { page = 1, limit = 20, status, reported } = req.query;
        
        let query = {};
        
        if (status) {
            query.status = status;
        }
        
        if (reported === 'true') {
            query.isReported = true;
        }

        const skip = (page - 1) * limit;
        const swaps = await SwapRequest.find(query)
            .populate('requester', 'username fullName email')
            .populate('requested', 'username fullName email')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const total = await SwapRequest.countDocuments(query);

        res.json({
            swaps,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Admin get swaps error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update skill descriptions (moderate content)
router.put('/users/:id/skills', Authenticate, requireAdmin, async (req, res) => {
    try {
        const { skillsOffered, skillsWanted } = req.body;
        
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (skillsOffered) {
            user.skillsOffered = skillsOffered;
        }
        
        if (skillsWanted) {
            user.skillsWanted = skillsWanted;
        }

        await user.save();

        res.json({ 
            message: 'User skills updated successfully',
            user: await User.findById(user._id).select('-password -resetPasswordToken -resetPasswordExpires')
        });
    } catch (error) {
        console.error('Admin update skills error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create platform-wide message
router.post('/messages', Authenticate, requireAdmin, async (req, res) => {
    try {
        const { title, message, type, priority, expiresAt } = req.body;
        
        if (!title || !message) {
            return res.status(400).json({ message: 'Title and message are required' });
        }

        const adminMessage = new AdminMessage({
            title,
            message,
            type: type || 'announcement',
            priority: priority || 'medium',
            expiresAt: expiresAt ? new Date(expiresAt) : undefined,
            sentBy: req.user.id
        });

        await adminMessage.save();

        res.status(201).json({ 
            message: 'Platform message created successfully',
            adminMessage
        });
    } catch (error) {
        console.error('Admin create message error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all platform messages
router.get('/messages', Authenticate, requireAdmin, async (req, res) => {
    try {
        const { page = 1, limit = 20, active } = req.query;
        
        let query = {};
        
        if (active === 'true') {
            query.isActive = true;
            query.$or = [
                { expiresAt: { $exists: false } },
                { expiresAt: { $gt: new Date() } }
            ];
        }

        const skip = (page - 1) * limit;
        const messages = await AdminMessage.find(query)
            .populate('sentBy', 'username fullName')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const total = await AdminMessage.countDocuments(query);

        res.json({
            messages,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Admin get messages error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update message status
router.put('/messages/:id', Authenticate, requireAdmin, async (req, res) => {
    try {
        const { isActive } = req.body;
        
        const message = await AdminMessage.findById(req.params.id);
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        message.isActive = isActive;
        await message.save();

        res.json({ 
            message: 'Message updated successfully',
            adminMessage: message
        });
    } catch (error) {
        console.error('Admin update message error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Generate reports
router.get('/reports', Authenticate, requireAdmin, async (req, res) => {
    try {
        const { type, startDate, endDate } = req.query;
        
        let dateFilter = {};
        if (startDate && endDate) {
            dateFilter.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        let report = {};

        if (type === 'users' || !type) {
            const userStats = await User.aggregate([
                { $match: { role: 'user', ...dateFilter } },
                {
                    $group: {
                        _id: null,
                        totalUsers: { $sum: 1 },
                        bannedUsers: { $sum: { $cond: ['$isBanned', 1, 0] } },
                        verifiedUsers: { $sum: { $cond: ['$isVerified', 1, 0] } },
                        avgRating: { $avg: '$averageRating' }
                    }
                }
            ]);
            report.userStats = userStats[0] || {};
        }

        if (type === 'swaps' || !type) {
            const swapStats = await SwapRequest.aggregate([
                { $match: dateFilter },
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 }
                    }
                }
            ]);
            report.swapStats = swapStats;
        }

        if (type === 'feedback' || !type) {
            const feedbackStats = await SwapRequest.aggregate([
                { 
                    $match: { 
                        status: 'completed',
                        ...dateFilter
                    }
                },
                {
                    $project: {
                        ratings: [
                            '$requesterRating.rating',
                            '$requestedRating.rating'
                        ]
                    }
                },
                { $unwind: '$ratings' },
                { $match: { ratings: { $exists: true } } },
                {
                    $group: {
                        _id: null,
                        avgRating: { $avg: '$ratings' },
                        totalRatings: { $sum: 1 }
                    }
                }
            ]);
            report.feedbackStats = feedbackStats[0] || {};
        }

        res.json(report);
    } catch (error) {
        console.error('Admin reports error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Download reports as CSV
router.get('/reports/:type', Authenticate, requireAdmin, async (req, res) => {
    try {
        const { type } = req.params;
        let csvData = '';
        const currentDate = new Date();
        const thirtyDaysAgo = new Date(currentDate.getTime() - (30 * 24 * 60 * 60 * 1000));

        switch (type) {
            case 'users':
                const users = await User.find({ 
                    role: 'user',
                    createdAt: { $gte: thirtyDaysAgo }
                }).select('fullName email username location skillsOffered skillsWanted isProfilePublic isBanned createdAt');
                
                csvData = 'Full Name,Email,Username,Location,Skills Offered,Skills Wanted,Profile Public,Banned,Registration Date\n';
                users.forEach(user => {
                    csvData += `"${user.fullName}","${user.email}","${user.username}","${user.location || ''}","${user.skillsOffered.map(s => s.name).join('; ')}","${user.skillsWanted.map(s => s.name).join('; ')}","${user.isProfilePublic}","${user.isBanned}","${user.createdAt.toISOString().split('T')[0]}"\n`;
                });
                break;

            case 'swaps':
                const swaps = await SwapRequest.find({
                    createdAt: { $gte: thirtyDaysAgo }
                }).populate('requester', 'fullName email').populate('requested', 'fullName email');
                
                csvData = 'Requester Name,Requester Email,Requested Name,Requested Email,Skill Offered,Skill Wanted,Status,Created Date,Completed Date,Rating\n';
                swaps.forEach(swap => {
                    csvData += `"${swap.requester?.fullName || 'N/A'}","${swap.requester?.email || 'N/A'}","${swap.requested?.fullName || 'N/A'}","${swap.requested?.email || 'N/A'}","${swap.skillOffered}","${swap.skillWanted}","${swap.status}","${swap.createdAt.toISOString().split('T')[0]}","${swap.completedAt ? swap.completedAt.toISOString().split('T')[0] : 'N/A'}","${swap.rating || 'N/A'}"\n`;
                });
                break;

            case 'activity':
                const totalUsers = await User.countDocuments({ role: 'user' });
                const activeUsers = await User.countDocuments({ 
                    role: 'user',
                    lastActive: { $gte: thirtyDaysAgo }
                });
                const totalSwaps = await SwapRequest.countDocuments({ 
                    createdAt: { $gte: thirtyDaysAgo }
                });
                const completedSwaps = await SwapRequest.countDocuments({ 
                    status: 'completed',
                    createdAt: { $gte: thirtyDaysAgo }
                });
                
                csvData = 'Metric,Value,Period\n';
                csvData += `"Total Users","${totalUsers}","All Time"\n`;
                csvData += `"Active Users (30 days)","${activeUsers}","Last 30 Days"\n`;
                csvData += `"Total Swaps (30 days)","${totalSwaps}","Last 30 Days"\n`;
                csvData += `"Completed Swaps (30 days)","${completedSwaps}","Last 30 Days"\n`;
                csvData += `"Completion Rate","${totalSwaps > 0 ? ((completedSwaps / totalSwaps) * 100).toFixed(2) + '%' : '0%'}","Last 30 Days"\n`;
                break;

            case 'admin':
                const adminMessages = await AdminMessage.find({
                    createdAt: { $gte: thirtyDaysAgo }
                }).populate('createdBy', 'fullName email');
                const bannedUsers = await User.find({ 
                    isBanned: true,
                    updatedAt: { $gte: thirtyDaysAgo }
                }).select('fullName email username');
                
                csvData = 'Action Type,Subject,Details,Admin,Date\n';
                adminMessages.forEach(message => {
                    csvData += `"Platform Message","${message.title}","${message.message}","${message.createdBy?.fullName || 'System'}","${message.createdAt.toISOString().split('T')[0]}"\n`;
                });
                bannedUsers.forEach(user => {
                    csvData += `"User Banned","${user.fullName}","Username: ${user.username}, Email: ${user.email}","Admin","${user.updatedAt.toISOString().split('T')[0]}"\n`;
                });
                break;

            default:
                return res.status(400).json({ message: 'Invalid report type' });
        }

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${type}_report_${currentDate.toISOString().split('T')[0]}.csv"`);
        res.send(csvData);
    } catch (error) {
        console.error('CSV report generation error:', error);
        res.status(500).json({ message: 'Server error generating report' });
    }
});

export default router;
