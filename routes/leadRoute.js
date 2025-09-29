import express from 'express'
import { addLead, deleteLead, getAllLeads, updateLead } from '../controllers/leadController.js'
import multer from 'multer'

const leadRouter = express.Router()

leadRouter.post('/add',  addLead)
leadRouter.get('/', getAllLeads)
leadRouter.put('/:id', updateLead)
leadRouter.delete('/:id', deleteLead)


export default leadRouter