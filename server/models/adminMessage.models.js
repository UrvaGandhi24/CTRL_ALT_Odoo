import mongoose from 'mongoose';

const adminMessageSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxlength: 200
    },
    message: {
        type: String,
        required: true,
        maxlength: 2000
    },
    type: {
        type: String,
        enum: ['announcement', 'maintenance', 'feature_update', 'warning'],
        default: 'announcement'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    expiresAt: {
        type: Date
    },
    readBy: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        readAt: {
            type: Date,
            default: Date.now
        }
    }],
    sentBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

// Index for better performance
adminMessageSchema.index({ isActive: 1, createdAt: -1 });
adminMessageSchema.index({ expiresAt: 1 });

const AdminMessage = mongoose.model('AdminMessage', adminMessageSchema);
export default AdminMessage;