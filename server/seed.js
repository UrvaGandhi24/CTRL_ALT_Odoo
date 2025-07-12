import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/user.models.js';
import SwapRequest from './models/swapRequest.models.js';
import AdminMessage from './models/adminMessage.models.js';

dotenv.config();

const sampleUsers = [
    {
        username: 'admin',
        email: 'admin@skillswap.com',
        password: 'admin123',
        fullName: 'Admin User',
        role: 'admin',
        location: 'New York, NY',
        bio: 'System Administrator',
        skillsOffered: [
            { name: 'System Administration', description: 'Server management and user administration', level: 'Expert' },
            { name: 'User Management', description: 'Managing user accounts and permissions', level: 'Expert' }
        ],
        skillsWanted: [
            { name: 'Community Building', description: 'Building and managing online communities', priority: 'Low' }
        ],
        isProfilePublic: true
    },
    {
        username: 'john_dev',
        email: 'john@example.com',
        password: 'password123',
        fullName: 'John Developer',
        location: 'San Francisco, CA',
        bio: 'Full-stack developer with 5 years experience in React and Node.js',
        skillsOffered: [
            { name: 'JavaScript', description: 'Modern JavaScript development', level: 'Expert' },
            { name: 'React', description: 'React.js frontend development', level: 'Expert' },
            { name: 'Node.js', description: 'Backend development with Node.js', level: 'Advanced' },
            { name: 'MongoDB', description: 'NoSQL database management', level: 'Intermediate' }
        ],
        skillsWanted: [
            { name: 'Python', description: 'Python programming language', priority: 'High' },
            { name: 'Machine Learning', description: 'ML algorithms and techniques', priority: 'Medium' },
            { name: 'DevOps', description: 'DevOps practices and tools', priority: 'Low' }
        ],
        availability: {
            days: ['Monday', 'Wednesday', 'Friday'],
            timeSlots: ['Evening']
        },
        isProfilePublic: true
    },
    {
        username: 'sarah_designer',
        email: 'sarah@example.com',
        password: 'password123',
        fullName: 'Sarah Designer',
        location: 'Los Angeles, CA',
        bio: 'UI/UX designer passionate about creating beautiful user experiences',
        skillsOffered: [
            { name: 'UI Design', description: 'User interface design', level: 'Expert' },
            { name: 'UX Research', description: 'User experience research', level: 'Expert' },
            { name: 'Figma', description: 'Figma design tool', level: 'Expert' },
            { name: 'Adobe Creative Suite', description: 'Adobe design software', level: 'Advanced' }
        ],
        skillsWanted: [
            { name: 'Frontend Development', description: 'Frontend web development', priority: 'High' },
            { name: 'Animation', description: 'Web and motion animation', priority: 'Medium' },
            { name: 'Branding', description: 'Brand design and strategy', priority: 'Medium' }
        ],
        availability: {
            days: ['Tuesday', 'Thursday', 'Saturday'],
            timeSlots: ['Morning', 'Afternoon']
        },
        isProfilePublic: true
    },
    {
        username: 'mike_data',
        email: 'mike@example.com',
        password: 'password123',
        fullName: 'Mike Data Analyst',
        location: 'Seattle, WA',
        bio: 'Data scientist specializing in machine learning and analytics',
        skillsOffered: [
            { name: 'Python', description: 'Python programming language', level: 'Expert' },
            { name: 'Machine Learning', description: 'ML algorithms and models', level: 'Expert' },
            { name: 'Data Analysis', description: 'Data analysis and visualization', level: 'Expert' },
            { name: 'SQL', description: 'Database querying', level: 'Advanced' }
        ],
        skillsWanted: [
            { name: 'JavaScript', description: 'JavaScript programming', priority: 'High' },
            { name: 'Web Development', description: 'Full-stack web development', priority: 'High' },
            { name: 'Cloud Computing', description: 'Cloud platforms and services', priority: 'Medium' }
        ],
        availability: {
            days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            timeSlots: ['Evening']
        },
        isProfilePublic: true
    },
    {
        username: 'lisa_marketing',
        email: 'lisa@example.com',
        password: 'password123',
        fullName: 'Lisa Marketing Pro',
        location: 'Chicago, IL',
        bio: 'Digital marketing expert with focus on social media and content creation',
        skillsOffered: [
            { name: 'Digital Marketing', description: 'Digital marketing strategies', level: 'Expert' },
            { name: 'Social Media', description: 'Social media management', level: 'Expert' },
            { name: 'Content Writing', description: 'Content creation and copywriting', level: 'Advanced' },
            { name: 'SEO', description: 'Search engine optimization', level: 'Advanced' }
        ],
        skillsWanted: [
            { name: 'Graphic Design', description: 'Visual design and graphics', priority: 'High' },
            { name: 'Video Editing', description: 'Video production and editing', priority: 'Medium' },
            { name: 'Analytics', description: 'Data analytics and reporting', priority: 'Medium' }
        ],
        availability: {
            days: ['Wednesday', 'Thursday', 'Friday', 'Saturday'],
            timeSlots: ['Morning', 'Afternoon']
        },
        isProfilePublic: true
    }
];

const sampleMessages = [
    {
        title: 'Welcome to Skill Swap Platform!',
        message: 'Thank you for joining our community. Start by completing your profile and browsing available skills.',
        type: 'announcement',
        priority: 'high',
        isActive: true
    },
    {
        title: 'Platform Maintenance Scheduled',
        message: 'We will be performing maintenance on Sunday from 2-4 AM EST. The platform may be temporarily unavailable.',
        type: 'maintenance',
        priority: 'medium',
        isActive: true
    },
    {
        title: 'New Feature: Skill Recommendations',
        message: 'We\'ve added a new feature that suggests skills based on your profile and interests.',
        type: 'feature',
        priority: 'low',
        isActive: true
    }
];

async function seedDatabase() {
    try {
        // Connect to MongoDB
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        console.log('Clearing existing data...');
        await User.deleteMany({});
        await SwapRequest.deleteMany({});
        await AdminMessage.deleteMany({});

        // Create users
        console.log('Creating sample users...');
        const createdUsers = [];
        for (const userData of sampleUsers) {
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            const user = new User({
                ...userData,
                password: hashedPassword
            });
            const savedUser = await user.save();
            createdUsers.push(savedUser);
            console.log(`Created user: ${savedUser.fullName}`);
        }

        // Create sample swap requests
        console.log('Creating sample swap requests...');
        const swapRequests = [
            {
                requester: createdUsers[1]._id, // John
                requested: createdUsers[2]._id, // Sarah
                skillOffered: 'React Development',
                skillWanted: 'UI Design',
                message: 'Hi Sarah! I\'d love to learn UI design from you in exchange for React development lessons.',
                status: 'pending'
            },
            {
                requester: createdUsers[2]._id, // Sarah
                requested: createdUsers[3]._id, // Mike
                skillOffered: 'UX Research',
                skillWanted: 'Python',
                message: 'Would you be interested in trading UX research skills for Python programming?',
                status: 'accepted'
            },
            {
                requester: createdUsers[3]._id, // Mike
                requested: createdUsers[4]._id, // Lisa
                skillOffered: 'Data Analysis',
                skillWanted: 'Digital Marketing',
                message: 'I can help with data analysis if you can teach me digital marketing strategies.',
                status: 'completed',
                completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
                rating: 5,
                feedback: 'Excellent teacher and very knowledgeable!'
            }
        ];

        for (const swapData of swapRequests) {
            const swap = new SwapRequest(swapData);
            const savedSwap = await swap.save();
            console.log(`Created swap request: ${savedSwap.skillOffered} <-> ${savedSwap.skillWanted}`);
        }

        // Create admin messages
        console.log('Creating sample admin messages...');
        for (const messageData of sampleMessages) {
            const message = new AdminMessage({
                ...messageData,
                createdBy: createdUsers[0]._id // Admin user
            });
            const savedMessage = await message.save();
            console.log(`Created admin message: ${savedMessage.title}`);
        }

        console.log('✅ Database seeded successfully!');
        console.log('\nSample accounts created:');
        console.log('Admin: admin@skillswap.com / admin123');
        console.log('User 1: john@example.com / password123');
        console.log('User 2: sarah@example.com / password123');
        console.log('User 3: mike@example.com / password123');
        console.log('User 4: lisa@example.com / password123');
        
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();
