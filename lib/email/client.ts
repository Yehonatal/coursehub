import nodemailer from "nodemailer";

// Gmail SMTP settings
const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_PASS = process.env.GMAIL_PASS; // App password recommended
const SENDER_EMAIL =
    process.env.MAIL_FROM ||
    `CourseHub <${GMAIL_USER || "noreply@example.com"}>`;

import { warn, debug, info, error } from "@/lib/logger";

if (!GMAIL_USER || !GMAIL_PASS) {
    warn(
        "GMAIL_USER or GMAIL_PASS not set. Email sending will fail until you set these environment variables."
    );
}

// Initialize nodemailer Gmail transporter
let transporter: nodemailer.Transporter | null = null;
if (GMAIL_USER && GMAIL_PASS) {
    transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: GMAIL_USER,
            pass: GMAIL_PASS,
        },
    });
    debug(
        "Gmail transporter initialized for %s",
        GMAIL_USER.replace(/.(?=.{4})/g, "*")
    );
    debug("Gmail transporter ready");
}

interface SendEmailOptions {
    to: string;
    subject: string;
    text: string;
    html?: string;
}

export async function sendEmail({ to, subject, text, html }: SendEmailOptions) {
    const from = SENDER_EMAIL;

    if (!transporter) {
        const err = new Error(
            "No email transporter configured (GMAIL_USER/GMAIL_PASS missing)"
        );
        error(err);
        return { success: false, error: err };
    }

    try {
        await transporter.sendMail({
            from,
            to,
            subject,
            text,
            html,
        });
        info(`Email sent to ${to} via Gmail`);
        return { success: true };
    } catch (err) {
        error("Gmail send error:", err);
        return { success: false, error: err };
    }
}
