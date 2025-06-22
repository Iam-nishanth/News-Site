'use server';
import nodemailer from 'nodemailer';
import * as Handlebars from 'handlebars';
import { activationTemplate } from '../mailTemplates/activationMail';
import { resetPasswordTemplate } from '../mailTemplates/resetPassword';
import { ContactFormAutoReply } from '../mailTemplates/contactFormAutoReply';
import { contactFormTemplate } from '../mailTemplates/contactForm';

const SMTP_MAIL = 'support@sudheervarma.com';
const SMTP_PASSWORD = 'Thinkpad@2023';

export async function sendMail({ to, subject, body }: { to: string; subject: string; body: string }) {
    const transporter = nodemailer.createTransport({
        host: 'smtp.hostinger.com',
        port: 465,
        secure: true,
        auth: {
            user: SMTP_MAIL,
            pass: SMTP_PASSWORD
        }
    });

    try {
        const sendResult = await transporter.sendMail({
            from: SMTP_MAIL,
            to,
            subject,
            html: body
        });
        return sendResult.response;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function compileActivationTemplate(name: string, url: string) {
    const template = Handlebars.compile(activationTemplate);
    const htmlBody = template({
        name,
        url
    });
    return htmlBody;
}
export async function compilePasswordTemplate(name: string, url: string) {
    const template = Handlebars.compile(resetPasswordTemplate);
    const htmlBody = template({
        name,
        url
    });
    return htmlBody;
}

export async function compileContactFormAutoReply(name: string) {
    const template = Handlebars.compile(ContactFormAutoReply);

    const htmlBody = template({
        name
    });
    return htmlBody;
}

export async function compileContactForm(name: string, email: string, subject: string, message: string | undefined) {
    const template = Handlebars.compile(contactFormTemplate);

    const htmlBody = template({
        name,
        email,
        subject,
        message
    });

    return htmlBody;
}
