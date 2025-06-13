import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import User from '../models/User.js';
import moment from 'moment';

dotenv.config(); // Load .env config

// ✅ Gmail SMTP transporter (with app password)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // TLS
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// ✅ Notify participant when added to a room
export const sendParticipantNotification = async (user, room, addedByUser) => {
  const message = `Hello ${user.name},

You have been added to the room "${room.name}" by ${addedByUser.name}.

You can now view and participate in expenses for this room.

Thanks,
Room Expense Splitter`;

  try {
    if (user.email) {
      await transporter.sendMail({
        from: `"Room Expense Splitter" <${process.env.EMAIL_USERNAME}>`,
        to: user.email,
        subject: `Added to Room: ${room.name}`,
        text: message,
      });
      console.log(`✅ Participant email sent to ${user.email}`);
    }
  } catch (err) {
    console.error('❌ Error sending participant notification:', err);
  }
};

// ✅ Notify all participants when a new expense is added
export const sendExpenseNotification = async (expense, room, paidByUser) => {
  try {
    const populatedParticipants = await Promise.all(
      expense.participants.map(async (id) => await User.findById(id))
    );

    const share = (expense.amount / expense.participants.length).toFixed(2);
    const dateStr = moment(expense.createdAt).format("MMMM Do YYYY, h:mm A");

    const settlementRows = populatedParticipants
      .filter(p => p._id.toString() !== paidByUser._id.toString())
      .map(p => `
        <tr>
          <td>${p.name}</td>
          <td>${paidByUser.name}</td>
          <td>₹${share}</td>
        </tr>
      `).join('');

    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>💸 New Expense in Room: ${room.name}</h2>

        <p><strong>Expense:</strong> ${expense.description}</p>
        <p><strong>Paid By:</strong> ${paidByUser.name}</p>
        <p><strong>Date:</strong> ${dateStr}</p>
        <p><strong>Total Amount:</strong> ₹${expense.amount}</p>
        <p><strong>Category:</strong> ${expense.category}</p>

        <h3>👥 Participants</h3>
        <ul>
          ${populatedParticipants.map(p => `<li>${p.name} (${p.email || p.phone})</li>`).join('')}
        </ul>

        <h3>🧾 Settlement</h3>
        <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; margin-top: 10px;">
          <thead style="background-color: #f0f0f0;">
            <tr>
              <th>From</th>
              <th>To</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            ${settlementRows}
          </tbody>
        </table>

        <p style="margin-top: 30px;">Thank you for using <strong>Splitara by Nithin</strong> 🙌</p>
        <small style="color: gray;">Please do not reply to this automated email.</small>
      </div>
    `;

    const receivers = populatedParticipants
      .filter(p => p._id.toString() !== paidByUser._id.toString() && p.email)
      .map(p => p.email);

    for (const email of receivers) {
      await transporter.sendMail({
        from: `"Room Expense Splitter" <${process.env.EMAIL_USERNAME}>`,
        to: email,
        subject: `💸 New Expense in "${room.name}"`,
        html,
      });
    }

    console.log(`✅ Expense notification sent to ${receivers.length} participants`);
  } catch (err) {
    console.error('❌ Error sending expense notification:', err);
  }
};
