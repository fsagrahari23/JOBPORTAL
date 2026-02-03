
import express from 'express'
import jobRoutes from "./routes/job.js"

export const app = express();
app.use(express.json())
app.use("/api/job", jobRoutes)
app.get('/api/jobs/health', (req,res) => res.send('job service is healthy...'))



