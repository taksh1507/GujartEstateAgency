const nodemailer = require('nodemailer');

class PersistentEmailService {
    constructor() {
        this.providers = this.initializeProviders();
        this.maxRetries = 5;
        this.retryDelay = 100000; // 10 seconds between retries
    }

    initializeProviders() {
        const providers = [];

        // Extended timeout settings for maximum persistence
        const timeoutSettings = {
            connectionTimeout: 300000, // 5 minutes
            greetingTimeout: 180000,   // 3 minutes
            socketTimeout: 300000,     // 5 minutes
            pool: true,
            maxConnections: 1,
            maxMessages: 1
        };

        // Gmail SMTP with multiple configurations
        if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
            // Gmail TLS (Port 587)
            providers.push({
                name: 'Gmail-TLS',
                priority: 1,
                transporter: nodemailer.createTransport({
                    service: 'gmail',
                    host: 'smtp.gmail.com',
                    port: 587,
                    secure: false,
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASSWORD
                    },
                    tls: { 
                        rejectUnauthorized: false,
                        ciphers: 'SSLv3'
                    },
                    ...timeoutSettings
                })
            });

            // Gmail SSL (Port 465)
            providers.push({
                name: 'Gmail-SSL',
                priority: 2,
                transporter: nodemailer.createTransport({
                    service: 'gmail',
                    host: 'smtp.gmail.com',
                    port: 465,
                    secure: true,
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASSWORD
                    },
                    tls: { 
                        rejectUnauthorized: false
                    },
                    ...timeoutSettings
                })
            });

            // Gmail with direct host (no service)
            providers.push({
                name: 'Gmail-Direct',
                priority: 3,
                transporter: nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 587,
                    secure: false,
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASSWORD
                    },
                    tls: { 
                        rejectUnauthorized: false,
                        servername: 'smtp.gmail.com'
                    },
                    ...timeoutSettings
                })
            });
        }

        // Outlook/Hotmail SMTP
        if (process.env.OUTLOOK_USER && process.env.OUTLOOK_PASSWORD) {
            providers.push({
                name: 'Outlook',
                priority: 4,
                transporter: nodemailer.createTransport({
                    service: 'hotmail',
                    host: 'smtp-mail.outlook.com',
                    port: 587,
                    secure: false,
                    auth: {
                        user: process.env.OUTLOOK_USER,
                        pass: process.env.OUTLOOK_PASSWORD
                    },
                    tls: { rejectUnauthorized: false },
                    ...timeoutSettings
                })
            });
        }

        // SendGrid SMTP
        if (process.env.SENDGRID_API_KEY) {
            providers.push({
                name: 'SendGrid',
                priority: 5,
                transporter: nodemailer.createTransport({
                    host: 'smtp.sendgrid.net',
                    port: 587,
                    secure: false,
                    auth: {
                        user: 'apikey',
                        pass: process.env.SENDGRID_API_KEY
                    },
                    ...timeoutSettings
                })
            });
        }

        // Sort by priority
        providers.sort((a, b) => a.priority - b.priority);
        
        console.log(`📧 Initialized ${providers.length} email providers with extended timeouts`);
        return providers;
    }

    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async testProviderWithRetry(provider, maxAttempts = 3) {
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                console.log(`🔍 Testing ${provider.name} (attempt ${attempt}/${maxAttempts})...`);
                
                // Create a promise that will timeout after 60 seconds
                const testPromise = provider.transporter.verify();
                const timeoutPromise = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Verification timeout')), 60000)
                );
                
                await Promise.race([testPromise, timeoutPromise]);
                console.log(`✅ ${provider.name} connection successful on attempt ${attempt}`);
                return true;
                
            } catch (error) {
                console.log(`❌ ${provider.name} attempt ${attempt} failed: ${error.message}`);
                
                if (attempt < maxAttempts) {
                    console.log(`⏳ Waiting ${this.retryDelay/1000}s before retry...`);
                    await this.sleep(this.retryDelay);
                }
            }
        }
        return false;
    }

    async sendEmailWithPersistence(mailOptions) {
        if (this.providers.length === 0) {
            throw new Error('No email providers configured');
        }

        let lastError = null;

        // Try each provider with retries
        for (const provider of this.providers) {
            console.log(`📤 Attempting to send email via ${provider.name}...`);
            
            for (let retry = 1; retry <= this.maxRetries; retry++) {
                try {
                    console.log(`🔄 ${provider.name} - Attempt ${retry}/${this.maxRetries}`);
                    
                    // Test connection first
                    const connectionOk = await this.testProviderWithRetry(provider, 2);
                    if (!connectionOk) {
                        console.log(`⚠️ ${provider.name} connection failed, trying next provider...`);
                        break; // Move to next provider
                    }

                    // Send email with extended timeout
                    console.log(`📧 Sending email via ${provider.name}...`);
                    const sendPromise = provider.transporter.sendMail(mailOptions);
                    const timeoutPromise = new Promise((_, reject) => 
                        setTimeout(() => reject(new Error('Send timeout')), 120000) // 2 minutes
                    );
                    
                    const info = await Promise.race([sendPromise, timeoutPromise]);
                    
                    console.log(`✅ Email sent successfully via ${provider.name}!`);
                    console.log(`📧 Message ID: ${info.messageId}`);
                    
                    return { success: true, provider: provider.name, messageId: info.messageId };
                    
                } catch (error) {
                    lastError = error;
                    console.error(`❌ ${provider.name} attempt ${retry} failed: ${error.message}`);
                    
                    if (retry < this.maxRetries) {
                        const delay = this.retryDelay * retry; // Exponential backoff
                        console.log(`⏳ Waiting ${delay/1000}s before retry...`);
                        await this.sleep(delay);
                    }
                }
            }
            
            console.log(`❌ ${provider.name} failed after ${this.maxRetries} attempts, trying next provider...`);
        }

        // All providers failed
        throw new Error(`All email providers failed after multiple attempts. Last error: ${lastError?.message}`);
    }

    async sendPasswordResetOTP(email, otp, adminName = 'Admin') {
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
                </head>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0;">
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
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
                </body>
                </html>
            `
        };

        console.log(`🚀 Starting persistent email delivery to ${email}...`);
        return await this.sendEmailWithPersistence(mailOptions);
    }

    async sendEmailVerificationOTP(email, otp, userName = 'User') {
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
                </head>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0;">
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
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
                </body>
                </html>
            `
        };

        console.log(`🚀 Starting persistent email delivery to ${email}...`);
        return await this.sendEmailWithPersistence(mailOptions);
    }
}

module.exports = new PersistentEmailService();