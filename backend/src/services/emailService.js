import sgMail from '@sendgrid/mail';
import crypto from 'crypto';

// Initialize SendGrid
console.log('📧 Initializing SendGrid email service...');
console.log('📧 SendGrid API Key status:', process.env.SENDGRID_KEY ? 'Set' : 'Not set');

if (!process.env.SENDGRID_KEY) {
    console.error('❌ SENDGRID_KEY environment variable is not set!');
    console.error('❌ Please set SENDGRID_KEY in your environment variables');
} else {
    sgMail.setApiKey(process.env.SENDGRID_KEY);
    console.log('✅ SendGrid API Key configured');
}

export class EmailService {
    static async sendPasswordResetEmail(email, resetToken, firstName = '') {
        console.log('📧 Preparing password reset email for:', email);
        
        // Validate required parameters
        if (!email) {
            throw new Error('Email address is required');
        }
        if (!resetToken) {
            throw new Error('Reset token is required');
        }
        
        // Check if SendGrid is properly configured
        if (!process.env.SENDGRID_KEY) {
            console.error('❌ SendGrid API key is not configured');
            console.error('❌ Please set SENDGRID_KEY environment variable');
            throw new Error('SendGrid API key is not configured. Please contact administrator.');
        }
        
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
        console.log('🔗 Reset URL generated:', resetUrl);
        
        const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'casoto4386@certve.com';
        console.log('📤 From email:', fromEmail);
        
        const msg = {
            to: email,
            from: {
                email: fromEmail,
                name: 'BPS Info'
            },
            subject: 'Password Reset Request - BPS Info',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Password Reset</title>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: #2c3e50; color: white; padding: 20px; text-align: center; }
                        .content { padding: 30px 20px; background: #f9f9f9; }
                        .button { 
                            display: inline-block; 
                            background: #3498db; 
                            color: white; 
                            padding: 12px 30px; 
                            text-decoration: none; 
                            border-radius: 5px; 
                            margin: 20px 0;
                        }
                        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
                        .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>BPS Info</h1>
                            <h2>Password Reset Request</h2>
                        </div>
                        <div class="content">
                            <p>Hello ${firstName ? firstName : 'User'},</p>
                            
                            <p>We received a request to reset your password for your BPS Info account. If you made this request, click the button below to reset your password:</p>
                            
                            <div style="text-align: center;">
                                <a href="${resetUrl}" class="button">Reset My Password</a>
                            </div>
                            
                            <p>Or copy and paste this link into your browser:</p>
                            <p style="word-break: break-all; background: #eee; padding: 10px; border-radius: 3px;">${resetUrl}</p>
                            
                            <div class="warning">
                                <strong>Important:</strong>
                                <ul>
                                    <li>This link will expire in 1 hour for security reasons</li>
                                    <li>If you didn't request this password reset, please ignore this email</li>
                                    <li>Your password will not be changed until you click the link above</li>
                                </ul>
                            </div>
                            
                            <p>If you're having trouble clicking the button, copy and paste the URL above into your web browser.</p>
                            
                            <p>Best regards,<br>BPS Info Team</p>
                        </div>
                        <div class="footer">
                            <p>This email was sent from BPS Info. Please do not reply to this email.</p>
                            <p>If you have any questions, please contact our support team.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
            text: `
                Password Reset Request - BPS Info
                
                Hello ${firstName ? firstName : 'User'},
                
                We received a request to reset your password for your BPS Info account.
                
                To reset your password, click the following link:
                ${resetUrl}
                
                This link will expire in 1 hour for security reasons.
                
                If you didn't request this password reset, please ignore this email.
                Your password will not be changed until you click the link above.
                
                Best regards,
                BPS Info Team
            `
        };

        try {
            console.log('📤 Sending email via SendGrid...');
            console.log('📤 API Key (first 10 chars):', process.env.SENDGRID_KEY?.substring(0, 10) + '...');
            console.log('📤 Message details:', {
                to: msg.to,
                from: msg.from,
                subject: msg.subject,
                hasHtml: !!msg.html,
                hasText: !!msg.text
            });
            
            const response = await sgMail.send(msg);
            console.log('✅ Password reset email sent successfully to:', email);
            console.log('✅ SendGrid response status:', response[0]?.statusCode);
            console.log('✅ SendGrid response headers:', response[0]?.headers);
            return { success: true };
        } catch (error) {
            console.error('❌ SendGrid error details:', {
                message: error.message,
                code: error.code,
                response: error.response?.body,
                statusCode: error.response?.statusCode,
                headers: error.response?.headers
            });
            
            // Log the full error response for debugging
            if (error.response?.body?.errors) {
                console.error('❌ SendGrid error details:', error.response.body.errors);
            }
            
            // Provide more specific error messages
            if (error.code === 401) {
                throw new Error('SendGrid API key is invalid or unauthorized');
            } else if (error.code === 403) {
                throw new Error('SendGrid API key does not have permission to send emails');
            } else if (error.code === 400) {
                throw new Error('Invalid email request: ' + (error.response?.body?.errors?.[0]?.message || error.message));
            } else if (error.code === 413) {
                throw new Error('Email content is too large');
            } else {
                throw new Error(`SendGrid error: ${error.message}`);
            }
        }
    }

    static async sendPasswordResetConfirmation(email, firstName = '') {
        const msg = {
            to: email,
            from: {
                email: process.env.SENDGRID_FROM_EMAIL || 'casoto4386@certve.com',
                name: 'BPS Info'
            },
            subject: 'Password Successfully Reset - BPS Info',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Password Reset Confirmation</title>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: #27ae60; color: white; padding: 20px; text-align: center; }
                        .content { padding: 30px 20px; background: #f9f9f9; }
                        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
                        .success { background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin: 20px 0; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>BPS Info</h1>
                            <h2>Password Reset Successful</h2>
                        </div>
                        <div class="content">
                            <p>Hello ${firstName ? firstName : 'User'},</p>
                            
                            <div class="success">
                                <strong>✓ Your password has been successfully reset!</strong>
                            </div>
                            
                            <p>Your BPS Info account password was changed on ${new Date().toLocaleString()}.</p>
                            
                            <p>If you made this change, no further action is required. You can now log in with your new password.</p>
                            
                            <p>If you did not make this change, please contact our support team immediately as your account may have been compromised.</p>
                            
                            <p>Best regards,<br>BPS Info Team</p>
                        </div>
                        <div class="footer">
                            <p>This email was sent from BPS Info. Please do not reply to this email.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
            text: `
                Password Reset Confirmation - BPS Info
                
                Hello ${firstName ? firstName : 'User'},
                
                Your password has been successfully reset!
                
                Your BPS Info account password was changed on ${new Date().toLocaleString()}.
                
                If you made this change, no further action is required.
                If you did not make this change, please contact our support team immediately.
                
                Best regards,
                BPS Info Team
            `
        };

        try {
            await sgMail.send(msg);
            console.log(`Password reset confirmation email sent to ${email}`);
            return { success: true };
        } catch (error) {
            console.error('SendGrid error:', error);
            // Don't throw error for confirmation email as password is already reset
            console.log('Failed to send confirmation email, but password was reset successfully');
        }
    }

    static generateResetToken() {
        return crypto.randomBytes(32).toString('hex');
    }

    // Test function to debug SendGrid connection
    static async testSendGridConnection() {
        console.log('🧪 Testing SendGrid connection...');
        console.log('🧪 API Key format check:', {
            hasKey: !!process.env.SENDGRID_KEY,
            keyLength: process.env.SENDGRID_KEY?.length,
            startsWithSG: process.env.SENDGRID_KEY?.startsWith('SG.'),
            first10Chars: process.env.SENDGRID_KEY?.substring(0, 10) + '...'
        });

        if (!process.env.SENDGRID_KEY) {
            throw new Error('SENDGRID_KEY environment variable is not set');
        }

        if (!process.env.SENDGRID_KEY.startsWith('SG.')) {
            throw new Error('SENDGRID_KEY does not start with "SG." - this might be incorrect format');
        }

        try {
            // First test: Just check API key validity with a minimal request
            console.log('🧪 Testing API key validity...');
            
            // Test with a simple email using a verified sender
            const testMsg = {
                to: 'test@example.com',
                from: {
                    email: 'casoto4386@certve.com', // Use the configured sender email
                    name: 'BPS Info Test'
                },
                subject: 'SendGrid Connection Test',
                text: 'This is a test email to verify SendGrid connection.',
                html: '<p>This is a test email to verify SendGrid connection.</p>'
            };

            console.log('🧪 Sending test email...');
            const response = await sgMail.send(testMsg);
            console.log('✅ SendGrid connection test successful!');
            console.log('✅ Response:', response[0]?.statusCode);
            return { success: true, statusCode: response[0]?.statusCode };
        } catch (error) {
            console.error('❌ SendGrid connection test failed:', {
                message: error.message,
                code: error.code,
                response: error.response?.body,
                statusCode: error.response?.statusCode
            });
            
            // Log detailed error information
            if (error.response?.body?.errors) {
                console.error('❌ Detailed SendGrid errors:', error.response.body.errors);
                error.response.body.errors.forEach((err, index) => {
                    console.error(`❌ Error ${index + 1}:`, {
                        message: err.message,
                        field: err.field,
                        help: err.help
                    });
                });
            }
            
            // Check for specific common issues
            if (error.message === 'Unauthorized') {
                console.error('❌ UNAUTHORIZED ERROR - Common causes:');
                console.error('   1. API key does not have Mail Send permissions');
                console.error('   2. API key is restricted to specific IPs (check your IP)');
                console.error('   3. SendGrid account is suspended or has billing issues');
                console.error('   4. API key has expired or been revoked');
                console.error('   5. Sender email is not verified in SendGrid');
            }
            
            throw error;
        }
    }
}
