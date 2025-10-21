const multiEmailService = require('../services/multiEmailService');

async function testAllProviders() {
    console.log('🧪 Testing all configured email providers...\n');
    
    const providers = multiEmailService.providers;
    
    if (providers.length === 0) {
        console.log('❌ No email providers configured!');
        console.log('\n📝 To configure email providers, add these to your .env file:');
        console.log('\n# Gmail');
        console.log('EMAIL_USER=your_email@gmail.com');
        console.log('EMAIL_PASSWORD=your_app_password');
        console.log('\n# Outlook');
        console.log('OUTLOOK_USER=your_email@outlook.com');
        console.log('OUTLOOK_PASSWORD=your_app_password');
        console.log('\n# SendGrid (Recommended)');
        console.log('SENDGRID_API_KEY=your_sendgrid_api_key');
        return;
    }

    console.log(`📧 Found ${providers.length} configured providers\n`);
    
    const results = [];
    
    for (const provider of providers) {
        console.log(`🔍 Testing ${provider.name}...`);
        
        try {
            const startTime = Date.now();
            const isWorking = await multiEmailService.testProvider(provider);
            const duration = Date.now() - startTime;
            
            if (isWorking) {
                console.log(`✅ ${provider.name}: Working (${duration}ms)`);
                results.push({ name: provider.name, status: 'Working', duration });
            } else {
                console.log(`❌ ${provider.name}: Failed`);
                results.push({ name: provider.name, status: 'Failed', duration });
            }
        } catch (error) {
            console.log(`❌ ${provider.name}: Error - ${error.message}`);
            results.push({ name: provider.name, status: 'Error', error: error.message });
        }
        
        console.log(''); // Empty line for readability
    }
    
    // Summary
    console.log('📊 Summary:');
    console.log('='.repeat(50));
    
    const working = results.filter(r => r.status === 'Working');
    const failed = results.filter(r => r.status !== 'Working');
    
    if (working.length > 0) {
        console.log(`✅ Working providers (${working.length}):`);
        working
            .sort((a, b) => a.duration - b.duration)
            .forEach(r => console.log(`   ${r.name} (${r.duration}ms)`));
    }
    
    if (failed.length > 0) {
        console.log(`❌ Failed providers (${failed.length}):`);
        failed.forEach(r => console.log(`   ${r.name}: ${r.error || r.status}`));
    }
    
    if (working.length > 0) {
        console.log(`\n🚀 Fastest provider: ${working[0].name} (${working[0].duration}ms)`);
        console.log('💡 This provider will be used first for sending emails.');
    } else {
        console.log('\n⚠️ No working email providers found!');
        console.log('📧 Emails will be displayed in console for testing.');
    }
}

async function sendTestEmail() {
    const testEmail = process.env.EMAIL_USER || 'test@example.com';
    const testOTP = '123456';
    
    console.log(`📤 Sending test email to: ${testEmail}\n`);
    
    try {
        const result = await multiEmailService.sendPasswordResetOTP(testEmail, testOTP, 'Test User');
        
        if (result.success) {
            console.log(`✅ Test email sent successfully via ${result.provider}!`);
            console.log(`📧 Message ID: ${result.messageId}`);
        } else {
            console.log('❌ Test email failed to send');
        }
    } catch (error) {
        console.error('❌ Test email error:', error.message);
    }
}

// Main execution
async function main() {
    const args = process.argv.slice(2);
    
    if (args.includes('--test-send')) {
        await sendTestEmail();
    } else {
        await testAllProviders();
    }
}

// Run if called directly
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { testAllProviders, sendTestEmail };