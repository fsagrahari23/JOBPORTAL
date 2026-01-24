import express from 'express'
import dotnev from 'dotenv'
import userRouter from "./routes/payment.js"

dotnev.config()


const app = express()
app.use(express.json())


app.use('/api/user', userRouter)

app.listen(process.env.PORT, () => {
    console.log(`User service is running on http://localhost:${process.env.PORT}`)
})