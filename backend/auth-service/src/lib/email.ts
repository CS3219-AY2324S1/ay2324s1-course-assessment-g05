
import { Source, Email } from "../common/types";
const nodemailer = require("nodemailer");

const webURL = "http://localhost:3000/verify?"     // todo change the link in env

class VerificationMail {
    source: Source;
    recipient: string;
    link: string;

    constructor(recipient:string, link:string, ) {
        this.source = {
            user: process.env.NM_MAIL!,
            pass: process.env.NM_PASS!
        };
        this.recipient = recipient;
        this.link = link;
    };

    subject() {
        return (
            `Peer Prep Verification Email`
        )
    }

    body() {
        return (
            `<p>Click <a href="${webURL}email=${this.recipient}&token=${this.link}">here</a> to verify your email.</p>`
        )
    }
    footer() {
        return (
            `<br><strong>Note:</strong> This is an auto-generated email. Please do not reply to this email.`
        );
    };

    createTransport() {
        return nodemailer.createTransport({
            service: 'gmail',
            auth: this.source,
            pool: true,
            port: 465,
            secure: true,
            connectionTimeout: 100,
        });
    };

    async send() {
        try {
            // if (!Mail.validateEmail(this.recipient)) throw new Error("Invalid email")
            console.log(this.source)
            const transporter = this.createTransport();
        
            await transporter.sendMail({
                from: this.source.user, 
                to: this.recipient,
                subject: this.subject(),
                html: this.body() + this.footer(),
            });
            
        }
        catch (err) {
            console.error(err);
        }
    };
};

export { VerificationMail };