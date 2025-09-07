import { EmailService } from './src/services/emailService.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testEmail() {
    try {
        console.log('🧪 Starting email test...');
        console.log('📧 Environment variables check:');
        console.log('- MAIL_USERNAME:', process.env.MAIL_USERNAME ? 'Set' : 'Not set');
        console.log('- MAIL_PASSWORD:', process.env.MAIL_PASSWORD ? 'Set' : 'Not set');
        console.log('- OAUTH_CLIENTID:', process.env.OAUTH_CLIENTID ? 'Set' : 'Not set');
        console.log('- OAUTH_CLIENT_SECRET:', process.env.OAUTH_CLIENT_SECRET ? 'Set' : 'Not set');
        console.log('- OAUTH_REFRESH_TOKEN:', process.env.OAUTH_REFRESH_TOKEN ? 'Set' : 'Not set');
        
        // Test connection first
        console.log('\n🔌 Testing connection...');
        await EmailService.testNodemailerConnection();
        
        // Send test email
        console.log('\n📤 Sending test email...');
        const result = await EmailService.sendTestEmail();
        
        console.log('\n✅ Test completed successfully!');
        console.log('📧 Check nithin6524@gmail.com for the test email');
        
    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        console.error('Full error:', error);
    }
}

// Run the test
testEmail();
