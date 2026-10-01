import nodemailer from 'nodemailer';

const gmailUser = process.env.GMAIL_USER;
const gmailPass = process.env.GMAIL_PASS;

if (!gmailUser || !gmailPass) {
  console.warn('GMAIL_USER or GMAIL_PASS is not defined in the environment variables. Email sending will not work.');
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailUser,
    pass: gmailPass,
  },
});

/**
 * Utility function to send an email using Nodemailer (Gmail).
 * @param to recipient email address
 * @param subject email subject
 * @param html email HTML content
 */
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string | string[];
  subject: string;
  html: string;
}) {
  if (!gmailUser || !gmailPass) {
    throw new Error('Nodemailer is not configured. Missing GMAIL_USER or GMAIL_PASS.');
  }

  try {
    const info = await transporter.sendMail({
      from: `"Timiclassic" <${gmailUser}>`,
      to,
      subject,
      html,
    });

    return { success: true, data: info };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}
