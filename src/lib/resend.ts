import { Resend } from 'resend';

// Make sure to add RESEND_API_KEY in your .env file
const resendApiKey = process.env.RESEND_API_KEY;

export const resend = resendApiKey ? new Resend(resendApiKey) : null;

if (!resendApiKey) {
  console.warn('RESEND_API_KEY is not defined in the environment variables. Email sending will not work.');
}

/**
 * Utility function to send an email.
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
  if (!resend) {
    throw new Error('Resend is not configured. Missing RESEND_API_KEY.');
  }

  // NOTE: You must use a verified domain in Resend if you are not testing.
  // The default from address usually needs to match your verified domain.
  // For testing, Resend allows sending from 'onboarding@resend.dev' to the registered email address.
  try {
    const data = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>', // Replace with your verified domain
      to,
      subject,
      html,
    });

    return { success: true, data };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}
