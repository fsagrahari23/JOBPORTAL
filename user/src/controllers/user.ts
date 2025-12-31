import axios from "axios";
import getBuffer from "../config/buffer.js";
import { sql } from "../config/db.js";
import ErrorHandler from "../config/errorHandler.js";
import { TryCatch } from "../config/tryCatch.js";
import { AuthenticatedRequest } from "../middlewares/auth.js";

export const myProfile = TryCatch(async (req: AuthenticatedRequest, res, next) => {
    const user = req.user;
    res.json(user)
})

export const userProfile = TryCatch(async (req, res, next) => {
    const { userId } = req.params;

    const users = await sql`
            SELECT u.user_id, u.name, u.email, u.phone_number,u.role,u.bio,u.resume,u.resume_public_id,u.profile_pic,u.profile_pic_public_id,u.subscription, ARRAY_AGG(s.name)FILTER (WHERE s.name IS NOT NULL)as skills FROM users u LEFT JOIN user_skills us ON u.user_id = us.user_id
            LEFT JOIN skills s ON us.skill_id=s.skill_id
            WHERE u.user_id = ${userId}
            GROUP BY u.user_id`;

    if (users.length === 0) {
        throw new ErrorHandler(404, "User not found")
    }

    const user = users[0];

    user.skills = user.skills || []

    res.json(user)
})


export const updatedUserProfile = TryCatch(async (req: AuthenticatedRequest, res, next) => {
    const user = req.user;
    if (!user) {
        throw new ErrorHandler(401, "Authentication required")
    }

    const { name, phoneNumber, bio } = req.body;
    const newName = name || user.name;
    const newPhoneNumber = phoneNumber || user.phone_number
    const newBio = bio || user.bio

    const [updateduser] = await sql`
   UPDATE users SET name = ${newName} , phone_number=${newPhoneNumber}, bio=${newBio} WHERE user_id=${user.user_id}
   RETURNING user_id,name,email,phone_number,bio
   `;

    res.json({
        message: "Profile updated successfuylly",
        updateduser,
    })

})

export const updateProfilePic = TryCatch(async (req: AuthenticatedRequest, res, next) => {
    const user = req.user;
    if (!user) {
        throw new ErrorHandler(401, "Authentication required")
    }
    const file = req.file;

    if (!file) {
        throw new ErrorHandler(400, "no image file has been provided")
    }

    const oldPublicId = user.profile_pic_public_id;
    const fileBuffer = getBuffer(file);

    if (!fileBuffer || !fileBuffer.content) {
        throw new ErrorHandler(500, "Failed to generate Buffer")
    }

    const { data: uploadResult } = await axios.post<{ url: string; public_id: string }>(`${process.env.UPLOAD_SERVICE}/api/utils/upload`, {
        buffer: fileBuffer.content,
        public_id: oldPublicId
    })

    const [updateduser] = await sql`
    UPDATE users SET profile_pic = ${uploadResult.url},profile_pic_public_id=${uploadResult.public_id} WHERE user_id=${user.user_id} RETURNING user_id,name,profile_pic
    `;

    res.json({
        message: "User image updated successfully",
        updateduser,
    })

})

export const updateResume = TryCatch(async (req: AuthenticatedRequest, res, next) => {
    const user = req.user;
    if (!user) {
        throw new ErrorHandler(401, "Authentication required")
    }
    const file = req.file;

    if (!file) {
        throw new ErrorHandler(400, "no resume file has been provided")
    }

    const oldPublicId = user.resume_public_id;
    const fileBuffer = getBuffer(file);

    if (!fileBuffer || !fileBuffer.content) {
        throw new ErrorHandler(500, "Failed to generate Buffer")
    }

    const { data: uploadResult } = await axios.post<{ url: string; public_id: string }>(`${process.env.UPLOAD_SERVICE}/api/utils/upload`, {
        buffer: fileBuffer.content,
        public_id: oldPublicId
    })

    const [updateduser] = await sql`
    UPDATE users SET resume = ${uploadResult.url},resume_public_id=${uploadResult.public_id} WHERE user_id=${user.user_id} RETURNING user_id,name,resume
    `;

    res.json({
        message: "User resume updated successfully",
        updateduser,
    })

})


export const addSkillToUser = TryCatch(async (req: AuthenticatedRequest, res, next) => {
    const userId = req.user?.user_id;
    const { skillName } = req.body;


    if (!skillName || skillName.trim() === "") {
        throw new ErrorHandler(400, "Please provide a skill name")
    }

    let wasSkillAdded = false;

    try {
        await sql`BEGIN`;
        const users = await sql`
     SELECT user_id FROM users WHERE user_id=${userId}`;
        if (users.length === 0) {
            throw new ErrorHandler(400, "user not found")
        }
        const [skill] = await sql`
        INSERT INTO skills (name) VALUES(${skillName.trim()}) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING skill_id`;

        const skilId = skill.skill_id;
        const insertionResult = await sql`
        INSERT INTO user_skills (user_id,skill_id) VALUES (${userId},${skilId}) ON CONFLICT (user_id,skill_id) DO NOTHING RETURNING user_id,skill_id`

        if (insertionResult.length > 0) {
            wasSkillAdded = true
        }

        await sql`COMMIT`;

    } catch (Err) {
        await sql`ROLLBACK`;
        throw Err;
    }

    if (!wasSkillAdded) {
        return res.status(200).json({
            message: "user already possess this skill"
        })
    }

    res.json({
        message: `Skill ${skillName.trim()} is addded successfully`
    });
})


export const deleteSkillFromUser = TryCatch(async (req: AuthenticatedRequest, res, next) => {
    const user = req.user;
    if (!user) {
        throw new ErrorHandler(401, "Not authorised")
    }
    const { skillName } = req.body;


    if (!skillName || skillName.trim() === "") {
        throw new ErrorHandler(400, "Please provide a skill name")
    }
    const result = await sql`DELETE FROM user_skills WHERE user_id = ${user.user_id} AND skill_id = (SELECT skill_id FROM skills WHERE name = ${skillName} ) RETURNING user_id;`


    if (result.length === 0) {
        throw new ErrorHandler(404, `Skill ${skillName} was not added`)
    }

    res.json({
        message: `Skill ${skillName.trim()} is deleted successfully`
    });
})


export const applyForJob = TryCatch(async (req: AuthenticatedRequest, res) => {
    const user = req.user;
    if (!user) {
        throw new ErrorHandler(401, "You are logged in")
    }

    if (user.role != "jobseeker") {
        throw new ErrorHandler(403, "Forbidden: You are not allowed to apply")
    }
    const resume = user.resume;
    if (!resume) {
        throw new ErrorHandler(400, "Resume not found in user profile")
    }
    const applicantId = user.user_id;

    const { job_id } = req.body;

    if (!job_id) {
        throw new ErrorHandler(400, "job id is required")
    }

    const [job] = await sql`SELECT is_active FROM jobs WHERE job_id=${job_id}`

    if (!job) {
        throw new ErrorHandler(404, "No jobs with this id")
    }

    if (!job.is_active) {
        throw new ErrorHandler(400, "Job is not active now ")
    }

    const now = Date.now();

    const subTime = req.user?.subscrption ? new Date(req.user.subscrption).getTime() : 0;

    const isSubscribed = subTime > now;

    let newApplication;

    try {
        [newApplication] = await sql`INSERT INTO applications(job_id,applicant_id,applicant_email,resume,subscribed) VALUES (${job_id},${applicantId},${user?.email},${resume},${isSubscribed})`
    } catch (error: any) {
        if (error.code === "23505") {
            throw new ErrorHandler(409, "You have already applied to this job")


        }
        throw error;
    }
    res.json({
        message: "Applied for job successfully",
        application: newApplication
    })

})


export const getAllApplication = TryCatch(async (req: AuthenticatedRequest, res) => {
    const applications = await sql`
    SELECT a.* ,j.title AS job_title,j.salary AS salary,j.location AS job_location FROm applications a JOIN jobs j ON a.job_id =j.job_id WHERE a.applicant_id=${req.user?.user_id}`

    res.json({
        applications
    })

})