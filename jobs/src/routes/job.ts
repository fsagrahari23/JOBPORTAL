import express from "express"
import { createCompany, createJob, deleteCompany, getAllActiveJobs, getAllApplicationForJob, getAllCompany, getAllJob, getCompanyDetails, getSingleJob, updateApplicationStatus, updateJob } from "../controllers/job.js";
import { isAuth } from "../middlewares/auth.js";
import uploadFile from "../middlewares/multer.js";

const router = express.Router()

router.post("/company/create", isAuth, uploadFile, createCompany)
router.delete("/company/delete/:companyId", isAuth, deleteCompany)
router.get("/company/all", isAuth, getAllCompany)
router.get("/company/:id", isAuth, getCompanyDetails)
router.post("/create", isAuth, createJob)
router.post("/update/:jobId", isAuth, updateJob)
router.get("/all", getAllActiveJobs)
router.get("/:id", getSingleJob)

router.get("/application/:jobId", isAuth, getAllApplicationForJob)
router.put("/application/update/:id", isAuth, updateApplicationStatus)


export default router;