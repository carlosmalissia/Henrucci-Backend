import { OAuth2Client } from "google-auth-library";
import nodemailer from "nodemailer";
import { emailMessage } from "../assets/emailNotificationTemplate.js";

const oauth2Client = new OAuth2Client({
  clientId:
    "469081136823-59el17u5d6h8386mtjpud63ioj5bl0t6.apps.googleusercontent.com",
  clientSecret: "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",
  redirectUri: "https://developers.google.com/oauthplayground",
});

oauth2Client.setCredentials({
  refresh_token:
    "1//046z9QAa3TpbWCgYIARAAGAQSNwF-L9Ir__MDD7GekzK5xrflExlod_R2faL7AjLmDnBeImd_rnw6zEaN1-EuNzVTJh6-d-OBIO8",
});

// Función para enviar notificación
const sendNotification = async (userEmail, userName) => {
  try {
    const accessToken = await oauth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "henrucciwebsite@gmail.com",
        clientId:
          "469081136823-59el17u5d6h8386mtjpud63ioj5bl0t6.apps.googleusercontent.com",
        clientSecret: "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",
        refreshToken:
          "1//046z9QAa3TpbWCgYIARAAGAQSNwF-L9Ir__MDD7GekzK5xrflExlod_R2faL7AjLmDnBeImd_rnw6zEaN1-EuNzVTJh6-d-OBIO8",
        accessToken: accessToken,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    transporter.on("token", (token) => {
      console.log("A new access token was generated");
      console.log("User: %s", token.user);
      console.log("Access Token: %s", token.accessToken);
      console.log("Expires: %s", new Date(token.expires));
    });
    
    const mailOptions = {
      from: "henrucciwebsite@gmail.com",
      to: userEmail,
      subject: "Bienvenido a tu aplicación",
      text: "Bienvenido",
      //html: "<h1>Bienvenido a Henry</h1>",
      html: emailMessage(userName),
    };

    const mailSend = await transporter.sendMail(mailOptions);
    console.log("Correo de notificación enviado:");
    console.log(mailSend);
  } catch (error) {
    console.error("Error al enviar el correo de notificación:", error);
  }
};

export default sendNotification;