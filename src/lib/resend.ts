import { Resend } from 'resend';
// setting up resend email by adding api key from .env
export const resend = new Resend(process.env.RESEND_API_KEY);
