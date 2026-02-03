import express from 'express'
import dotenv from 'dotenv'
import uploadRouter from './routes.js'
import cors from 'cors'

import { v2 as cloudinary } from 'cloudinary';
import { startSendMailConsume } from './consumer.js';
dotenv.config()

startSendMailConsume();
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const app = express();

app.use(cors())
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ limit: "50mb", extended: true }))
app.use("/api/utils", uploadRouter)
app.get('/api/utils/health', (req,res) => res.send('util service is healthy...'))
app.listen(process.env.PORT, () => {
    console.log(`Utils Service is running on http://localhost:${process.env.PORT}`)
})