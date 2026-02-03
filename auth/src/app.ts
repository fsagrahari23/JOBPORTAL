import express from 'express'
import authRouter from './routes/auth.js'
import { connectKafka } from './config/producer.js'


const app = express()
app.use(express.json())
connectKafka()
app.use('/api/auth', authRouter)
app.get('/api/auth/health', (req,res) => res.send('auth service is healthy...'))


export default app



