const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const poll = require("../../config/db");
const randomstring = require("randomstring");
const bcrypt = require("bcrypt");


// Utility function to send a reset email
const sendResetEmail = async (email, resetLink) => {
  const transporter = nodemailer.createTransport({
    host: process.env.hostname,
    port: process.env.port,
    secure: true,
    auth: {
        user: process.env.user,
        pass: process.env.pass
    }
  });

  const mailOptions = {
    from: process.env.user,
    to: email,
    subject: "Password Reset Request",
    text: `Click the following link to reset your password: ${resetLink}`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending reset email:", error);
  }
};

// Step 3: Generate a reset token and send a reset email
const forgetPassword = async (req, res) => {

  const { email } = req.body;
  try {
    const query = "SELECT * FROM users WHERE email = ?";
    const values = [email];

    poll.query(query, values, async (err, result) => {
      if (err) {
        console.error("Error executing SQL query:", err);
        return res.status(500).json({ message: "Internal server error" });
      }
      if (result.length === 0) {
        return res.status(401).json({ message: "User not exits" });
      }
      const user = result[0];
      const userId = user.id;

      // Generate a reset token and save it to the user's record
      const resetToken = randomstring.generate({
        length: 12,
        charset: "alphanumeric",
      });

      const query = "INSERT INTO reset_password (user_id, reset_token) VALUES (?, ?)";
      const values = [userId, resetToken];

      poll.query(query, values, async (err, result) => {
        if (err) {
          console.error("Error executing SQL query:", err);
          return res.status(500).json({ message: "Internal server error" });
        }
        // Send a reset email to the user
        const resetLink = `${process.env.APP_URL}/reset-password?token=${resetToken}`;
        await sendResetEmail(email, resetLink);

        res.json({ message: "Password reset email sent" });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Step 5: Handle the password reset form submission
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const query = 'SELECT * FROM reset_password WHERE reset_token = ?'
    const values = [token]
    poll.query(query, values, async (err, result) => {
        if(err){
            console.error("Error executing SQL query:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
        if (result.length === 0) {
            return res.status(401).json({ message: "Invalid request" });
          }
        const reset_token = result[0];
        const userId = reset_token.user_id;

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const query = 'UPDATE users SET password = ? WHERE id = ?'
        const values = [hashedPassword, userId]
        console.log(hashedPassword, userId)

        // Update the user's password and clear the reset token
        poll.query(query, values, (err, result) => {
            if (err){
                console.error("Error executing SQL query:", err);
                return res.status(500).json({ message: "Internal server error" });
            }

            res.json({ message: "Password reset successfully", result });
        })
    })
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  forgetPassword,
  resetPassword,
};
