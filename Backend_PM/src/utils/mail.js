import mailgen from "mailgen";
import nodemailer from "nodemailer";

const sendEmail = async (options) => {
   const mailGenerator = new mailgen({
        theme: "default",
        product:{
            name: "Task Manager",
            link: "https://taskmanagelink.com"
        }
    });

    const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent);

    const emailHtml = mailGenerator.generate(options.mailgenContent);

    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_SMTP_HOST,
        port: process.env.MAILTRAP_SMTP_PORT,
        auth:{
            user: process.env.MAILTRAP_SMTP_USER,
            pass: process.env.MAILTRAP_SMTP_PASS
        }
    });

    const mail = {
        from: "mail.taskmanager@example.com",
        to: options.email,
        subject: options.subject,
        text: emailTextual,
        html: emailHtml,
    };


    try {
        await transporter.sendMail(mail)
    } catch (error) {
        console.error("Email service fail siliently. Make sure that you have provided your MAILTRAP credentials in the .env file");
        console.error("Error: ", error)
    }

}


const emailVerificationMailgenContent = (username, verificationUrl) => {
    return {
        body : {
            name : username,
            intro: "Welcom to our App! We'are excited to have you on board.",
            action :{
                instruction: "To verify your email please click on following button",
                button: {
                    color: "#22BC66",
                    text: "Verify your Email",
                    link: verificationUrl
                },
            },

            outro : "Need help, or have question? Just reply to this email, we'd love to help."
        },
    };
};


const forgotPasswordMailgenContent = (username, passwordResetUrl) => {
    return {
        body : {
            name : username,
            intro: "We got a request to reset the Password of your account",
            action :{
                instruction: "To reset your password click on the following button or link",
                button: {
                    color: "#22BC66",
                    text: "Reset Password",
                    link: passwordResetUrl,
                },
            },

            outro : "Need help, or have question? Just reply to this email, we'd love to help."
        },
    };
};




export {
    emailVerificationMailgenContent,
    forgotPasswordMailgenContent,
    sendEmail
}