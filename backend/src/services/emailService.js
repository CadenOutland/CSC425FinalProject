// backend/src/services/emailService.js
// Email delivery service for notifications, onboarding, and alerts.

const nodemailer = require("nodemailer");

let transporter = null;

// Initialize transport safely
if (process.env.SMTP_HOST) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  console.log("✅ Email service initialized");
} else {
  console.warn("⚠️ No SMTP settings found — email service running in STUB MODE.");
}

const sendEmail = async (to, subject, html) => {
  if (!transporter) {
    console.log(`📨 Email Stub: [To: ${to}] [Subject: ${subject}]`);
    console.log(html);
    return { stub: true };
  }

  return await transporter.sendMail({
    from: process.env.EMAIL_FROM || "SkillWise <no-reply@skillwise.ai>",
    to,
    subject,
    html,
  });
};

const emailService = {
  sendWelcomeEmail: async (email, name) => {
    return sendEmail(
      email,
      "Welcome to SkillWise 🎉",
      `
      <h2>Welcome, ${name}!</h2>
      <p>We're excited to have you on SkillWise.</p>
      <p>Start your learning journey today!</p>
    `
    );
  },

  sendPasswordResetEmail: async (email, token) => {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    return sendEmail(
      email,
      "Reset Your Password",
      `
      <h2>Password Reset Requested</h2>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
    `
    );
  },

  sendProgressUpdate: async (email, progress) => {
    return sendEmail(
      email,
      "Your Weekly SkillWise Progress 📊",
      `
      <h2>Your Weekly Progress</h2>
      <p>You completed <strong>${progress.completed}</strong> challenges this week!</p>
      <p>Total points earned: <strong>${progress.points}</strong></p>
    `
    );
  },

  sendAchievementNotification: async (email, achievement) => {
    return sendEmail(
      email,
      `Achievement Unlocked: ${achievement.name} 🏆`,
      `
      <h2>Congratulations!</h2>
      <p>You unlocked the achievement: <strong>${achievement.name}</strong></p>
      <p>${achievement.description}</p>
    `
    );
  },
};

module.exports = emailService;
