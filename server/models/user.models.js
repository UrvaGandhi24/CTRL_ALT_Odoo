import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        lowercase: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    // Profile Information
    fullName: {
        type: String,
        required: true
    },
    location: {
        type: String,
        default: ''
    },
    profilePhoto: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        default: '',
        maxlength: 500
    },
    // Skills Information
    skillsOffered: [{
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            default: ''
        },
        level: {
            type: String,
            enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
            default: 'Intermediate'
        }
    }],
    skillsWanted: [{
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            default: ''
        },
        priority: {
            type: String,
            enum: ['Low', 'Medium', 'High'],
            default: 'Medium'
        }
    }],
    // Availability
    availability: {
        type: [String],
        enum: ['Weekdays Morning', 'Weekdays Afternoon', 'Weekdays Evening', 'Weekends Morning', 'Weekends Afternoon', 'Weekends Evening'],
        default: []
    },
    // Profile Settings
    isProfilePublic: {
        type: Boolean,
        default: true
    },
    // User Status
    isVerified: {
        type: Boolean,
        default: false,
    },
    isBanned: {
        type: Boolean,
        default: false
    },
    // Rating System
    totalRating: {
        type: Number,
        default: 0
    },
    ratingCount: {
        type: Number,
        default: 0
    },
    averageRating: {
        type: Number,
        default: 0
    },
    // Role
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date

}, { timestamps: true })

userSchema.pre("save", async function (next) {
    // only hash if it's new or modified
    if (!this.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next()
    } catch (error) {
        next(error)
    }
})

// Calculate average rating
userSchema.methods.updateAverageRating = function() {
    if (this.ratingCount > 0) {
        this.averageRating = this.totalRating / this.ratingCount;
    } else {
        this.averageRating = 0;
    }
};

const User = mongoose.model('User', userSchema)
export default User;