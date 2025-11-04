// server.js
require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS);


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// اختبار اتصال SMTP (اختياري لكن مفيد)
transporter.verify((err, success) => {
  if (err) {
    console.error('SMTP verify failed:', err);
  } else {
    console.log('SMTP ready to send messages');
  }
});

app.post('/send', async (req, res) => {
  const { name, email, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'Missing fields' });
  }

  try {
    await transporter.sendMail({
      // display name = اسم الزائر، لكن الإيميل الفعلي المرسل هو EMAIL_USER
      from: `"${name}" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,       // يستلم صاحب الموقع هنا
      replyTo: email,                   // الرد يذهب مباشرة لإيميل الزائر
      subject: `Message from ${name} — ${email}`,
      html: `
        <span style="display:none;opacity:0;height:0;width:0;overflow:hidden;">
          ${name}: ${message}
        </span>
        <div style="font-family: Arial, Helvetica, sans-serif; color:#222;">
          <p style="margin:0 0 8px 0;"><strong>${name}</strong> &middot; <a href="mailto:${email}">${email}</a></p>
          <hr style="border:none;border-top:1px solid #eee;margin:10px 0;" />
          <div style="padding:10px;background:#f7f7f7;border-radius:6px;">
            <p style="margin:0; white-space:pre-wrap;">${message}</p>
          </div>
          <p style="font-size:12px;color:#666;margin-top:10px;">Sent from contact form on your website</p>
        </div>
      `
    });

    return res.json({ success: true });
  } catch (err) {
    console.error('Full error object:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});




app.listen(PORT, () => {
});
