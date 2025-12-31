import express from 'express'
import { addSkillToUser, applyForJob, deleteSkillFromUser, getAllApplication, myProfile, updatedUserProfile, updateProfilePic, updateResume, userProfile } from '../controllers/user.js';
import { isAuth } from '../middlewares/auth.js';
import uploadFile from '../middlewares/multer.js';

const router = express.Router()


router.get("/me", isAuth, myProfile);
router.get("/:userId", isAuth, userProfile);
router.put("/update", isAuth, updatedUserProfile);
router.put("/update/image", uploadFile, isAuth, updateProfilePic);
router.put("/update/resume", uploadFile, isAuth, updateResume);
router.post("/skill/add", isAuth, addSkillToUser)
router.delete("/skill/delete", isAuth, deleteSkillFromUser)
router.post("/apply", isAuth, applyForJob)
router.get("/applications/all", isAuth, getAllApplication)
export default router;