import express from 'express'
import  dotenv  from 'dotenv'
import cors from 'cors'
import  {initializedata}  from './config/db.connect.js'
import leadRouter from './routes/leadRoute.js'
import salesAgentRouter from './routes/salesAgentRoute.js'

dotenv.config()

const app = express()
app.use(express.json())


const corsOptions = {
    origin: "*",
    credentials: true,
    optionSuccessStatus: 200
}
app.use(cors(corsOptions))

await initializedata()


// api endpoints

app.use('/api/leads', leadRouter)


app.use('/v1/agents', salesAgentRouter)




app.get('/', (req, res) => {
    res.send('API Working')
})

const port = 3000
app.listen(port, (req, res) => {
    console.log("Server connected on", `http://localhost:${port}`)
})

