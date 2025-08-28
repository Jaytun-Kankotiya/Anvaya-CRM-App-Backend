import { error } from 'console'
import salesAgentModel from '../models/salesAgentModel.js'
import mongoose from 'mongoose'


const isValidEmail = (email) => {
    if(typeof email !== "string") return false
    if(!email.includes('@') || !email.includes('.')) return false
    const atIndex = email.indexOf('@')
    const dotIndex = email.indexOf('.')

    if(atIndex > dotIndex) return false

    return true
}

const addSalesAgent = async (req, res) => {
    try {
        const {name, email} = req.body

        if(!name || !email || !isValidEmail(email))
            return res.status(400).json({error: "Invalid input: 'email' must be a valid email address."})

        const existing = await salesAgentModel.findOne({email})
        if(existing){
            return res.status(400).json({error: `Sales agent with email ${email} already exists.`})
        }

        const newAgent = new salesAgentModel({name, email})
        const savedAgent = await newAgent.save()

        res.status(201).json({
            id: savedAgent._id,
            name: savedAgent.name,
            email: savedAgent.email,
            createdAt: savedAgent.createdAt
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Internal server error."})
    }
}

const getAllSalesAgent = async (req, res) => {
    try {
        const salesAgentsList = await salesAgentModel.find()
        if(!salesAgentsList) {
            return res.status(400).json({error: "Error fetching Sales Agents List."})
        }
        res.status(200).json({success: true, message: "Sales Agents List", salesAgentsList})
    } catch (error) {
        res.status(500).json({error: "Sales Agents List not found."})
    }
}

export {addSalesAgent, getAllSalesAgent}