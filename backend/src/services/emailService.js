import nodemailer from 'nodemailer';
import crypto from 'crypto';

// Initialize Nodemailer
console.log('📧 Initializing Nodemailer email service...');

// Create transporter
const createTransporter = () => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: process.env.MAIL_USERNAME,
            clientId: process.env.OAUTH_CLIENTID,
            clientSecret: process.env.OAUTH_CLIENT_SECRET,
            refreshToken: process.env.OAUTH_REFRESH_TOKEN
        }
    });
    
    return transporter;
};

// Test transporter connection
const testConnection = async () => {
    try {
        const transporter = createTransporter();
        await transporter.verify();
        console.log('✅ Nodemailer connection verified');
        return true;
    } catch (error) {
        console.error('❌ Nodemailer connection failed:', error.message);
        return false;
    }
};

// Initialize connection
testConnection();

export class EmailService {
    static async sendPasswordResetEmail(email, resetToken, firstName = '') {
        console.log('📧 Preparing password reset email');
        
        // Validate required parameters
        if (!email) {
            throw new Error('Email address is required');
        }
        if (!resetToken) {
            throw new Error('Reset token is required');
        }
        
        // Check if OAuth2 credentials are properly configured
        if (!process.env.MAIL_USERNAME || !process.env.OAUTH_CLIENTID || !process.env.OAUTH_CLIENT_SECRET || !process.env.OAUTH_REFRESH_TOKEN) {
            console.error('❌ OAuth2 credentials are not configured');
            console.error('❌ Please set the following environment variables:');
            console.error('   - MAIL_USERNAME');
            console.error('   - OAUTH_CLIENTID');
            console.error('   - OAUTH_CLIENT_SECRET');
            console.error('   - OAUTH_REFRESH_TOKEN');
            throw new Error('OAuth2 credentials are not configured. Please contact administrator.');
        }
        
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
        console.log('🔗 Reset URL generated');
        
        const fromEmail = process.env.MAIL_USERNAME;
        console.log('📤 Preparing to send email');
        
        const transporter = createTransporter();
        
        const mailOptions = {
            from: `"BPS Info" <${fromEmail}>`,
            to: email,
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
            console.log('📤 Sending email via Nodemailer...');
            console.log('📤 Message details:', {
                to: mailOptions.to,
                from: mailOptions.from,
                subject: mailOptions.subject,
                hasHtml: !!mailOptions.html,
                hasText: !!mailOptions.text
            });
            
            const info = await transporter.sendMail(mailOptions);
            console.log('✅ Password reset email sent successfully');
            console.log('✅ Message ID:', info.messageId);
            return { success: true, messageId: info.messageId };
        } catch (error) {
            console.error('❌ Nodemailer error details:', {
                message: error.message,
                code: error.code,
                response: error.response
            });
            
            throw new Error(`Email sending failed: ${error.message}`);
        }
    }

    static async sendPasswordResetConfirmation(email, firstName = '') {
        const transporter = createTransporter();
        
        const mailOptions = {
            from: `"BPS Info" <${process.env.MAIL_USERNAME}>`,
            to: email,
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
            const info = await transporter.sendMail(mailOptions);
            console.log('Password reset confirmation email sent');
            return { success: true, messageId: info.messageId };
        } catch (error) {
            console.error('Nodemailer error:', error);
            // Don't throw error for confirmation email as password is already reset
            console.log('Failed to send confirmation email, but password was reset successfully');
        }
    }

    static generateResetToken() {
        return crypto.randomBytes(32).toString('hex');
    }

    // Send enquiry notification email to admin
    static async sendEnquiryNotification(enquiryData) {
        console.log('📧 Preparing enquiry notification email...');
        
        // Check if OAuth2 credentials are properly configured
        if (!process.env.MAIL_USERNAME || !process.env.OAUTH_CLIENTID || !process.env.OAUTH_CLIENT_SECRET || !process.env.OAUTH_REFRESH_TOKEN) {
            console.error('❌ OAuth2 credentials are not configured');
            console.error('❌ Please set the following environment variables:');
            console.error('   - MAIL_USERNAME');
            console.error('   - OAUTH_CLIENTID');
            console.error('   - OAUTH_CLIENT_SECRET');
            console.error('   - OAUTH_REFRESH_TOKEN');
            throw new Error('OAuth2 credentials are not configured. Please contact administrator.');
        }

        const adminEmail = process.env.ADMIN_EMAIL || process.env.MAIL_USERNAME;
        const transporter = createTransporter();
        
        const mailOptions = {
            from: `"BPS Info" <${process.env.MAIL_USERNAME}>`,
            to: adminEmail,
            subject: `New Enquiry Received - ${enquiryData.enquiryType} from ${enquiryData.firstName} ${enquiryData.lastName}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>New Enquiry Received</title>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: #678df6; color: white; padding: 20px; text-align: center; }
                        .content { padding: 30px 20px; background: #f9f9f9; }
                        .enquiry-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
                        .detail-row { margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
                        .detail-label { font-weight: bold; color: #678df6; }
                        .message-box { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0; }
                        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>BPS Info</h1>
                            <h2>New Enquiry Received</h2>
                        </div>
                        <div class="content">
                            <p>Hello Admin,</p>
                            
                            <p>A new enquiry has been submitted through the BPS Info website. Here are the details:</p>
                            
                            <div class="enquiry-details">
                                <div class="detail-row">
                                    <span class="detail-label">Name:</span> ${enquiryData.firstName} ${enquiryData.lastName}
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Email:</span> ${enquiryData.email}
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Phone:</span> ${enquiryData.phone || 'Not provided'}
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Company:</span> ${enquiryData.company || 'Not provided'}
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Enquiry Type:</span> ${enquiryData.enquiryType}
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Product:</span> ${enquiryData.productName || 'General Enquiry'}
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Submitted:</span> ${new Date(enquiryData.submittedAt || Date.now()).toLocaleString()}
                                </div>
                            </div>
                            
                            <div class="message-box">
                                <strong>Message:</strong><br>
                                ${enquiryData.message || 'No message provided'}
                            </div>
                            
                            <p>Please respond to this enquiry as soon as possible.</p>
                            
                            <p>Best regards,<br>BPS Info System</p>
                        </div>
                        <div class="footer">
                            <p>This email was sent from BPS Info. Please do not reply to this email.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
            text: `
                New Enquiry Received - BPS Info
                
                Hello Admin,
                
                A new enquiry has been submitted through the BPS Info website.
                
                Details:
                - Name: ${enquiryData.firstName} ${enquiryData.lastName}
                - Email: ${enquiryData.email}
                - Phone: ${enquiryData.phone || 'Not provided'}
                - Company: ${enquiryData.company || 'Not provided'}
                - Enquiry Type: ${enquiryData.enquiryType}
                - Product: ${enquiryData.productName || 'General Enquiry'}
                - Submitted: ${new Date(enquiryData.submittedAt || Date.now()).toLocaleString()}
                
                Message:
                ${enquiryData.message || 'No message provided'}
                
                Please respond to this enquiry as soon as possible.
                
                Best regards,
                BPS Info System
            `
        };

        try {
            console.log('📤 Sending enquiry notification email...');
            const info = await transporter.sendMail(mailOptions);
            console.log('✅ Enquiry notification email sent successfully');
            console.log('✅ Message ID:', info.messageId);
            return { success: true, messageId: info.messageId };
        } catch (error) {
            console.error('❌ Failed to send enquiry notification:', error.message);
            throw new Error(`Enquiry notification email failed: ${error.message}`);
        }
    }

    // Test function to debug Nodemailer connection
    static async testNodemailerConnection() {
        console.log('🧪 Testing Nodemailer connection...');
        
        if (!process.env.MAIL_USERNAME || !process.env.OAUTH_CLIENTID || !process.env.OAUTH_CLIENT_SECRET || !process.env.OAUTH_REFRESH_TOKEN) {
            throw new Error('OAuth2 environment variables are not set. Please set MAIL_USERNAME, OAUTH_CLIENTID, OAUTH_CLIENT_SECRET, and OAUTH_REFRESH_TOKEN');
        }

        try {
            const transporter = createTransporter();
            await transporter.verify();
            console.log('✅ Nodemailer connection test successful!');
            return { success: true };
        } catch (error) {
            console.error('❌ Nodemailer connection test failed:', error.message);
            throw error;
        }
    }

    // Simple test email function
    static async sendTestEmail() {
        console.log('🧪 Sending test email...');
        
        const transporter = createTransporter();
        
        const mailOptions = {
            from: `"BPS Info" <${process.env.MAIL_USERNAME}>`,
            to: process.env.MAIL_USERNAME,
            subject: 'Nodemailer Project Test',
            text: 'Hi from your nodemailer project - this is a test email!'
        };

        try {
            const info = await transporter.sendMail(mailOptions);
            console.log('✅ Test email sent successfully!');
            console.log('✅ Message ID:', info.messageId);
            return { success: true, messageId: info.messageId };
        } catch (error) {
            console.error('❌ Test email failed:', error.message);
            throw error;
        }
    }
}
