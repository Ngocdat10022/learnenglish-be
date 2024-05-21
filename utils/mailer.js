import nodemailer from "nodemailer";
export const mailer = (to, subject, htmlContent) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: "587",
    secure: false,
    auth: {
      user: "huynhngocdat2002.td@gmail.com",
      pass: "tvdu sccr vejv xhim",
    },
  });

  const mailOptions = {
    from: "huynhngocdat2002.td@gmail.com",
    to: `${to}`,
    subject: subject,
    html: htmlContent,
  };

  return transporter.sendMail(mailOptions);
};
