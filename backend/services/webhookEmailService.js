const https = require('https');

class WebhookEmailService {
    constructor() {
        this.webhookUrl = process.env.EMAIL_WEBHOOK_URL;
        this.apiKey = process.env.EMAIL_WEBHOOK_API_KEY;
    }

    /**
     * Send email via webhook (fallback when SMTP fails)
     */
    async sendEmailViaWebhook(to, subject, htmlContent) {
        if (!this.webhookUrl) {
            return false;
        }

        return new Promise((resolve) => {
            const postData = JSON.stringify({
                to,
                subject,
                html: htmlContent,
                from: process.env.EMAIL_FROM || 'noreply@gujaratestate.com'
            });

            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(postData),
                    ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` })
                },
                timeout: 10000
            };

            const req = https.request(this.webhookUrl, options, (res) => {
                let data = '';
                res.on('data', (chunk) => data += chunk);
                res.on('end', () => {
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        console.log('✅ Email sent via webhook');
                        resolve(true);
                    } else {
                        console.error('❌ Webhook email failed:', res.statusCode, data);
                        resolve(false);
                    }
                });
            });

            req.on('error', (error) => {
                console.error('❌ Webhook request failed:', error.message);
                resolve(false);
            });

            req.on('timeout', () => {
                console.error('❌ Webhook request timeout');
                req.destroy();
                resolve(false);
            });

            req.write(postData);
            req.end();
        });
    }

    /**
     * Send password reset OTP via webhook
     */
    async sendPasswordResetOTP(email, otp, adminName = 'Admin') {
        const subject = '🔐 Password Reset OTP - Gujarat Real Estate';
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
                    <h1>🔐 Password Reset Request</h1>
                    <p>Gujarat Real Estate Admin Panel</p>
                </div>
                <div style="padding: 30px; background: #f8f9fa;">
                    <h2>Hello ${adminName},</h2>
                    <p>Your password reset OTP code is:</p>
                    <div style="background: #fff; border: 3px solid #007bff; border-radius: 10px; padding: 25px; margin: 25px 0; text-align: center;">
                        <div style="font-family: 'Courier New', monospace; font-size: 32px; font-weight: bold; color: #007bff; letter-spacing: 8px;">
                            ${otp}
                        </div>
                        <p style="color: #666; margin-top: 15px;">This code expires in 10 minutes</p>
                    </div>
                    <p><strong>Time:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
                </div>
            </div>
        `;

        return await this.sendEmailViaWebhook(email, subject, html);
    }

    /**
     * Send email verification OTP via webhook
     */
    async sendEmailVerificationOTP(email, otp, userName = 'User') {
        const subject = '🔐 Verify Your Email - Gujarat Real Estate';
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
                    <h1>🎉 Welcome to Gujarat Real Estate!</h1>
                    <p>Verify your email to get started</p>
                </div>
                <div style="padding: 30px; background: #f8f9fa;">
                    <h2>Hello ${userName},</h2>
                    <p>Your email verification code is:</p>
                    <div style="background: #fff; border: 3px solid #007bff; border-radius: 10px; padding: 25px; margin: 25px 0; text-align: center;">
                        <div style="font-family: 'Courier New', monospace; font-size: 32px; font-weight: bold; color: #007bff; letter-spacing: 8px;">
                            ${otp}
                        </div>
                        <p style="color: #666; margin-top: 15px;">This code expires in 10 minutes</p>
                    </div>
                    <p><strong>Time:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
                </div>
            </div>
        `;

        return await this.sendEmailViaWebhook(email, subject, html);
    }
}

module.exports = new WebhookEmailService();