const mailer = require("nodemailer");
const {
  welcomeEmailHtml,
  welcomeEmailText,
  transactionalEmailHtml,
  transactionalEmailText,
} = require("./emailTemplates");

function getTransportConfig() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) {
    return null;
  }
  return {
    service: "gmail",
    auth: { user, pass },
  };
}

/**
 * Send HTML email. Skips silently if SMTP_USER / SMTP_PASS are not set (local dev).
 * @param {string} to
 * @param {string} subject
 * @param {string} html
 * @param {string} [text] plain-text fallback
 */
const mailSend = async (to, subject, html, text) => {
  const config = getTransportConfig();
  if (!config) {
    console.warn(
      "[MailUtil] SMTP_USER or SMTP_PASS missing — email not sent (configure .env for mail)."
    );
    return;
  }

  const transport = mailer.createTransport(config);

  const mailOptions = {
    to,
    from: config.auth.user,
    subject,
    html,
    ...(text ? { text } : {}),
  };

  await transport.sendMail(mailOptions);
};

/**
 * Branded welcome mail (matches Expense Tracker UI).
 */
async function sendWelcomeEmail(to, { firstName, lastName } = {}) {
  const appUrl = process.env.FRONTEND_URL || process.env.APP_URL || "";
  const html = welcomeEmailHtml({ firstName, lastName, appUrl });
  const text = welcomeEmailText({ firstName, lastName, appUrl });
  await mailSend(to, "Welcome to Expense Tracker", html, text);
}

/**
 * Generic transactional mail using the same layout as the rest of the app.
 */
async function sendTransactionalEmail(to, subject, payload) {
  const html = transactionalEmailHtml(payload);
  const text = transactionalEmailText(payload);
  await mailSend(to, subject, html, text);
}

module.exports = Object.assign(mailSend, {
  mailSend,
  sendWelcomeEmail,
  sendTransactionalEmail,
});
