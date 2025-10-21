const nodemailer = require('nodemailer');
const crypto = require('crypto');

class EmailService {
    constructor() {
        this.transporter = null;
        this.initializeTransporter();
    }

    initializeTransporter() {
        try {
            this.transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD
                },
                tls: {
                    rejectUnauthorized: false
                },
                debug: true,
                logger: true
            });
            console.log('📧 Email service initialized with SMTP configuration');
            console.log('📧 Email user:', process.env.EMAIL_USER);
            console.log('📧 Email password length:', process.env.EMAIL_PASSWORD ? process.env.EMAIL_PASSWORD.length : 'undefined');
        } catch (error) {
            console.error('❌ Email service initialization failed:', error.message);
        }
    }

    /**
     * Generate a 6-digit OTP
     */
    generateOTP() {
        return crypto.randomInt(100000, 999999).toString();
    }

    /**
     * Send OTP email for password reset
     */
    async sendPasswordResetOTP(email, otp, adminName = 'Admin') {
        try {
            if (!this.transporter) {
                throw new Error('Email service not initialized');
            }

            const mailOptions = {
                from: process.env.EMAIL_FROM || 'noreply@gujaratestate.com',
                to: email,
                subject: '🔐 Password Reset OTP - Gujarat Real Estate',
                html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reset OTP</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
              .otp-box { background: #fff; border: 3px solid #007bff; border-radius: 10px; padding: 25px; margin: 25px 0; text-align: center; }
              .otp-code { font-family: 'Courier New', monospace; font-size: 32px; font-weight: bold; color: #007bff; letter-spacing: 8px; margin: 15px 0; }
              .warning { background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; padding: 15px; margin: 20px 0; }
              .footer { text-align: center; margin-top: 30px; color: #6c757d; font-size: 14px; }
              .btn { display: inline-block; background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
              .security-tips { background: #e7f3ff; border-left: 4px solid #007bff; padding: 15px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🔐 Password Reset Request</h1>
                <p>Gujarat Real Estate Admin Panel</p>
              </div>
              
              <div class="content">
                <h2>Hello ${adminName},</h2>
                
                <p>We received a request to reset your password for the Gujarat Real Estate admin panel. To proceed with the password reset, please use the OTP code below:</p>
                
                <div class="otp-box">
                  <h3>Your OTP Code:</h3>
                  <div class="otp-code">${otp}</div>
                  <p style="color: #666; font-size: 14px; margin-top: 15px;">
                    This code will expire in <strong>10 minutes</strong>
                  </p>
                </div>
                
                <div class="security-tips">
                  <h4>🛡️ Security Tips:</h4>
                  <ul>
                    <li>Never share this OTP with anyone</li>
                    <li>Our team will never ask for your OTP</li>
                    <li>If you didn't request this reset, please ignore this email</li>
                    <li>The OTP is valid for 10 minutes only</li>
                  </ul>
                </div>
                
                <div class="warning">
                  <strong>⚠️ Important:</strong>
                  <p>If you did not request a password reset, please contact our support team immediately at support@gujaratestate.com</p>
                </div>
                
                <p><strong>Request Time:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
                <p><strong>IP Address:</strong> [Request IP will be logged for security]</p>
              </div>
              
              <div class="footer">
                <p>This is an automated security notification from Gujarat Real Estate Platform.</p>
                <p>For support, contact us at support@gujaratestate.com</p>
                <p>&copy; 2025 Gujarat Real Estate. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `
            };

            await this.transporter.sendMail(mailOptions);
            console.log(`✅ Password reset OTP sent to ${email}`);
            return true;

        } catch (error) {
            console.error(`❌ Failed to send OTP email to ${email}:`, error);
            throw new Error(`Failed to send OTP email: ${error.message}`);
        }
    }

    /**
     * Send email verification OTP
     */
    async sendEmailVerificationOTP(email, otp, userName = 'User') {
        try {
            if (!this.transporter) {
                throw new Error('Email service not initialized');
            }

            const mailOptions = {
                from: process.env.EMAIL_FROM || 'noreply@gujaratestate.com',
                to: email,
                subject: '🔐 Verify Your Email - Gujarat Real Estate',
                html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email Verification</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
              .otp-box { background: #fff; border: 3px solid #007bff; border-radius: 10px; padding: 25px; margin: 25px 0; text-align: center; }
              .otp-code { font-family: 'Courier New', monospace; font-size: 32px; font-weight: bold; color: #007bff; letter-spacing: 8px; margin: 15px 0; }
              .warning { background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; padding: 15px; margin: 20px 0; }
              .footer { text-align: center; margin-top: 30px; color: #6c757d; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎉 Welcome to Gujarat Real Estate!</h1>
                <p>Verify your email to get started</p>
              </div>
              
              <div class="content">
                <h2>Hello ${userName},</h2>
                
                <p>Thank you for signing up with Gujarat Real Estate! To complete your registration and start exploring properties, please verify your email address using the code below:</p>
                
                <div class="otp-box">
                  <h3>Your Verification Code:</h3>
                  <div class="otp-code">${otp}</div>
                  <p style="color: #666; font-size: 14px; margin-top: 15px;">
                    This code will expire in <strong>10 minutes</strong>
                  </p>
                </div>
                
                <div style="background: #e7f3ff; border-left: 4px solid #007bff; padding: 15px; margin: 20px 0;">
                  <h4>🔒 Security Tips:</h4>
                  <ul>
                    <li>Never share this verification code with anyone</li>
                    <li>Our team will never ask for your verification code</li>
                    <li>If you didn't create this account, please ignore this email</li>
                    <li>The code is valid for 10 minutes only</li>
                  </ul>
                </div>
                
                <div class="warning">
                  <strong>⚠️ Important:</strong>
                  <p>If you did not sign up for Gujarat Real Estate, please ignore this email or contact our support team at support@gujaratestate.com</p>
                </div>
                
                <p><strong>Verification Time:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
              </div>
              
              <div class="footer">
                <p>This is an automated email from Gujarat Real Estate Platform.</p>
                <p>For support, contact us at support@gujaratestate.com</p>
                <p>&copy; 2025 Gujarat Real Estate. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `
            };

            await this.transporter.sendMail(mailOptions);
            console.log(`✅ Email verification OTP sent to ${email}`);
            return true;

        } catch (error) {
            console.error(`❌ Failed to send verification email to ${email}:`, error);
            throw new Error(`Failed to send verification email: ${error.message}`);
        }
    }

    /**
     * Send password change confirmation email
     */
    async sendPasswordChangeConfirmation(email, adminName = 'Admin') {
        try {
            if (!this.transporter) {
                throw new Error('Email service not initialized');
            }

            const mailOptions = {
                from: process.env.EMAIL_FROM || 'noreply@gujaratestate.com',
                to: email,
                subject: '✅ Password Changed Successfully - Gujarat Real Estate',
                html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Changed</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
              .success-box { background: #d4edda; border: 1px solid #c3e6cb; border-radius: 5px; padding: 20px; margin: 20px 0; text-align: center; }
              .footer { text-align: center; margin-top: 30px; color: #6c757d; font-size: 14px; }
              .btn { display: inline-block; background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>✅ Password Changed Successfully</h1>
                <p>Gujarat Real Estate Admin Panel</p>
              </div>
              
              <div class="content">
                <h2>Hello ${adminName},</h2>
                
                <div class="success-box">
                  <h3>🎉 Your password has been changed successfully!</h3>
                  <p>Your admin account is now secured with the new password.</p>
                </div>
                
                <p>Your password for the Gujarat Real Estate admin panel has been successfully updated.</p>
                
                <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; padding: 15px; margin: 20px 0;">
                  <strong>⚠️ Security Notice:</strong>
                  <p>If you did not make this change, please contact our support team immediately at support@gujaratestate.com</p>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${process.env.ADMIN_URL || 'http://localhost:3001'}" class="btn">
                    Login to Admin Panel
                  </a>
                </div>
                
                <p><strong>Change Time:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
              </div>
              
              <div class="footer">
                <p>This is an automated security notification from Gujarat Real Estate Platform.</p>
                <p>For support, contact us at support@gujaratestate.com</p>
                <p>&copy; 2025 Gujarat Real Estate. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `
            };

            await this.transporter.sendMail(mailOptions);
            console.log(`✅ Password change confirmation sent to ${email}`);
            return true;

        } catch (error) {
            console.error(`❌ Failed to send confirmation email to ${email}:`, error);
            throw new Error(`Failed to send confirmation email: ${error.message}`);
        }
    }
}

module.exports = new EmailService();