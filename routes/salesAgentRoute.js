import express from "express";
import { addSalesAgent, getAllSalesAgent } from "../controllers/salesAgentController.js";

const salesAgentRouter = express.Router()

salesAgentRouter.post('/', addSalesAgent)
salesAgentRouter.get('/', getAllSalesAgent)

export default salesAgentRouter