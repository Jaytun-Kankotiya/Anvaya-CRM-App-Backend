import express from 'express'
import  dotenv  from 'dotenv'
import cors from 'cors'
import  {initializedata}  from './config/db.connect.js'
import leadRouter from './routes/leadRoute.js'
import salesAgentRouter from './routes/salesAgentRoute.js'
import commentRouter from './routes/commentRoute.js'
import reportRouter from './routes/reportRouter.js'
import authRouter from './routes/authRoute.js'
import cookieParser from 'cookie-parser'
import userRouter from './routes/userRoute.js'

dotenv.config()

const app = express()
app.use(express.json())
app.use(cookieParser())

const allowedOrigins = ['http://localhost:5173', 'https://anvaya-crm-app-frontend.vercel.app']

// const corsOptions = {
//     origin: allowedOrigins,
//     credentials: true,
//     optionsSuccessStatus: 200
// }
// app.use(cors(corsOptions))

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  optionsSuccessStatus: 200
}));

await initializedata()


// api endpoints

app.use('/v1/user', userRouter)

app.use('/v1/leads', leadRouter)

app.use('/v1/agents', salesAgentRouter)

app.use('/v1/leads', commentRouter)

app.use('/v1/report', reportRouter)

app.use('/v1/auth', authRouter)



app.get('/', (req, res) => {
    res.send('API Working')
})

const port = 3000
app.listen(port, (req, res) => {
    console.log("Server connected on", `http://localhost:${port}`)
})

