const nodemailer = require('nodemailer');
require('dotenv').config();

// Initialize Transporter if SMTP environment variables exist
const createTransporter = () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });
  }
  return null;
};

const transporter = createTransporter();
const FROM_ADDRESS = process.env.SMTP_FROM || 'Atar Youth Association <noreply@ataryouth.org>';
const APP_URL = process.env.APP_URL || process.env.CLIENT_URL || 'http://localhost:3000';

/**
 * Generic Mail Sender with Safe Fallback for Dev Environment
 */
const sendMail = async ({ to, subject, html, text }) => {
  try {
    if (transporter) {
      const info = await transporter.sendMail({
        from: FROM_ADDRESS,
        to,
        subject,
        text,
        html
      });
      console.log(`✉️ Email sent successfully to ${to} (MessageId: ${info.messageId})`);
      return { success: true, messageId: info.messageId };
    } else {
      console.log(`\n📧 [DEV MODE - EMAIL NOT SENT TO SMTP]`);
      console.log(`   To: ${to}`);
      console.log(`   Subject: ${subject}`);
      console.log(`   Body Preview: ${text ? text.slice(0, 120) : 'HTML content'}...\n`);
      return { success: true, devMode: true };
    }
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}:`, error.message);
    return { success: false, error: error.message };
  }
};

/**
 * 1. Registration Welcome Email
 */
const sendWelcomeEmail = async ({ email, fullName, temporaryPassword, loginUrl = `${APP_URL}/login` }) => {
  const subject = 'Welcome to Atar Youth Association — Account Created';
  const text = `Hello ${fullName},\n\nWelcome to Atar Youth Association!\n\nYour account has been created successfully.\n\nTemporary Login Credentials:\nEmail: ${email}\nTemporary Password: ${temporaryPassword}\n\nLogin URL: ${loginUrl}\n\nIMPORTANT SECURITY NOTICE: You will be required to create a new secure password immediately upon your first login.\n\nBest regards,\nAtar Youth Association Team`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; rounded-lg: 8px; overflow: hidden;">
      <div style="background-color: #0f172a; color: #ffffff; padding: 24px; text-align: center;">
        <h2 style="margin: 0; font-size: 24px;">Atar Youth Association</h2>
        <p style="margin: 4px 0 0 0; color: #94a3b8; font-size: 14px;">South Sudan</p>
      </div>
      <div style="padding: 24px; background-color: #ffffff; color: #334155;">
        <h3 style="color: #0f172a; margin-top: 0;">Welcome, ${fullName}!</h3>
        <p>Your membership account with Atar Youth Association has been created successfully.</p>
        
        <div style="background-color: #f8fafc; border-left: 4px solid #0284c7; padding: 16px; margin: 20px 0; border-radius: 4px;">
          <p style="margin: 0 font-weight: bold; color: #0f172a;">Your Temporary Login Credentials:</p>
          <p style="margin: 6px 0;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 6px 0;"><strong>Temporary Password:</strong> <code style="background-color: #e2e8f0; padding: 2px 6px; border-radius: 4px; font-size: 14px;">${temporaryPassword}</code></p>
        </div>

        <p style="color: #d97706; font-size: 14px; font-weight: bold;">
          ⚠️ SECURITY NOTICE: You must change this password immediately upon your first login.
        </p>

        <div style="text-align: center; margin: 28px 0;">
          <a href="${loginUrl}" style="background-color: #0284c7; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;">Log In Now</a>
        </div>
      </div>
      <div style="background-color: #f1f5f9; padding: 16px; text-align: center; font-size: 12px; color: #64748b;">
        &copy; ${new Date().getFullYear()} Atar Youth Association. All rights reserved.
      </div>
    </div>
  `;

  return sendMail({ to: email, subject, html, text });
};

/**
 * 2. Password Reset Token Email
 */
const sendPasswordResetEmail = async ({ email, fullName, resetUrl, expiresMinutes = 60 }) => {
  const subject = 'Password Reset Request — Atar Youth Association';
  const text = `Hello ${fullName},\n\nWe received a request to reset your password for your Atar Youth Association account.\n\nReset URL: ${resetUrl}\n\nThis reset link will expire in ${expiresMinutes} minutes.\n\nIf you did not request this, please ignore this email.\n\nBest regards,\nAtar Youth Association Team`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #0f172a; color: #ffffff; padding: 24px; text-align: center;">
        <h2 style="margin: 0; font-size: 24px;">Atar Youth Association</h2>
      </div>
      <div style="padding: 24px; background-color: #ffffff; color: #334155;">
        <h3 style="color: #0f172a; margin-top: 0;">Password Reset Request</h3>
        <p>Hello ${fullName},</p>
        <p>We received a request to reset your account password. Click the button below to create a new password:</p>
        
        <div style="text-align: center; margin: 28px 0;">
          <a href="${resetUrl}" style="background-color: #0284c7; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>

        <p style="font-size: 13px; color: #64748b;">Or copy and paste this link into your browser:<br/><a href="${resetUrl}" style="color: #0284c7;">${resetUrl}</a></p>
        <p style="font-size: 13px; color: #64748b;">This link will expire in <strong>${expiresMinutes} minutes</strong>.</p>
        <p style="font-size: 13px; color: #64748b;">If you did not request a password reset, no action is required.</p>
      </div>
      <div style="background-color: #f1f5f9; padding: 16px; text-align: center; font-size: 12px; color: #64748b;">
        &copy; ${new Date().getFullYear()} Atar Youth Association. All rights reserved.
      </div>
    </div>
  `;

  return sendMail({ to: email, subject, html, text });
};

/**
 * 3. Admin Reset Password Notification Email
 */
const sendAdminPasswordResetEmail = async ({ email, fullName, temporaryPassword, loginUrl = `${APP_URL}/login` }) => {
  const subject = 'Your Password Was Reset — Atar Youth Association';
  const text = `Hello ${fullName},\n\nAn administrator has reset your password for your Atar Youth Association account.\n\nTemporary Password: ${temporaryPassword}\nLogin URL: ${loginUrl}\n\nYou will be required to change your password upon logging in.\n\nBest regards,\nAtar Youth Association Team`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #0f172a; color: #ffffff; padding: 24px; text-align: center;">
        <h2 style="margin: 0; font-size: 24px;">Atar Youth Association</h2>
      </div>
      <div style="padding: 24px; background-color: #ffffff; color: #334155;">
        <h3 style="color: #0f172a; margin-top: 0;">Password Reset Notification</h3>
        <p>Hello ${fullName},</p>
        <p>An administrator has initiated a password reset for your account.</p>

        <div style="background-color: #f8fafc; border-left: 4px solid #0284c7; padding: 16px; margin: 20px 0; border-radius: 4px;">
          <p style="margin: 0; font-weight: bold; color: #0f172a;">Your New Temporary Password:</p>
          <p style="margin: 8px 0 0 0;"><code style="background-color: #e2e8f0; padding: 4px 8px; border-radius: 4px; font-size: 16px; font-weight: bold;">${temporaryPassword}</code></p>
        </div>

        <p style="color: #d97706; font-size: 14px; font-weight: bold;">
          ⚠️ You must change this temporary password immediately after logging in.
        </p>

        <div style="text-align: center; margin: 28px 0;">
          <a href="${loginUrl}" style="background-color: #0284c7; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;">Log In Now</a>
        </div>
      </div>
      <div style="background-color: #f1f5f9; padding: 16px; text-align: center; font-size: 12px; color: #64748b;">
        &copy; ${new Date().getFullYear()} Atar Youth Association. All rights reserved.
      </div>
    </div>
  `;

  return sendMail({ to: email, subject, html, text });
};

module.exports = {
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendAdminPasswordResetEmail
};
