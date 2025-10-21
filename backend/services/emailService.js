const nodemailer = require('nodemailer');
const crypto = require('crypto');

class EmailService {
    constructor() {
        this.transporter = null;
        this.initializeTransporter();
    }

    initializeTransporter() {
        try {
            // Check if SMTP credentials are available
            if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
                console.warn('⚠️ SMTP credentials not found. Email service will be disabled.');
                this.transporter = null;
                return;
            }

            this.transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: parseInt(process.env.SMTP_PORT) || 587,
                secure: process.env.SMTP_SECURE === 'true',
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASSWORD
                },
                tls: {
                    rejectUnauthorized: false
                }
            });

            console.log('📧 Email service initialized');
        } catch (error) {
            console.error('❌ Email service initialization failed:', error.message);
            this.transporter = null;
        }
    }

    /**
     * Generate a 6-digit OTP
     */
    generateOTP() {
        return crypto.randomInt(100000, 999999).toString();
    }

    /**
     * Send password reset OTP
     */
    async sendPasswordResetOTP(email, otp, adminName = 'Admin') {
        if (!this.transporter) {
            console.log(`⚠️ Email service not available. OTP: ${otp}`);
            return false;
        }

        try {
            const mailOptions = {
                from: process.env.EMAIL_FROM,
                to: email,
                subject: '🔐 Password Reset OTP - Gujarat Real Estate',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                            <h1>🔐 Password Reset Request</h1>
                            <p>Gujarat Real Estate Admin Panel</p>
                        </div>
                        
                        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
                            <h2>Hello ${adminName},</h2>
                            
                            <p>We received a request to reset your password. Use the OTP code below:</p>
                            
                            <div style="background: #fff; border: 3px solid #007bff; border-radius: 10px; padding: 25px; margin: 25px 0; text-align: center;">
                                <h3>Your OTP Code:</h3>
                                <div style="font-family: 'Courier New', monospace; font-size: 32px; font-weight: bold; color: #007bff; letter-spacing: 8px; margin: 15px 0;">
                                    ${otp}
                                </div>
                                <p style="color: #666; font-size: 14px; margin-top: 15px;">
                                    This code will expire in <strong>10 minutes</strong>
                                </p>
                            </div>
                            
                            <p><strong>Request Time:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
                        </div>
                    </div>
                `
            };

            await this.transporter.sendMail(mailOptions);
            console.log(`✅ Password reset OTP sent to ${email}`);
            return true;

        } catch (error) {
            console.error(`❌ Failed to send OTP email to ${email}:`, error.message);
            console.log(`⚠️ Email failed. OTP: ${otp}`);
            return false;
        }
    }

    /**
     * Send email verification OTP
     */
    async sendEmailVerificationOTP(email, otp, userName = 'User') {
        if (!this.transporter) {
            console.log(`⚠️ Email service not available. OTP: ${otp}`);
            return false;
        }

        try {
            const mailOptions = {
                from: process.env.EMAIL_FROM,
                to: email,
                subject: '🔐 Verify Your Email - Gujarat Real Estate',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                            <h1>🎉 Welcome to Gujarat Real Estate!</h1>
                            <p>Verify your email to get started</p>
                        </div>
                        
                        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
                            <h2>Hello ${userName},</h2>
                            
                            <p>Thank you for signing up! Please verify your email address using the code below:</p>
                            
                            <div style="background: #fff; border: 3px solid #007bff; border-radius: 10px; padding: 25px; margin: 25px 0; text-align: center;">
                                <h3>Your Verification Code:</h3>
                                <div style="font-family: 'Courier New', monospace; font-size: 32px; font-weight: bold; color: #007bff; letter-spacing: 8px; margin: 15px 0;">
                                    ${otp}
                                </div>
                                <p style="color: #666; font-size: 14px; margin-top: 15px;">
                                    This code will expire in <strong>10 minutes</strong>
                                </p>
                            </div>
                            
                            <p><strong>Verification Time:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
                        </div>
                    </div>
                `
            };

            await this.transporter.sendMail(mailOptions);
            console.log(`✅ Email verification OTP sent to ${email}`);
            return true;

        } catch (error) {
            console.error(`❌ Failed to send verification email to ${email}:`, error.message);
            console.log(`⚠️ Email failed. OTP: ${otp}`);
            return false;
        }
    }

    /**
     * Send password change confirmation
     */
    async sendPasswordChangeConfirmation(email, adminName = 'Admin') {
        if (!this.transporter) {
            console.log('⚠️ Email service not available for confirmation');
            return false;
        }

        try {
            const mailOptions = {
                from: process.env.EMAIL_FROM,
                to: email,
                subject: '✅ Password Changed Successfully - Gujarat Real Estate',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                            <h1>✅ Password Changed Successfully</h1>
                            <p>Gujarat Real Estate Admin Panel</p>
                        </div>
                        
                        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
                            <h2>Hello ${adminName},</h2>
                            
                            <div style="background: #d4edda; border: 1px solid #c3e6cb; border-radius: 5px; padding: 20px; margin: 20px 0; text-align: center;">
                                <h3>🎉 Your password has been changed successfully!</h3>
                                <p>Your admin account is now secured with the new password.</p>
                            </div>
                            
                            <p><strong>Change Time:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
                        </div>
                    </div>
                `
            };

            await this.transporter.sendMail(mailOptions);
            console.log(`✅ Password change confirmation sent to ${email}`);
            return true;

        } catch (error) {
            console.error(`❌ Failed to send confirmation email to ${email}:`, error.message);
            return false;
        }
    }
}

module.exports = new EmailService();