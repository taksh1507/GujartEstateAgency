const crypto = require('crypto');

class OTPService {
  constructor() {
    // In-memory storage for OTPs (in production, use Redis or database)
    this.otpStore = new Map();
    this.maxAttempts = 3;
    this.otpExpiry = 10 * 60 * 1000; // 10 minutes
    this.cleanupInterval = 5 * 60 * 1000; // 5 minutes
    
    // Start cleanup interval
    this.startCleanup();
  }

  /**
   * Generate a 6-digit OTP
   */
  generateOTP() {
    return crypto.randomInt(100000, 999999).toString();
  }

  /**
   * Store OTP for email with expiry and attempt tracking
   */
  storeOTP(email, otp, purpose = 'password_reset') {
    const key = `${email}:${purpose}`;
    const expiryTime = Date.now() + this.otpExpiry;
    
    this.otpStore.set(key, {
      otp,
      email,
      purpose,
      expiryTime,
      attempts: 0,
      createdAt: Date.now(),
      ipAddress: null // Can be set from request
    });

    console.log(`🔐 OTP stored for ${email} (${purpose}), expires at ${new Date(expiryTime).toLocaleString()}`);
    
    // Auto-cleanup after expiry
    setTimeout(() => {
      this.otpStore.delete(key);
      console.log(`🧹 Auto-cleaned expired OTP for ${email}`);
    }, this.otpExpiry);

    return {
      success: true,
      expiryTime,
      attemptsRemaining: this.maxAttempts
    };
  }

  /**
   * Verify OTP for email and purpose
   */
  verifyOTP(email, inputOTP, purpose = 'password_reset') {
    const key = `${email}:${purpose}`;
    const otpData = this.otpStore.get(key);

    if (!otpData) {
      console.log(`❌ OTP verification failed: No OTP found for ${email} (${purpose})`);
      return {
        success: false,
        error: 'OTP_NOT_FOUND',
        message: 'No OTP found. Please request a new one.'
      };
    }

    // Check if OTP has expired
    if (Date.now() > otpData.expiryTime) {
      this.otpStore.delete(key);
      console.log(`❌ OTP verification failed: Expired OTP for ${email}`);
      return {
        success: false,
        error: 'OTP_EXPIRED',
        message: 'OTP has expired. Please request a new one.'
      };
    }

    // Check if max attempts exceeded
    if (otpData.attempts >= this.maxAttempts) {
      this.otpStore.delete(key);
      console.log(`❌ OTP verification failed: Max attempts exceeded for ${email}`);
      return {
        success: false,
        error: 'MAX_ATTEMPTS_EXCEEDED',
        message: 'Maximum verification attempts exceeded. Please request a new OTP.'
      };
    }

    // Increment attempt count
    otpData.attempts++;

    // Verify OTP
    if (otpData.otp !== inputOTP.toString()) {
      console.log(`❌ OTP verification failed: Invalid OTP for ${email} (Attempt ${otpData.attempts}/${this.maxAttempts})`);
      return {
        success: false,
        error: 'INVALID_OTP',
        message: `Invalid OTP. ${this.maxAttempts - otpData.attempts} attempts remaining.`,
        attemptsRemaining: this.maxAttempts - otpData.attempts
      };
    }

    // OTP is valid - remove from store
    this.otpStore.delete(key);
    console.log(`✅ OTP verified successfully for ${email} (${purpose})`);

    return {
      success: true,
      message: 'OTP verified successfully',
      email: otpData.email,
      purpose: otpData.purpose
    };
  }

  /**
   * Check if OTP exists and get remaining time
   */
  getOTPStatus(email, purpose = 'password_reset') {
    const key = `${email}:${purpose}`;
    const otpData = this.otpStore.get(key);

    if (!otpData) {
      return {
        exists: false,
        message: 'No active OTP found'
      };
    }

    const remainingTime = otpData.expiryTime - Date.now();
    
    if (remainingTime <= 0) {
      this.otpStore.delete(key);
      return {
        exists: false,
        message: 'OTP has expired'
      };
    }

    return {
      exists: true,
      remainingTime: Math.ceil(remainingTime / 1000), // in seconds
      attemptsRemaining: this.maxAttempts - otpData.attempts,
      createdAt: otpData.createdAt
    };
  }

  /**
   * Invalidate OTP (useful for cleanup or security)
   */
  invalidateOTP(email, purpose = 'password_reset') {
    const key = `${email}:${purpose}`;
    const deleted = this.otpStore.delete(key);
    
    if (deleted) {
      console.log(`🗑️ OTP invalidated for ${email} (${purpose})`);
    }
    
    return deleted;
  }

  /**
   * Get all active OTPs (for admin monitoring)
   */
  getActiveOTPs() {
    const activeOTPs = [];
    const now = Date.now();

    for (const [key, otpData] of this.otpStore.entries()) {
      if (otpData.expiryTime > now) {
        activeOTPs.push({
          email: otpData.email,
          purpose: otpData.purpose,
          remainingTime: Math.ceil((otpData.expiryTime - now) / 1000),
          attempts: otpData.attempts,
          createdAt: new Date(otpData.createdAt).toISOString()
        });
      }
    }

    return activeOTPs;
  }

  /**
   * Cleanup expired OTPs
   */
  cleanup() {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [key, otpData] of this.otpStore.entries()) {
      if (otpData.expiryTime <= now) {
        this.otpStore.delete(key);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      console.log(`🧹 Cleaned up ${cleanedCount} expired OTPs`);
    }

    return cleanedCount;
  }

  /**
   * Start automatic cleanup of expired OTPs
   */
  startCleanup() {
    setInterval(() => {
      this.cleanup();
    }, this.cleanupInterval);

    console.log(`🧹 OTP cleanup service started (interval: ${this.cleanupInterval / 1000}s)`);
  }

  /**
   * Get service statistics
   */
  getStats() {
    const now = Date.now();
    let activeCount = 0;
    let expiredCount = 0;

    for (const [key, otpData] of this.otpStore.entries()) {
      if (otpData.expiryTime > now) {
        activeCount++;
      } else {
        expiredCount++;
      }
    }

    return {
      active: activeCount,
      expired: expiredCount,
      total: this.otpStore.size,
      maxAttempts: this.maxAttempts,
      expiryMinutes: this.otpExpiry / (60 * 1000)
    };
  }
}

module.exports = new OTPService();