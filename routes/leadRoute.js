import express from 'express'
import { addLead } from '../controllers/leadController.js'
import multer from 'multer'

const leadRouter = express.Router()


// const storage = multer.diskStorage({
//     destination: "uploads",
//     filename: (req, file, cb) => {
//         return cb(null, `${Date.now()}${file.originalname}`)
//     }
// })

// const upload = multer({storage: storage})

leadRouter.post('/add',  addLead)


export default leadRouter