import express from 'express';
import SwapRequest from '../models/swapRequest.models.js';
import User from '../models/user.models.js';
import { Authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Create a swap request
router.post('/', Authenticate, async (req, res) => {
    try {
        const {
            requestedUserId,
            skillOffered,
            skillWanted,
            message,
            proposedDate,
            duration
        } = req.body;

        // Validate required fields
        if (!requestedUserId || !skillOffered?.name || !skillWanted?.name || !message) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Check if requested user exists and is not banned
        const requestedUser = await User.findById(requestedUserId);
        if (!requestedUser || requestedUser.isBanned) {
            return res.status(404).json({ message: 'User not found or unavailable' });
        }

        // Check if user is trying to request themselves
        if (requestedUserId === req.user.id) {
            return res.status(400).json({ message: 'Cannot send swap request to yourself' });
        }

        // Check if there's already a pending request between these users for similar skills
        const existingRequest = await SwapRequest.findOne({
            requester: req.user.id,
            requested: requestedUserId,
            status: 'pending',
            'skillOffered.name': skillOffered.name,
            'skillWanted.name': skillWanted.name
        });

        if (existingRequest) {
            return res.status(400).json({ message: 'Similar swap request already pending' });
        }

        const swapRequest = new SwapRequest({
            requester: req.user.id,
            requested: requestedUserId,
            skillOffered,
            skillWanted,
            message,
            proposedDate: proposedDate ? new Date(proposedDate) : undefined,
            duration: duration || '1 hour'
        });

        await swapRequest.save();
        
        const populatedRequest = await SwapRequest.findById(swapRequest._id)
            .populate('requester', 'username fullName profilePhoto averageRating')
            .populate('requested', 'username fullName profilePhoto averageRating');

        res.status(201).json({ 
            message: 'Swap request sent successfully', 
            swapRequest: populatedRequest 
        });
    } catch (error) {
        console.error('Create swap request error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get swap request by ID
router.get('/:id', Authenticate, async (req, res) => {
    try {
        const swapRequest = await SwapRequest.findById(req.params.id)
            .populate('requester', 'username fullName profilePhoto averageRating')
            .populate('requested', 'username fullName profilePhoto averageRating');

        if (!swapRequest) {
            return res.status(404).json({ message: 'Swap request not found' });
        }

        // Check if user is involved in this swap
        if (swapRequest.requester._id.toString() !== req.user.id && 
            swapRequest.requested._id.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.json(swapRequest);
    } catch (error) {
        console.error('Get swap request error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update swap request status (accept/reject)
router.put('/:id/status', Authenticate, async (req, res) => {
    try {
        const { status } = req.body;
        
        if (!['accepted', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const swapRequest = await SwapRequest.findById(req.params.id);
        if (!swapRequest) {
            return res.status(404).json({ message: 'Swap request not found' });
        }

        // Only the requested user can accept/reject
        if (swapRequest.requested.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Only the requested user can change status' });
        }

        // Can only change status if currently pending
        if (swapRequest.status !== 'pending') {
            return res.status(400).json({ message: 'Can only accept/reject pending requests' });
        }

        swapRequest.status = status;
        await swapRequest.save();

        const populatedRequest = await SwapRequest.findById(swapRequest._id)
            .populate('requester', 'username fullName profilePhoto averageRating')
            .populate('requested', 'username fullName profilePhoto averageRating');

        res.json({ 
            message: `Swap request ${status} successfully`, 
            swapRequest: populatedRequest 
        });
    } catch (error) {
        console.error('Update swap status error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Cancel swap request
router.delete('/:id', Authenticate, async (req, res) => {
    try {
        const swapRequest = await SwapRequest.findById(req.params.id);
        if (!swapRequest) {
            return res.status(404).json({ message: 'Swap request not found' });
        }

        // Only the requester can cancel their own request
        if (swapRequest.requester.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Can only cancel your own requests' });
        }

        // Can only cancel pending or accepted requests
        if (!['pending', 'accepted'].includes(swapRequest.status)) {
            return res.status(400).json({ message: 'Cannot cancel this request' });
        }

        swapRequest.status = 'cancelled';
        await swapRequest.save();

        res.json({ message: 'Swap request cancelled successfully' });
    } catch (error) {
        console.error('Cancel swap request error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Mark swap as completed
router.put('/:id/complete', Authenticate, async (req, res) => {
    try {
        const swapRequest = await SwapRequest.findById(req.params.id);
        if (!swapRequest) {
            return res.status(404).json({ message: 'Swap request not found' });
        }

        // Both users can mark as completed
        if (swapRequest.requester.toString() !== req.user.id && 
            swapRequest.requested.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Can only complete accepted requests
        if (swapRequest.status !== 'accepted') {
            return res.status(400).json({ message: 'Can only complete accepted requests' });
        }

        swapRequest.status = 'completed';
        swapRequest.completedAt = new Date();
        await swapRequest.save();

        const populatedRequest = await SwapRequest.findById(swapRequest._id)
            .populate('requester', 'username fullName profilePhoto averageRating')
            .populate('requested', 'username fullName profilePhoto averageRating');

        res.json({ 
            message: 'Swap marked as completed', 
            swapRequest: populatedRequest 
        });
    } catch (error) {
        console.error('Complete swap error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Rate and provide feedback
router.put('/:id/rate', Authenticate, async (req, res) => {
    try {
        const { rating, feedback } = req.body;
        
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }

        const swapRequest = await SwapRequest.findById(req.params.id);
        if (!swapRequest) {
            return res.status(404).json({ message: 'Swap request not found' });
        }

        // Can only rate completed swaps
        if (swapRequest.status !== 'completed') {
            return res.status(400).json({ message: 'Can only rate completed swaps' });
        }

        const isRequester = swapRequest.requester.toString() === req.user.id;
        const isRequested = swapRequest.requested.toString() === req.user.id;

        if (!isRequester && !isRequested) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Update the appropriate rating
        if (isRequester) {
            if (swapRequest.requesterRating.rating) {
                return res.status(400).json({ message: 'You have already rated this swap' });
            }
            swapRequest.requesterRating = {
                rating,
                feedback: feedback || '',
                ratedAt: new Date()
            };
        } else {
            if (swapRequest.requestedRating.rating) {
                return res.status(400).json({ message: 'You have already rated this swap' });
            }
            swapRequest.requestedRating = {
                rating,
                feedback: feedback || '',
                ratedAt: new Date()
            };
        }

        await swapRequest.save();

        // Update the other user's average rating
        const otherUserId = isRequester ? swapRequest.requested : swapRequest.requester;
        const otherUser = await User.findById(otherUserId);
        
        if (otherUser) {
            otherUser.totalRating += rating;
            otherUser.ratingCount += 1;
            otherUser.updateAverageRating();
            await otherUser.save();
        }

        res.json({ message: 'Rating submitted successfully' });
    } catch (error) {
        console.error('Rate swap error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;