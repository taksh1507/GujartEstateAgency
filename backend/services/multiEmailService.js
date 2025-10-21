const nodemailer = require('nodemailer');

class MultiEmailService {
    constructor() {
        this.providers = this.initializeProviders();
        this.currentProviderIndex = 0;
    }

    initializeProviders() {
        const providers = [];

        // Gmail SMTP
        if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
            providers.push({
                name: 'Gmail',
                transporter: nodemailer.createTransport({
                    service: 'gmail',
                    host: 'smtp.gmail.com',
                    port: 587,
                    secure: false,
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASSWORD
                    },
                    tls: { rejectUnauthorized: false },
                    connectionTimeout: 150000,
                    greetingTimeout: 10000,
                    socketTimeout: 15000
                })
            });
        }

        // Outlook/Hotmail SMTP
        if (process.env.OUTLOOK_USER && process.env.OUTLOOK_PASSWORD) {
            providers.push({
                name: 'Outlook',
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
                    connectionTimeout: 15000,
                    greetingTimeout: 10000,
                    socketTimeout: 15000
                })
            });
        }

        // Yahoo SMTP
        if (process.env.YAHOO_USER && process.env.YAHOO_PASSWORD) {
            providers.push({
                name: 'Yahoo',
                transporter: nodemailer.createTransport({
                    service: 'yahoo',
                    host: 'smtp.mail.yahoo.com',
                    port: 587,
                    secure: false,
                    auth: {
                        user: process.env.YAHOO_USER,
                        pass: process.env.YAHOO_PASSWORD
                    },
                    tls: { rejectUnauthorized: false },
                    connectionTimeout: 15000,
                    greetingTimeout: 10000,
                    socketTimeout: 15000
                })
            });
        }

        // SendGrid SMTP
        if (process.env.SENDGRID_API_KEY) {
            providers.push({
                name: 'SendGrid',
                transporter: nodemailer.createTransport({
                    host: 'smtp.sendgrid.net',
                    port: 587,
                    secure: false,
                    auth: {
                        user: 'apikey',
                        pass: process.env.SENDGRID_API_KEY
                    },
                    connectionTimeout: 15000,
                    greetingTimeout: 10000,
                    socketTimeout: 15000
                })
            });
        }

        // Mailgun SMTP
        if (process.env.MAILGUN_USER && process.env.MAILGUN_PASSWORD) {
            providers.push({
                name: 'Mailgun',
                transporter: nodemailer.createTransport({
                    host: 'smtp.mailgun.org',
                    port: 587,
                    secure: false,
                    auth: {
                        user: process.env.MAILGUN_USER,
                        pass: process.env.MAILGUN_PASSWORD
                    },
                    connectionTimeout: 15000,
                    greetingTimeout: 10000,
                    socketTimeout: 15000
                })
            });
        }

        // Generic SMTP (for custom providers)
        if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
            providers.push({
                name: 'Custom SMTP',
                transporter: nodemailer.createTransport({
                    host: process.env.SMTP_HOST,
                    port: parseInt(process.env.SMTP_PORT) || 587,
                    secure: process.env.SMTP_SECURE === 'true',
                    auth: {
                        user: process.env.SMTP_USER,
                        pass: process.env.SMTP_PASSWORD
                    },
                    tls: { rejectUnauthorized: false },
                    connectionTimeout: 15000,
                    greetingTimeout: 10000,
                    socketTimeout: 15000
                })
            });
        }

        console.log(`📧 Initialized ${providers.length} email providers: ${providers.map(p => p.name).join(', ')}`);
        return providers;
    }

    async testProvider(provider) {
        try {
            await provider.transporter.verify();
            return true;
        } catch (error) {
            console.error(`❌ ${provider.name} connection failed:`, error.message);
            return false;
        }
    }

    async sendEmailWithFallback(mailOptions) {
        if (this.providers.length === 0) {
            throw new Error('No email providers configured');
        }

        // Try each provider in sequence
        for (let i = 0; i < this.providers.length; i++) {
            const provider = this.providers[i];
            
            try {
                console.log(`📤 Trying ${provider.name} email service...`);
                
                // Quick connection test (5 second timeout)
                const testPromise = this.testProvider(provider);
                const timeoutPromise = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Connection test timeout')), 5000)
                );
                
                const connectionOk = await Promise.race([testPromise, timeoutPromise]);
                
                if (!connectionOk) {
                    console.log(`⚠️ ${provider.name} connection test failed, trying next provider...`);
                    continue;
                }

                // Send email
                const info = await provider.transporter.sendMail(mailOptions);
                console.log(`✅ Email sent successfully via ${provider.name}`);
                console.log(`📧 Message ID: ${info.messageId}`);
                
                // Move successful provider to front for next time
                if (i > 0) {
                    this.providers.unshift(this.providers.splice(i, 1)[0]);
                }
                
                return { success: true, provider: provider.name, messageId: info.messageId };
                
            } catch (error) {
                console.error(`❌ ${provider.name} failed:`, error.message);
                
                // If this is the last provider, we'll fall through to the error handling
                if (i === this.providers.length - 1) {
                    throw new Error(`All email providers failed. Last error: ${error.message}`);
                }
                
                // Continue to next provider
                continue;
            }
        }
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

        return await this.sendEmailWithFallback(mailOptions);
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

        return await this.sendEmailWithFallback(mailOptions);
    }
}

module.exports = new MultiEmailService();