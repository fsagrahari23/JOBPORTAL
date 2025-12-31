import axios from "axios";
import getBuffer from "../config/buffer.js";
import { sql } from "../config/db.js";
import ErrorHandler from "../config/errorHandler.js";
import { TryCatch } from "../config/tryCatch.js";
import jwt from 'jsonwebtoken'
import bcrypt, { hash } from 'bcrypt'
import { forgotPasswordTemplate } from "../utils/forgotPasswordEmail.js";
import { publishToTopic } from "../config/producer.js";
import { redisclient } from "../index.js";

export const registerUser = TryCatch(async (req, res, nex) => {
    const { name, email, password, phoneNumber, role, bio } = req.body;

    if (!name || !email || !password || !role || !phoneNumber) {
        throw new ErrorHandler(400, "Please fill all the details")
    }

    const existingUser = await sql`SELECT user_id FROM users WHERE email = ${email}`

    if (existingUser.length > 0) {
        throw new ErrorHandler(409, "User already exists with this email")
    }

    const hashPassword = await bcrypt.hash(password, 10)

    let registerdUser;

    if (role == "recruiter") {
        const [user] = await sql`INSERT INTO users (name,email,password,phone_number,role,bio) VALUES
        (${name},${email},${hashPassword},${phoneNumber},${role},${bio}) RETURNING user_id,name,email,role,phone_number, created_at`;

        registerdUser = user;
    } else if (role == 'jobseeker') {
        const file = req.file;
        if (!file) {
            throw new ErrorHandler(400, "Resume file is reuiqred for jobseeker")
        }

        const fileBuffer = getBuffer(file)
        if (!fileBuffer || !fileBuffer.content) {
            throw new ErrorHandler(500, "Failed to generate buffer")
        }

        const { data } = await axios.post(`${process.env.UPLOAD_SERVICE}/api/utils/upload`, { buffer: fileBuffer.content })


        const [user] = await sql`INSERT INTO users (name,email,password,phone_number,role,bio,resume_public_id,resume) VALUES
        (${name},${email},${hashPassword},${phoneNumber},${role},${bio},${data.public_id},${data.url}) RETURNING user_id,name,email,role,phone_number, created_at,bio,resume`;

        registerdUser = user;
    }

    const token = jwt.sign({ id: registerdUser?.user_id }, process.env.JWT_SECRET as string, {
        expiresIn: '15d'
    })

    res.json({
        message: "User Registered successfully",
        registerdUser,
        token
    })
})


export const loginUser = TryCatch(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new ErrorHandler(400, "Email and password are required")
    }
    const user = await sql`
     SELECT u.user_id,u.name,u.email,u.password, u.phone_number,u.role,u.bio,u.resume,u.profile_pic,u.subscription,ARRAY_AGG(s.name) FILTER (WHERE s.name IS NOT NULL) as skills FROM users u LEFT JOIN user_skills us ON u.user_id = us.user_id LEFT JOIN skills s on us.skill_id = s.skill_id
     WHERE u.email = ${email} GROUP BY u.user_id;
    `;
    if (user.length === 0) {
        throw new ErrorHandler(400, "Invalid credentials")
    }
    const userObject = user[0]
    const matchPassword = await bcrypt.compare(password, userObject.password);

    if (!matchPassword) {
        throw new ErrorHandler(400, "Invalid credentials")
    }
    userObject.skills = userObject.skills || [];
    delete userObject.password
    const token = jwt.sign({ id: userObject?.user_id }, process.env.JWT_SECRET as string, {
        expiresIn: '15d'
    })
    res.json({
        message: "User Logged in successfully",
        userObject,
        token
    })

})

export const forgotPassword = TryCatch(async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        throw new ErrorHandler(400, "email is required")
    }

    const users = await sql`SELECT user_id,email FROM users WHERE email=${email}`;

    if (users.length === 0) {
        return res.json({
            message: "if that email exists , we have sent a reset link"
        })
    }

    const user = users[0];

    const resetToken = jwt.sign({
        email: user.email,
        type: "Reset"
    }, process.env.JWT_SECRET as string, {
        expiresIn: "15m"
    })
    const resetlink = `${process.env.FRONTEND_URL}/reset/${resetToken}`;
    await redisclient.set(`forgot:${email}`, resetToken, {
        EX: 900
    })
    const message = {
        to: email,
        subject: "RESET Your Password - hireheaven",
        html: forgotPasswordTemplate(resetlink)
    }
    publishToTopic("send-email", message).catch((err) => {
        console.log("failed to send message", err)
    })
    res.json({
        message: "If that email exists , we have sent a reset link"
    })

})

export const resetPassword = TryCatch(async (req, res, next) => {
    const { token } = req.params;
    const { password } = req.body;
    let decoded: any;
    try {
        decoded = await jwt.verify(token, process.env.JWT_SECRET as string)
    } catch (err) {
        throw new ErrorHandler(400, "Expired token");
    }

    if (decoded.type !== "Reset") {
        throw new ErrorHandler(400, "Invalid token type")
    }
    const email = decoded.email;

    const storedToken = await redisclient.get(`forgot:${email}`)
    if (!storedToken || storedToken !== token) {
        throw new ErrorHandler(400, "token has been expired")
    }

    const users = await sql`SELECT user_id FROM users where email=${email} `

    if (users.length === 0) {
        throw new ErrorHandler(404, "User not found")
    }
    const user = users[0];

    const hashedPassword = await bcrypt.hash(password, 10)

    await sql`UPDATE users SET password=${hashedPassword} WHERE user_id=${user.user_id}`

    await redisclient.del(`forgot:${email}`)

    res.json({
        message: "Password changed successfully"
    })
})

