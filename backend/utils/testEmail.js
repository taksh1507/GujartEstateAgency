const nodemailer = require('nodemailer');
require('dotenv').config({ path: '.env' });

async function testEmailConnection() {
    console.log('🧪 Testing Gmail SMTP connection...');
    console.log('📧 Email User:', process.env.EMAIL_USER);
    console.log('🔑 Password Length:', process.env.EMAIL_PASSWORD ? process.env.EMAIL_PASSWORD.length : 'undefined');
    
    const transporter = nodemailer.createTransport({
        service: 'gmail',
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
        connectionTimeout: 60000,
        greetingTimeout: 30000,
        socketTimeout: 60000
    });

    try {
        console.log('🔍 Verifying SMTP connection...');
        await transporter.verify();
        console.log('✅ SMTP connection successful!');
        
        console.log('📤 Sending test email...');
        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: process.env.EMAIL_USER, // Send to self for testing
            subject: '🧪 Test Email - Gujarat Real Estate',
            html: `
                <h2>✅ Email Service Test Successful!</h2>
                <p>This is a test email from Gujarat Real Estate backend.</p>
                <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
                <p><strong>Environment:</strong> ${process.env.NODE_ENV || 'development'}</p>
            `
        });
        
        console.log('✅ Test email sent successfully!');
        console.log('📧 Message ID:', info.messageId);
        
    } catch (error) {
        console.error('❌ Email test failed:', error.message);
        console.error('🔍 Error details:', error);
    }
}

// Run the test
testEmailConnection();