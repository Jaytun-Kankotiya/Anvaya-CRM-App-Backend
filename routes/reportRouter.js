import express from "express";
import { getLeadsClosedLastWeek, getTotalLeadsInPipeline } from "../controllers/reportController.js";


const reportRouter = express.Router()

reportRouter.get('/last-week', getLeadsClosedLastWeek)
reportRouter.get('/pipeline', getTotalLeadsInPipeline)

export default reportRouter