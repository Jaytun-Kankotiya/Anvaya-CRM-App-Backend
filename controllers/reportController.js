import mongoose from "mongoose";
import leadModel from "../models/leadModel.js";

const getLeadsClosedLastWeek = async (req, res) => {
    try {
        const today = new Date()
        const lastweek = new Date(today)
        lastweek.setDate(today.getDate() - 7)

        const leads = await leadModel.find({
            status: "Closed",
            closedAt: {$gte: lastweek, $lte: today}
        }).populate("salesAgent", "name")

        if(leads.length === 0) {
            return res.status(404).json({message: "No leades closed in last 7 days."})
        }

        const formattedLeads = leads.map((lead) => ({
            id: lead._id,
            name: lead.name,
            salesAgent: lead.salesAgent.name,
            closedAt: lead.closedAt
        }))

        res.status(200).json(formattedLeads)
    } catch (error) {
        res.status(500).json({error: "Failed to fetch leads closed last week", details: error.message})
    }
}

const getTotalLeadsInPipeline = async (req, res) => {
    try {
        const totalLeadsInPipeline = await leadModel.countDocuments({
            status: {$ne: "Closed"}
        })
        res.status(200).json({totalLeadsInPipeline})
    } catch (error) {
        res.status(500).json({error: "Failed to fetch leads in pipeline", details: error.message})
    }
}

export {getLeadsClosedLastWeek, getTotalLeadsInPipeline}