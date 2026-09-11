const User = require("../models/User");
const Otp = require("../models/Otp");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const validator = require("validator");

const createToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// Генерация OTP
const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Отправка OTP на email
const sendOtpEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_APP_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP code is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);
};

// Регистрация с OTP
exports.signup = async (req, res) => {
    const { name, email, password, otp } = req.body;

    try {
        if (!name || !email || !password || !otp) {
            return res.status(400).json({ error: "All fields are required" });
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ error: "Invalid email" });
        }
        if (!validator.isStrongPassword(password)) {
            return res.status(400).json({ error: "Password is not strong enough" });
        }

        // Проверка OTP
        const otpRecord = await Otp.findOne({ email });
        if (!otpRecord || otpRecord.otp !== otp || otpRecord.expiresAt < new Date()) {
            return res.status(400).json({ error: "Invalid or expired OTP" });
        }

        // Создание пользователя
        const user = await User.create({ name, email, password });
        const token = createToken(user._id);

        // Удаление использованного OTP
        await Otp.deleteOne({ email });

        res.status(201).json({ user, token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Логин
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const token = createToken(user._id);
        res.status(200).json({ user, token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Генерация и отправка OTP
exports.generateOtp = async (req, res) => {
    const { email } = req.body;

    try {
        if (!validator.isEmail(email)) {
            return res.status(400).json({ error: "Invalid email" });
        }

        const otp = generateOtp();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP действителен 10 минут

        await Otp.findOneAndUpdate(
            { email },
            { otp, expiresAt },
            { upsert: true, new: true }
        );

        await sendOtpEmail(email, otp);

        res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};