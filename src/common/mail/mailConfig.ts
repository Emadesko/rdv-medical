import { MailerOptions } from '@nestjs-modules/mailer';

export default (): MailerOptions => ({
  transport: {
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  },
  defaults: {
    from: `"RDV Medical" <no-reply@rdv.com>`,
  },
});
