import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',          
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const sendContactEmail = async (contact: {
  name: string;
  email: string;
  message: string;
}) => {
  const mailOptions = {
    from: `"House Major website" <${process.env.SMTP_USER}>`,
    to: 'inezabonheur100@gmail.com',
    
    replyTo: contact.email,

    subject: `New Contact Message from ${contact.name}`,
    html: `
      <h2>New Contact Message</h2>
      <p><strong>Name:</strong> ${contact.name}</p>
      <p><strong>Email:</strong> ${contact.email}</p>
      <p><strong>Message:</strong></p>
      <p>${contact.message}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Contact email sent successfully');
  } catch (err: any) {
    console.error('Email notification failed:', err);
  }
};