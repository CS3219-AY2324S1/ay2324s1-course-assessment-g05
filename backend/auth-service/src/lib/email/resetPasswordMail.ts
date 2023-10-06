import { Mail } from "./mail";


const webURL = "http://localhost:3000/forgotpassword?"     // todo change the link in env

class ResetPasswordMail extends Mail {
    constructor(recipient:string, link:string) {
        
        const verificationSubject = `Peer Prep Reset Password`;
        const verificationContent = `<p>Click <a href="${webURL}email=${recipient}&token=${link}">here</a> to reset your password.</p>`;

        super(recipient, verificationSubject, verificationContent)
    };
}

export { ResetPasswordMail };
