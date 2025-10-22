const nodemailer = require('nodemailer');

class SimpleEmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  initializeTransporter() {
    try {
      console.log('🔍 Initializing simple email service...');
      
      if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
        console.warn('⚠️ SMTP credentials not found. Email service will be disabled.');
        return;
      }

      // Simple Gmail configuration that works with App Passwords
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD
        }
      });

      console.log('📧 Simple email service initialized');
    } catch (error) {
      console.error('❌ Email service initialization failed:', error.message);
      this.transporter = null;
    }
  }

  /**
   * Send email verification OTP (simplified)
   */
  async sendEmailVerificationOTP(email, otp, userName = 'User') {
    console.log(`🚀 Sending verification OTP to ${email}...`);

    if (!this.transporter) {
      console.log(`⚠️ Email service not available. OTP: ${otp}`);
      return false;
    }

    try {
      const mailOptions = {
        from: `"Gujarat Estate Agency" <${process.env.EMAIL_FROM}>`,
        to: email,
        subject: '🔐 Verify Your Email - Gujarat Estate Agency',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="margin: 0;">🎉 Welcome to Gujarat Estate Agency!</h1>
              <p style="margin: 10px 0 0 0;">Your trusted real estate partner in Mumbai</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #333;">Hello ${userName},</h2>
              
              <p style="color: #666;">Thank you for signing up! Please verify your email address using the code below:</p>
              
              <div style="background: #fff; border: 3px solid #3b82f6; border-radius: 10px; padding: 25px; margin: 25px 0; text-align: center;">
                <h3 style="color: #333;">Your Verification Code:</h3>
                <div style="font-family: 'Courier New', monospace; font-size: 32px; font-weight: bold; color: #3b82f6; letter-spacing: 8px; margin: 15px 0;">
                  ${otp}
                </div>
                <p style="color: #666; font-size: 14px;">This code will expire in <strong>10 minutes</strong></p>
              </div>
              
              <p style="color: #666; font-size: 14px;">If you didn't create an account, please ignore this email.</p>
              
              <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px;">
                Gujarat Estate Agency - Mumbai<br>
                Sent at: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
              </p>
            </div>
          </div>
        `,
        text: `
Welcome to Gujarat Estate Agency!

Hello ${userName},

Thank you for signing up! Please verify your email address using this verification code:

${otp}

This code will expire in 10 minutes.

If you didn't create an account with us, please ignore this email.

Gujarat Estate Agency - Mumbai
        `
      };

      // Send with a promise-based approach and timeout
      const result = await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Email send timeout'));
        }, 15000);

        this.transporter.sendMail(mailOptions, (error, info) => {
          clearTimeout(timeout);
          if (error) {
            reject(error);
          } else {
            resolve(info);
          }
        });
      });

      console.log(`✅ Email sent successfully to ${email}`);
      console.log('📬 Message ID:', result.messageId);
      return true;

    } catch (error) {
      console.error(`❌ Failed to send email to ${email}:`, error.message);
      console.log(`⚠️ Email failed but OTP is available: ${otp}`);
      return false;
    }
  }

  /**
   * Send password reset OTP
   */
  async sendPasswordResetOTP(email, otp, adminName = 'Admin') {
    console.log(`🚀 Sending password reset OTP to ${email}...`);

    if (!this.transporter) {
      console.log(`⚠️ Email service not available. OTP: ${otp}`);
      return false;
    }

    try {
      const mailOptions = {
        from: `"Gujarat Estate Agency" <${process.env.EMAIL_FROM}>`,
        to: email,
        subject: '🔐 Password Reset Code - Gujarat Estate Agency',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="margin: 0;">🔐 Password Reset Request</h1>
              <p style="margin: 10px 0 0 0;">Gujarat Estate Agency Admin Panel</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #333;">Hello ${adminName},</h2>
              
              <p style="color: #666;">We received a request to reset your password. Use the code below:</p>
              
              <div style="background: #fff; border: 3px solid #dc2626; border-radius: 10px; padding: 25px; margin: 25px 0; text-align: center;">
                <h3 style="color: #333;">Your Reset Code:</h3>
                <div style="font-family: 'Courier New', monospace; font-size: 32px; font-weight: bold; color: #dc2626; letter-spacing: 8px; margin: 15px 0;">
                  ${otp}
                </div>
                <p style="color: #666; font-size: 14px;">This code will expire in <strong>10 minutes</strong></p>
              </div>
              
              <p style="color: #666; font-size: 14px;">If you didn't request this, please ignore this email.</p>
              
              <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px;">
                Gujarat Estate Agency - Admin Panel<br>
                Sent at: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
              </p>
            </div>
          </div>
        `
      };

      const result = await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Email send timeout'));
        }, 15000);

        this.transporter.sendMail(mailOptions, (error, info) => {
          clearTimeout(timeout);
          if (error) {
            reject(error);
          } else {
            resolve(info);
          }
        });
      });

      console.log(`✅ Password reset email sent to ${email}`);
      return true;

    } catch (error) {
      console.error(`❌ Failed to send password reset email:`, error.message);
      console.log(`⚠️ Email failed but OTP is available: ${otp}`);
      return false;
    }
  }

  /**
   * Test email service
   */
  async testEmailService() {
    if (!this.transporter) {
      return false;
    }

    try {
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Connection timeout'));
        }, 10000);

        this.transporter.verify((error, success) => {
          clearTimeout(timeout);
          if (error) {
            reject(error);
          } else {
            resolve(success);
          }
        });
      });

      console.log('✅ Email service is working!');
      return true;
    } catch (error) {
      console.log('❌ Email service test failed:', error.message);
      return false;
    }
  }
}

module.exports = new SimpleEmailService();