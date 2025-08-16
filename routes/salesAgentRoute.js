import express from "express";
import { addSalesAgent } from "../controllers/salesAgentController.js";

const salesAgentRouter = express.Router()

salesAgentRouter.post('/add', addSalesAgent)

export default salesAgentRouter