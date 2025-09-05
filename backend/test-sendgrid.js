import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('🧪 Testing SendGrid with simple email...');
console.log('📧 API Key status:', process.env.SENDGRID_KEY ? 'Set' : 'Not set');
console.log('📧 API Key (first 10 chars):', process.env.SENDGRID_KEY?.substring(0, 10) + '...');

// Set API key
sgMail.setApiKey(process.env.SENDGRID_KEY);

const msg = {
  to: 'nithin6524@gmail.com', // Change to your recipient
  from: 'casoto4386@certve.com', // Change to your verified sender
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};

console.log('📤 Sending email...');
console.log('📤 Message details:', {
  to: msg.to,
  from: msg.from,
  subject: msg.subject
});

sgMail
  .send(msg)
  .then(() => {
    console.log('✅ Email sent successfully!');
  })
  .catch((error) => {
    console.error('❌ Error sending email:');
    console.error('❌ Error message:', error.message);
    console.error('❌ Error code:', error.code);
    console.error('❌ Error response:', error.response?.body);
    
    if (error.response?.body?.errors) {
      console.error('❌ Detailed errors:');
      error.response.body.errors.forEach((err, index) => {
        console.error(`   Error ${index + 1}:`, err.message);
      });
    }
  });
