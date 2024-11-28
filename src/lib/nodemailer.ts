import nodemailer from "nodemailer";
import { env } from "~/env";

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: env.USER,
    pass: env.PASS,
  },
});

export default transporter;
