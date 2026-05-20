/**
 * Inline-styled HTML emails aligned with Expense Tracker frontend (Tailwind theme in index.css).
 * Uses table layout for broad client support.
 */

const BRAND = "Expense Tracker";
const PRIMARY = "#326650";
const PRIMARY_DARK = "#2b5142";
const PRIMARY_SOFT = "#dcebe4";
const BG_MUTED = "#f5f6f7";
const TEXT_BASE = "#1f2933";
const TEXT_MUTED = "#667085";
const WHITE = "#ffffff";
const BORDER = "#e2e8f0";

function escapeHtml(s) {
  if (s == null || s === "") return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Shared shell: muted page background, white card, top brand bar, footer.
 */
function emailShell({ preheader, innerHtml }) {
  const safePre = escapeHtml(preheader);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>${escapeHtml(BRAND)}</title>
</head>
<body style="margin:0;padding:0;background-color:${BG_MUTED};font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <span style="display:none !important;visibility:hidden;mso-hide:all;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${safePre}</span>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:${BG_MUTED};padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;background-color:${WHITE};border-radius:8px;overflow:hidden;border:1px solid ${BORDER};box-shadow:0 1px 2px rgba(15,23,42,0.06);">
          <tr>
            <td style="background:linear-gradient(135deg,${PRIMARY} 0%,${PRIMARY_DARK} 100%);padding:20px 28px;">
              <p style="margin:0;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:rgba(255,255,255,0.9);">${escapeHtml(
                BRAND
              )}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 28px 24px;">
              ${innerHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:0 28px 28px;">
              <p style="margin:0;font-size:12px;line-height:1.5;color:${TEXT_MUTED};border-top:1px solid ${BORDER};padding-top:20px;">
                You are receiving this because you have an account with ${escapeHtml(BRAND)}.
              </p>
            </td>
          </tr>
        </table>
        <p style="margin:20px 0 0;font-size:11px;color:${TEXT_MUTED};text-align:center;">
          © ${new Date().getFullYear()} ${escapeHtml(BRAND)}
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buttonRow(href, label) {
  const safeHref = escapeHtml(href);
  const safeLabel = escapeHtml(label);
  return `<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:24px 0 0;">
    <tr>
      <td style="border-radius:6px;background-color:${PRIMARY};">
        <a href="${safeHref}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:12px 22px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:6px;">${safeLabel}</a>
      </td>
    </tr>
  </table>`;
}

/**
 * Welcome email after signup — matches signup hero (uppercase kicker + headline style).
 */
function welcomeEmailHtml({ firstName, lastName, appUrl }) {
  const name = [firstName, lastName].filter(Boolean).join(" ").trim();
  const greeting = name ? `Hi ${escapeHtml(name)},` : "Hi there,";
  const openUrl = appUrl && String(appUrl).trim() ? String(appUrl).trim() : "";
  const cta = openUrl ? buttonRow(openUrl, "Open Expense Tracker") : "";
  const inner = `
    <p style="margin:0 0 8px;font-size:13px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:${PRIMARY};">${escapeHtml(
      BRAND
    )}</p>
    <h1 style="margin:0 0 12px;font-size:24px;font-weight:600;line-height:1.25;color:${TEXT_BASE};">Welcome aboard</h1>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:${TEXT_MUTED};">
      ${greeting}<br /><br />
      Thanks for joining <strong style="color:${TEXT_BASE};">${escapeHtml(BRAND)}</strong>. You can start tracking expenses, categories, and reports from your dashboard whenever you are ready.
    </p>
    <p style="margin:0;padding:14px 16px;background-color:${PRIMARY_SOFT};border-radius:6px;font-size:14px;line-height:1.55;color:${TEXT_BASE};">
      <strong>Tip:</strong> add a few categories first, then log expenses as you go — it only takes a few seconds per entry.
    </p>
    ${cta}
  `;

  return emailShell({
    preheader: `You're in — start tracking expenses with ${BRAND}.`,
    innerHtml: inner,
  });
}

function welcomeEmailText({ firstName, lastName, appUrl }) {
  const name = [firstName, lastName].filter(Boolean).join(" ").trim();
  const greeting = name ? `Hi ${name},` : "Hi there,";
  const lines = [
    greeting,
    "",
    `Thanks for joining ${BRAND}. You can start tracking expenses, categories, and reports from your dashboard.`,
    "",
    appUrl && String(appUrl).trim() ? `Open the app: ${String(appUrl).trim()}` : "",
    "",
    `— ${BRAND}`,
  ];
  return lines.filter(Boolean).join("\n");
}

/**
 * Generic transactional email (password reminders, notifications, etc.).
 */
function transactionalEmailHtml({ title, intro, bullets = [], ctaLabel, ctaUrl, footnote }) {
  const bulletHtml =
    bullets.length > 0
      ? `<ul style="margin:12px 0 0;padding:0 0 0 20px;color:${TEXT_MUTED};font-size:15px;line-height:1.6;">
          ${bullets.map((b) => `<li style="margin:0 0 8px;">${escapeHtml(b)}</li>`).join("")}
        </ul>`
      : "";

  const ctaBlock =
    ctaLabel && ctaUrl ? buttonRow(ctaUrl, ctaLabel) : "";

  const foot =
    footnote
      ? `<p style="margin:20px 0 0;font-size:13px;line-height:1.5;color:${TEXT_MUTED};">${escapeHtml(
          footnote
        )}</p>`
      : "";

  const inner = `
    <p style="margin:0 0 8px;font-size:13px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:${PRIMARY};">${escapeHtml(
      BRAND
    )}</p>
    <h1 style="margin:0 0 12px;font-size:22px;font-weight:600;line-height:1.3;color:${TEXT_BASE};">${escapeHtml(
      title
    )}</h1>
    <p style="margin:0;font-size:15px;line-height:1.6;color:${TEXT_MUTED};">${intro}</p>
    ${bulletHtml}
    ${ctaBlock}
    ${foot}
  `;

  return emailShell({
    preheader: title,
    innerHtml: inner,
  });
}

function transactionalEmailText({ title, intro, bullets = [], ctaLabel, ctaUrl, footnote }) {
  const parts = [BRAND, "", title, "", intro];
  if (bullets.length) {
    parts.push("", ...bullets.map((b) => `• ${b}`));
  }
  if (ctaLabel && ctaUrl) {
    parts.push("", `${ctaLabel}: ${ctaUrl}`);
  }
  if (footnote) {
    parts.push("", footnote);
  }
  parts.push("", `— ${BRAND}`);
  return parts.join("\n");
}

module.exports = {
  welcomeEmailHtml,
  welcomeEmailText,
  transactionalEmailHtml,
  transactionalEmailText,
  escapeHtml,
};
