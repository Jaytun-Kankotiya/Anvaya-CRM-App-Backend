import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../config/nodemailer.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(404).json({ success: false, message: "Missing Detailes" });
  }

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new userModel({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: `Welcome to Anvaya CRM App.`,
      text: `Welcome to Anvaya CRM App. Your account has been created with email: ${email}`
    };
    await transporter.sendMail(mailOption);

    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({
      success: false,
      message: "Email and password are required",
    });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "Invalid Email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400)
        .json({ success: false, message: "Invalid Password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ success: true, message: user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.json({ success: true, message: "Logged Out" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// send verification OTP to the User's Email
export const sendVerificationOtp = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await userModel.findById(userId);
    if (user.isAccountVerified) {
      return res.json({ success: false, message: "Account Already verified" });
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

    await user.save();

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: `Your Account Verification OTP`,
      html: `
    <div style="font-family: 'Helvetica', 'Arial', sans-serif">
      <h2 style="color: #101010ff;">Hello ${user.name || ""},</h2>
      <p>Thank you for signing up on <strong>Anvaya CRM</strong>.</p>
      <p>Your <strong>One-Time Password (OTP)</strong> to verify your account is:</p>
      <h1 style="color: #222222ff;">${otp}</h1>
      <p>This OTP is valid for <strong>24 hours</strong>.</p>
      <p>Please do not share this OTP with anyone.</p>
      <hr>
      <p style="font-size: 12px; color: #777;">
        If you did not request this OTP, please ignore this email.
      </p>
    </div>
  `,
    };
    await transporter.sendMail(mailOption);

    return res.json({ success: true, message: "Verification OTP sent on Email" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  const { otp} = req.body;
  const userId = req.userId;

  if (!userId || !otp) {
    return res.json({ success: false, message: "Missing Details" });
  }

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.verifyOtp === "" || user.verifyOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (user.verifyOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP Expired" });
    }

    user.isVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;

    await user.save();

    return res.json({ success: true, message: "Email Verified successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const isAuthenticated = async (req, res) => {
    try {
        return res.json({success: true})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

// send OTP to Reset Password

export const sendResetOtp = async (req, res) => {
    const {email} = req.body
    if(!email) {
        return res.json({success: false, message: "Email is required"})
    }

    try {
        const user = await userModel.findOne({email})
        if(!user) {
            return res.json({success: false, message: 'User not found'})
        }


    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() +  15 * 60 * 1000;

    await user.save();

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: `Your Password Reset OTP`,
      html: `
    <div style="font-family: 'Helvetica', 'Arial', sans-serif;">
      <h2 style="color: #101010ff;">Hello ${user.name || ""},</h2>
      <p>We received a request to reset your password for your <strong>Anvaya CRM</strong>.</p>
      <p>Your <strong>Password Reset One-Time Password (OTP)</strong> is:</p>
      <h1 style="color: #222222ff;">${otp}</h1>
      <p>This OTP is valid for <strong>15 minutes</strong>.</p>
      <p>Please do not share this OTP with anyone.</p>
      <hr>
      <p style="font-size: 12px; color: #777;">
        If you did not request this OTP, please ignore this email.
      </p>
      <p style="font-size: 12px; color: #777;">
        &copy; 2025 Anvaya CRM. All rights reserved.
      </p>
    </div>
  `,
    };
    await transporter.sendMail(mailOption);

    return res.json({success: true, message: 'Password Reset OTP has been sent to your email'})

    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

export const verifyResetOtp = async (req, res) => {
    const {otp, email} = req.body
        if(!otp || !email) {
            return res.json({success: false, message: "Email and OTP are required"})
        }
    try {
        const user = await userModel.findOne({email})
        if(!user) {
            return res.json({success: false, message: 'User not found'})
        }
        if(!user.resetOtp || String(user.resetOtp) !== String(otp)){
            return res.json({success: false, message: 'Invalid OTP'})
        }

        if(user.resetOtpExpireAt < Date.now()) {
            return res.json({success: false, message: 'OTP Expired'})
        }
        user.resetOtp = ''
        user.resetOtpExpireAt = 0
        await user.save()
        return res.json({success: true, message: "OTP Verified Successfully"})
    } catch (error) {
        return res.json({success: false, message: error.message})
    }
}

// Reset User Password

export const resetPassword = async (req, res) => {
    const {email, newPassword} = req.body

    if(!email || !newPassword){
        return res.json({success: false, message: 'Email, OTP, and new password are required'})
    }

    try {
        const user = await userModel.findOne({email})
        if(!user) {
            return res.json({success: false, message: 'User not found'})
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashedPassword

        await user.save()
        return res.json({success: true, message: 'Password has been reset successfully. Please Login to your account'})

    } catch (error) {
        res.json({success: false, message: error.message})
    }
}
