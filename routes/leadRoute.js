import express from 'express'
import { addLead, deleteLead, getAllLeads, updateLead } from '../controllers/leadController.js'
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
leadRouter.get('/', getAllLeads)
leadRouter.put('/:id', updateLead)
leadRouter.delete('/:id', deleteLead)


export default leadRouter