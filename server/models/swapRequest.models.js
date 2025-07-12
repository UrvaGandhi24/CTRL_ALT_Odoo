import mongoose from 'mongoose';

const swapRequestSchema = new mongoose.Schema({
    requester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    requested: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    skillOffered: {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            default: ''
        }
    },
    skillWanted: {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            default: ''
        }
    },
    message: {
        type: String,
        required: true,
        maxlength: 1000
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
        default: 'pending'
    },
    proposedDate: {
        type: Date
    },
    duration: {
        type: String,
        default: '1 hour'
    },
    // When the swap is completed
    completedAt: {
        type: Date
    },
    // Ratings after completion
    requesterRating: {
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        feedback: {
            type: String,
            maxlength: 500
        },
        ratedAt: {
            type: Date
        }
    },
    requestedRating: {
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        feedback: {
            type: String,
            maxlength: 500
        },
        ratedAt: {
            type: Date
        }
    },
    // Admin flags
    isReported: {
        type: Boolean,
        default: false
    },
    reportReason: {
        type: String,
        default: ''
    }
}, { timestamps: true });

// Index for better query performance
swapRequestSchema.index({ requester: 1, status: 1 });
swapRequestSchema.index({ requested: 1, status: 1 });
swapRequestSchema.index({ status: 1, createdAt: -1 });

const SwapRequest = mongoose.model('SwapRequest', swapRequestSchema);
export default SwapRequest;