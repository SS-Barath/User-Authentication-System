const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");
const transporter = require("../config/email.js");

const signup = async(req, res) => {
    try {
        const {name,email,password} = req.body;

        if(!name || !email || !password) {
            return res.status(400).json({error: "Name, email, password cannot be empty!"});
        };
        
        const existingUser = await User.findOne({where: {email}});

        if(existingUser){
            return res.status(400).json({message: "User already exists"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({message: "User registered successfully!"});
    }catch(error){
        console.error(error);
        res.status(500).json({message: "Server error"});
    }
};

const signin = async (req,res) => {
    try {
        const {email,password} = req.body;

        const user = await User.findOne({where: {email}});
        if(!user){
            return res.status(400).json({message: "Invalid password"});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message: "Invalid password"});
        }

        const token = jwt.sign(
            {userId: user.id, role: user.role},
            process.env.JWT_SECRET,
            {expiresIn: "1d"}
        );

        res.json({message: "Login successfully!",token});
    }catch(error){
        console.error(error);
        res.status(500).json({message: "Server Error"});
    }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({
      where: { email }
    });

    if (!user) {
      return res.status(200).json({
        message: "If this email exists, a reset link has been sent."
      });
    }

    const resetToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_RESET_SECRET,
      { expiresIn: "15m" }
    );

    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    //Send email
    await transporter.sendMail({
      from: `"Authify" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: 'Reset your password',
      html: `
        <div style="font-family: Inter, sans-serif; max-width: 480px; margin: auto; padding: 32px; background: #0f0f1a; color: #fff; border-radius: 16px;">
          <h2 style="color: #6366f1; margin-bottom: 8px;">Reset your password</h2>
          <p style="color: #ffffff99; margin-bottom: 24px;">This link expires in <strong style="color:#fff">15 minutes</strong>.</p>
          <a href="${resetLink}" 
             style="display:inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 12px 28px; border-radius: 10px; text-decoration: none; font-weight: 600;">
            Reset Password
          </a>
          <p style="color: #ffffff40; font-size: 12px; margin-top: 24px;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    });

    return res.status(200).json({
      message: "If this email exists, a reset link has been sent."
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: "Missing data" });
    }

    const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET);

    if (!decoded.userId) {
      return res.status(400).json({ message: "Invalid token payload" });
    }

    const user = await User.findOne({
      where: { id: decoded.userId }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashed = await bcrypt.hash(password, 10);

    await user.update({ password: hashed });

    return res.status(200).json({ message: "Password updated" });

  } catch (err) {
    console.error("RESET ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { signup, signin, resetPassword, forgotPassword};