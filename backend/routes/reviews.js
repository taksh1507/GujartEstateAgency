const express = require('express');
const { db } = require('../config/firebase');
const { authenticateUser } = require('../middleware/auth');
const router = express.Router();

// Get all approved reviews (public)
router.get('/approved', async (req, res) => {
  try {
    const reviewsRef = db.collection('reviews');
    const approvedReviews = await reviewsRef
      .where('status', '==', 'approved')
      .orderBy('createdAt', 'desc')
      .get();

    const reviews = [];
    approvedReviews.forEach(doc => {
      reviews.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json({
      success: true,
      data: reviews
    });
  } catch (error) {
    console.error('Error fetching approved reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews'
    });
  }
});

// Get user's own reviews
router.get('/my-reviews', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const reviewsRef = db.collection('reviews');
    const userReviews = await reviewsRef
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    const reviews = [];
    userReviews.forEach(doc => {
      reviews.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json({
      success: true,
      data: reviews
    });
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch your reviews'
    });
  }
});

// Submit a new review
router.post('/submit', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const { rating, comment, propertyId } = req.body;

    // Validation
    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Rating and comment are required'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    if (comment.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Comment must be at least 10 characters long'
      });
    }

    // Get user details
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const userData = userDoc.data();

    // Create review data
    const reviewData = {
      userId,
      userName: `${userData.firstName} ${userData.lastName}`,
      userEmail: userData.email,
      rating: parseInt(rating),
      comment: comment.trim(),
      propertyId: propertyId || null,
      status: 'pending', // pending, approved, rejected
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save to Firestore
    const reviewRef = await db.collection('reviews').add(reviewData);

    console.log(`📝 New review submitted by ${userData.email} (ID: ${reviewRef.id})`);

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully !',
      data: {
        id: reviewRef.id,
        ...reviewData
      }
    });

  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit review'
    });
  }
});

// Update user's own review
router.put('/:reviewId', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const reviewId = req.params.reviewId;
    const { rating, comment } = req.body;

    // Get the review
    const reviewDoc = await db.collection('reviews').doc(reviewId).get();
    if (!reviewDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    const reviewData = reviewDoc.data();

    // Check if user owns this review
    if (reviewData.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only edit your own reviews'
      });
    }

    // Validation
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    if (comment && comment.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Comment must be at least 10 characters long'
      });
    }

    // Update data
    const updateData = {
      updatedAt: new Date().toISOString(),
      status: 'pending' // Reset to pending when edited
    };

    if (rating) updateData.rating = parseInt(rating);
    if (comment) updateData.comment = comment.trim();

    await db.collection('reviews').doc(reviewId).update(updateData);

    console.log(`📝 Review updated by user ${userId} (Review ID: ${reviewId})`);

    res.json({
      success: true,
      message: 'Review updated successfully! It will be reviewed by admin again.',
      data: {
        id: reviewId,
        ...reviewData,
        ...updateData
      }
    });

  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update review'
    });
  }
});

// Delete user's own review
router.delete('/:reviewId', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const reviewId = req.params.reviewId;

    // Get the review
    const reviewDoc = await db.collection('reviews').doc(reviewId).get();
    if (!reviewDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    const reviewData = reviewDoc.data();

    // Check if user owns this review
    if (reviewData.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own reviews'
      });
    }

    await db.collection('reviews').doc(reviewId).delete();

    console.log(`🗑️ Review deleted by user ${userId} (Review ID: ${reviewId})`);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete review'
    });
  }
});

module.exports = router;