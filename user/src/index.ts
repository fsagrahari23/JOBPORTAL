import express from 'express'
import dotnev from 'dotenv'
import userRouter from "./routes/user.js"

dotnev.config()


const app = express()
app.use(express.json())


app.use('/api/user', userRouter)
app.get('/api/user/health', (req,res) => res.send('user service is healthy...'))

app.listen(process.env.PORT, () => {
    console.log(`User service is running on http://localhost:${process.env.PORT}`)
})