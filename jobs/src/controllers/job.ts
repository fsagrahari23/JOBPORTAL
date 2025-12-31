import axios from "axios";
import getBuffer from "../config/buffer.js";
import { sql } from "../config/db.js";
import ErrorHandler from "../config/errorHandler.js";
import { TryCatch } from "../config/tryCatch.js";
import { AuthenticatedRequest } from "../middlewares/auth.js";
import dotenv from "dotenv"
import { applicationStatusUpdateTemplate } from "../utils/applicationMailUpdationTemp.js";
import { publishToTopic } from "../config/producer.js";

dotenv.config()

export const createCompany = TryCatch(async (req: AuthenticatedRequest, res) => {
    const user = req.user;
    if (!user) {
        throw new ErrorHandler(401, "Authentication requires")
    }

    if (user?.role !== "recruiter") {

        throw new ErrorHandler(403, "Forbidden: Only recriter can create company")
    }

    const { name, description, website } = req.body;
    if (!name || !description || !website) {
        throw new ErrorHandler(400, "All the fields are required")
    }

    const existingCompanies = await sql`
    SELECT company_id FROM companies WHERE name = ${name}`;

    if (existingCompanies.length > 0) {
        throw new ErrorHandler(409, "Company already exists with this name")
    }

    const file = req.file;
    if (!file) {
        throw new ErrorHandler(400, "Company Logo file is required");
    }
    const fileBuffer = getBuffer(file);
    if (!fileBuffer || !fileBuffer.content) {
        throw new ErrorHandler(400, "File buffer is not created");
    }

    const { data } = await axios.post<{ url: string, public_id: string }>(`${process.env.UPLOAD_SERVICE}/api/utils/upload`, {
        buffer: fileBuffer.content
    })

    const [newCompany] = await sql`
    INSERT INTO companies(name,description,website,logo,logo_public_id,recruiter_id) VALUES (${name},${description},${website},${data.url},${data.public_id},${user.user_id}) RETURNING *`;

    res.json({
        message: "Comapany created successfully",
        company: newCompany,
    })

})


export const deleteCompany = TryCatch(async (req: AuthenticatedRequest, res) => {
    const user = req.user;

    const { companyId } = req.params;

    const [company] = await sql`SELECT logo_public_id FROM companies WHERE company_id=${companyId} AND recruiter_id=${user?.user_id}`


    if (!company) {
        throw new ErrorHandler(404, "Company does not exist or you are recuiter for this company")
    }

    await sql`
    DELETE FROM companies WHERE company_id=${companyId}`


    res.json({
        message: "Company and all Assoicated jobs have been deleted"
    })

})

export const createJob = TryCatch(async (req: AuthenticatedRequest, res) => {
    const user = req.user;
    if (!user) {
        throw new ErrorHandler(401, "Authentication requires")
    }

    if (user?.role !== "recruiter") {

        throw new ErrorHandler(403, "Forbidden: Only recriter can create job")
    }
    const { title, description, salary, location, role, job_type, workLocation, companyId, openings } = req.body;

    if (!title || !description || !salary || !location || !role || !job_type || !workLocation || !companyId || !openings) {
        throw new ErrorHandler(400, "All the feilds are required")
    }

    const [Comapany] = await sql`SELECT company_id FROM companies WHERE company_id=${companyId} AND recruiter_id=${user.user_id}`


    if (!Comapany) {
        throw new ErrorHandler(404, "Company not found ")
    }

    const [newJob] = await sql`
    INSERT INTO jobs ( title, description, salary, location, role, job_type, wrok_location, company_id, posted_by_recruiter_id,openings) VALUES(${title},${description},${salary},${location},${role},${job_type},${workLocation},${companyId},${user.user_id},${openings} )RETURNING *
    `;

    res.json({
        message: "Job posted succesfully",
        job: newJob
    })




})

export const updateJob = TryCatch(async (req: AuthenticatedRequest, res) => {
    const user = req.user;

    if (!user) {
        throw new ErrorHandler(401, "Authentication required");
    }

    if (user.role !== "recruiter") {
        throw new ErrorHandler(403, "Only recruiters can update jobs");
    }

    const { jobId } = req.params;


    const [oldJob] = await sql`
    SELECT *
    FROM jobs
    WHERE job_id = ${jobId}
  `;

    if (!oldJob) {
        throw new ErrorHandler(404, "Job does not exist");
    }

    // ✅ Ownership check
    if (oldJob.posted_by_recruiter_id !== user.user_id) {
        throw new ErrorHandler(403, "You are not allowed to update this job");
    }


    const {
        title,
        description,
        salary,
        location,
        role,
        job_type,
        workLocation,
        openings,
        is_active
    } = req.body ?? {};

    const [updatedJob] = await sql`
    UPDATE jobs
    SET
      title = ${title ?? oldJob.title},
      description = ${description ?? oldJob.description},
      salary = ${salary ?? oldJob.salary},
      location = ${location ?? oldJob.location},
      role = ${role ?? oldJob.role},
      job_type = ${job_type ?? oldJob.job_type},
      wrok_location = ${workLocation ?? oldJob.wrok_location},
      openings = ${openings ?? oldJob.openings},
      is_active = ${is_active ?? oldJob.is_active}
    WHERE job_id = ${jobId}
    RETURNING *
  `;

    res.status(200).json({
        message: "Job updated successfully",
        job: updatedJob
    });
});
export const getAllCompany = TryCatch(async (req: AuthenticatedRequest, res) => {
    const user = req.user;

    if (!user) {
        throw new ErrorHandler(401, "Authentication required");
    }

    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Number(req.query.limit) || 10, 50);
    const offset = (page - 1) * limit;

    // ✅ Fetch paginated companies
    const companies = await sql`
    SELECT
      company_id,
      name,
      description,
      website,
      logo,
      logo_public_id,
      created_at
    FROM companies
    WHERE recruiter_id = ${user.user_id}
    ORDER BY created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `;

    // ✅ Total count
    const [{ count }] = await sql`
    SELECT COUNT(*)::int AS count
    FROM companies
    WHERE recruiter_id = ${user.user_id}
  `;

    res.status(200).json({
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
        companies
    });
});


export const getCompanyDetails = TryCatch(async (req: AuthenticatedRequest, res) => {
    const { id } = req.params;

    if (!id) {
        throw new ErrorHandler(400, "Company id is required")
    }

    const [companyData] = await sql`SELECT c.*,COALESCE (
        (
            SELECT json_agg(j.*) FROM jobs j WHERE j.company_id=c.company_id
        ),
        '[]'::json
    )AS jobs FROM companies c WHERE company_id=${id} GROUP BY c.company_id;`

    if (!companyData) {
        throw new ErrorHandler(404, "Company not found")
    }

    res.json({
        companyData
    })
})

export const getAllJob = TryCatch(async (req: AuthenticatedRequest, res) => {
    const user = req.user;

    if (!user) {
        throw new ErrorHandler(401, "Authentication required");
    }

    if (user.role !== "recruiter") {
        throw new ErrorHandler(403, "Only recruiters can view their jobs");
    }

    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Number(req.query.limit) || 10, 50);
    const offset = (page - 1) * limit;

    const jobs = await sql`
    SELECT
      j.job_id,
      j.title,
      j.salary,
      j.role,
      j.job_type,
      j.wrok_location,
      j.openings,
      j.is_active,
      j.created_at,

      c.company_id,
      c.name AS company_name,
      c.logo AS company_logo

    FROM jobs j
    JOIN companies c ON c.company_id = j.company_id
    WHERE j.posted_by_recruiter_id = ${user.user_id}
    ORDER BY j.created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `;

    const [{ count }] = await sql`
    SELECT COUNT(*)::int AS count
    FROM jobs
    WHERE posted_by_recruiter_id = ${user.user_id}
  `;

    res.status(200).json({
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
        jobs
    });
});



export const getAllJobForJobSeeker = TryCatch(async (req: AuthenticatedRequest, res) => {
    const user = req.user;

    if (!user) {
        throw new ErrorHandler(401, "Authentication required");
    }

    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Number(req.query.limit) || 10, 50);
    const offset = (page - 1) * limit;

    const {
        minSalary,
        maxSalary,
        role,
        workLocation,
        jobType
    } = req.query;

    const jobs = await sql`
    SELECT
      j.job_id,
      j.title,
      j.description,
      j.salary,
      j.location,
      j.role,
      j.job_type,
      j.wrok_location,
      j.openings,
      j.created_at,

      c.company_id,
      c.name AS company_name,
      c.logo AS company_logo

    FROM jobs j
    JOIN companies c ON c.company_id = j.company_id
    WHERE j.is_active = true

      ${minSalary ? sql`AND j.salary >= ${minSalary}` : sql``}
      ${maxSalary ? sql`AND j.salary <= ${maxSalary}` : sql``}
      ${role ? sql`AND j.role ILIKE ${'%' + role + '%'}` : sql``}
      ${jobType ? sql`AND j.job_type = ${jobType}` : sql``}
      ${workLocation ? sql`AND j.wrok_location = ${workLocation}` : sql``}

    ORDER BY j.created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `;

    const [{ count }] = await sql`
    SELECT COUNT(*)::int AS count
    FROM jobs j
    WHERE j.is_active = true
      ${minSalary ? sql`AND j.salary >= ${minSalary}` : sql``}
      ${maxSalary ? sql`AND j.salary <= ${maxSalary}` : sql``}
      ${role ? sql`AND j.role ILIKE ${'%' + role + '%'}` : sql``}
      ${jobType ? sql`AND j.job_type = ${jobType}` : sql``}
      ${workLocation ? sql`AND j.wrok_location = ${workLocation}` : sql``}
  `;

    res.status(200).json({
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
        jobs
    });
});


export const getAllActiveJobs = TryCatch(async (
    req: AuthenticatedRequest,
    res
) => {
    const {
        title,
        location,
        page = "1",
        limit = "10"
    } = req.query as {
        title?: string;
        location?: string;
        page?: string;
        limit?: string;
    };

    const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
    const pageSize = Math.min(parseInt(limit, 10) || 10, 50);
    const offset = (pageNumber - 1) * pageSize;

    let queryString = `
    SELECT
      j.job_id,
      j.title,
      j.description,
      j.salary,
      j.location,
      j.job_type,
      j.role,
      j.wrok_location,
      j.created_at,
      c.company_id,
      c.name AS company_name,
      c.logo AS company_logo
    FROM jobs j
    JOIN companies c ON j.company_id = c.company_id
    WHERE j.is_active = true
  `;

    const values: any[] = [];
    let paramIndex = 1;

    if (title) {
        queryString += ` AND j.title ILIKE $${paramIndex}`;
        values.push(`%${title}%`);
        paramIndex++;
    }

    if (location) {
        queryString += ` AND j.location ILIKE $${paramIndex}`;
        values.push(`%${location}%`);
        paramIndex++;
    }

    queryString += `
    ORDER BY j.created_at DESC
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
  `;

    values.push(pageSize, offset);

    const jobs = await sql.query(queryString, values) as any[];

    // ✅ total count (for pagination)
    let countQuery = `
    SELECT COUNT(*)::int AS count
    FROM jobs j
    WHERE j.is_active = true
  `;

    const countValues: any[] = [];
    let countIndex = 1;

    if (title) {
        countQuery += ` AND j.title ILIKE $${countIndex}`;
        countValues.push(`%${title}%`);
        countIndex++;
    }

    if (location) {
        countQuery += ` AND j.location ILIKE $${countIndex}`;
        countValues.push(`%${location}%`);
        countIndex++;
    }

    const [{ count }] = await sql.query(countQuery, countValues) as any[];

    res.status(200).json({
        page: pageNumber,
        limit: pageSize,
        total: count,
        totalPages: Math.ceil(count / pageSize),
        jobs
    });
});


export const getSingleJob = TryCatch(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        throw new ErrorHandler(400, "Job id is required");
    }

    const query = `
    SELECT
      j.job_id,
      j.title,
      j.description,
      j.salary,
      j.location,
      j.job_type,
      j.role,
      j.wrok_location,
      j.openings,
      j.created_at,

      c.company_id,
      c.name AS company_name,
      c.logo AS company_logo

    FROM jobs j
    JOIN companies c ON j.company_id = c.company_id
    WHERE j.is_active = true
      AND j.job_id = $1
  `;

    const [job] = await sql.query(query, [id]) as any[];

    if (!job) {
        throw new ErrorHandler(404, "Job not found");
    }

    res.status(200).json({ job });
});



export const getAllApplicationForJob = TryCatch(async (req: AuthenticatedRequest, res) => {
    const user = req.user;
    if (!user) {
        throw new ErrorHandler(401, "Authentication requires")
    }

    if (user?.role !== "recruiter") {

        throw new ErrorHandler(403, "Forbidden: Only recriter can create job")
    }

    const { jobId } = req.params;

    const [job] = await sql`SELECT posted_by_recruiter_id FROM jobs WHERE job_id = ${jobId}`;
    if (!job) {
        throw new ErrorHandler(404, "Job not found");
    }
    if (job.posted_by_recruiter_id != user.user_id) {
        throw new ErrorHandler(403, "Forbidden : you are not allowed")
    }

    const applications = await sql`
    SELECT * FROM applications WHERE job_id=${jobId} ORDER BY subscribed DESC, applied_at ASC`;


    res.json({
        applications
    })



})


export const updateApplicationStatus = TryCatch(async (req: AuthenticatedRequest, res) => {
    const user = req.user;
    if (!user) {
        throw new ErrorHandler(401, "Authentication requires")
    }

    if (user?.role !== "recruiter") {

        throw new ErrorHandler(403, "Forbidden: Only recriter can create job")
    }

    const { id } = req.params;

    const [application] = await sql`SELECT * FROM applications WHERE application_id=${id}`

    if (!application) {
        throw new ErrorHandler(404, "Application not found")
    }

    const [job] = await sql`SELECT posted_by_recruiter_id,title FROM jobs WHERE job_id=${application.job_id}`

    if (!job) {
        throw new ErrorHandler(404, "no job with this id")
    }

    if (job.posted_by_recruiter_id !== user.user_id) {
        throw new ErrorHandler(403, "Forbidden: You are not allowed")
    }

    const [updatedApplication] = await sql`UPDATE applications SET status=${req.body.status} WHERE applicant_id =${id} RETURNING *`

    const message = {
        to: application.applicant_email,
        subject: "Applicaiotn update - Job portal",
        html: applicationStatusUpdateTemplate(job.title)
    };

    publishToTopic("send-email", message).catch(error => {
        console.log("Failed to publcish message to kafka", error)
    })

    res.json({
        message: "Application updated",
        job,
        updatedApplication
    })
})